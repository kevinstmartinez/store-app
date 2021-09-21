import pool from '../database'
import jwt_decode from 'jwt-decode'
import pdf from 'pdfkit'
import fs from 'fs'
import moment from 'moment'
import axios from 'axios'

const createReport = async (req, res) => {
  let doc = new pdf({ margin: 50 })
  let dataUtilities

  const path = 'C:/Users/Yulian/Desktop/report.pdf'
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    const store = await pool.query('SELECT * FROM store WHERE id=?', [
      decoded.id,
    ])
    console.log('Store', store[0])
    const sales = await pool.query('SELECT * FROM sale WHERE id_store=?', [
      store[0].id,
    ])

    const report = {
      store: store,
      sale: sales,
    }
    createReport(report, path)
    async function createReport(report, path) {
      await generateHeader(doc)
      generateCustomerInformation(doc, report)
      await generateReporTable(doc, report)
      await generateFooter(doc)

      doc.end()
      doc.pipe(fs.createWriteStream(path))
    }
    async function generateHeader(doc) {
      const token = req.headers.authorization
      let data
      await axios
        .get('http://localhost:4000/api/balance/utilities', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then((res) => console.log((data = res.data)))
        .catch((err) => console.log(err))
      console.log('axios:', data)
      doc
        // .image('logo.png', 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Tenderosbog', 50, 57)
        .fontSize(13)
        .text('Utilidad: ' + data.grossIncome, 200, 65, { align: 'right' })
        .text('Margen de Utilidad: ' + data.marginGrossIncome, 200, 80, {
          align: 'right',
        })
        .moveDown()
    }
    function generateCustomerInformation(doc, report) {
      generateHr(doc, 185)

      const customerInformationTop = 200
      doc
        .text(
          `Nombre: ${report.store[0].store_name}`,
          50,
          customerInformationTop
        )
        .text(
          `Celular: ${report.store[0].phone}`,
          50,
          customerInformationTop + 15
        )
        .text(
          `Direccion: ${report.store[0].address}`,
          50,
          customerInformationTop + 30
        )
        .moveDown()
      generateHr(doc, 252)
    }

    async function generateFooter(doc) {}

    function generateHr(doc, y) {
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
    }
    async function generateReporTable(doc, report) {
      let reportTableTop = 330
      for (let i = 0; i < report.sale.length; i++) {
        const item = report.sale[i]
        const invoiceTableTop = 330
        const position = reportTableTop + (i + 1) * 50
        let dateString = moment(item.date_sale).format('YYYY-MM-DD')
        const clientsSales = await pool.query(
          'SELECT name,lastname FROM client WHERE id=?',
          [item.id_client]
        )
        /*         console.log('cliente report', clientsSales[0])
         */
        doc.font('Helvetica-Bold')
        generateTableRow(
          doc,
          invoiceTableTop,
          'Fecha',
          'Nombre',
          'Descripción',
          'Total venta',
          'Total deuda'
        )
        generateHr(doc, invoiceTableTop + 20)

        generateTableRow(
          doc,
          position,
          dateString,
          clientsSales[0].name + ' ' + clientsSales[0].lastname,
          item.description,
          item.total_sale,
          item.total_debt
        )
        generateHr(doc, position + 20)
        /* console.log('sales items', item) */
      }
    }

    function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
      doc
        .fontSize(12)
        .text(c1, 50, y)
        .text(c2, 150, y)
        .text(c3, 250, y, { width: 90, align: 'right' })
        .text(c4, 360, y, { width: 90, align: 'right' })
        .text(c5, 0, y, { align: 'right' })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = createReport
