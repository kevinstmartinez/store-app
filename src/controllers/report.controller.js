import pool from '../database'
import jwt_decode from 'jwt-decode'
import pdf from 'pdfkit'
import fs from 'fs'
import moment from 'moment'
import axios from 'axios'
import express from 'express'
const router = express.Router()
const createReport = async (req, res) => {
  let doc = new pdf({ margin: 50 })
  let dataUtilities

  const path = 'C:/Users/Yulian/Documents/Reportes/report.pdf'
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
      try {
        await generateHeader(doc)
        generateCustomerInformation(doc, report)
        await generateReporTable(doc, report)
        await generateFooter(doc)

        doc.pipe(fs.createWriteStream(path)) // write to PDF
        doc.pipe(res)

        doc.end()
        return res.status(200)
      } catch (error) {
        console.log(error)
      }
    }
    async function generateHeader(doc) {
      const token = req.headers.authorization
      let data
      let data2
      await axios
        .get('http://localhost:4000/api/balance/utilities', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then((res) => console.log((data = res.data)))
        .catch((err) => console.log(err))
      await axios
        .get('http://localhost:4000/api/products/most-seller-products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then((res) => console.log((data2 = res.data)))
        .catch((err) => console.log(err))

      console.log(data2.products[0])

      console.log('axios:', data)
      doc
        // .image('logo.png', 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(10)
        .text('Reporte General - Tenderosbog', 50, 57)
        .fontSize(13)
        .text('Utilidad: ' + data.grossIncome, 200, 65, { align: 'right' })
        .text('Margen de Utilidad: ' + data.marginGrossIncome, 200, 80, {
          align: 'right',
        })
        .fontSize(13)
        .text(
          'Producto mas vendido: ' +
            data2.products[0].name +
            data2.products[0].total,
          200,
          95,
          {
            align: 'right',
          }
        )
        .moveDown()
    }
    function generateCustomerInformation(doc, report) {
      // generateHr(doc, 185)

      const customerInformationTop = 90
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
      //  generateHr(doc, 200)
    }

    async function generateFooter(doc) {}

    function generateHr(doc, y) {
      doc
        .strokeColor('#aaaaaa')
        //.lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
    }
    async function generateReporTable(doc, report) {
      let reportTableTop = 200
      for (let i = 0; i < report.sale.length; i++) {
        const item = report.sale[i]
        const invoiceTableTop = 200
        const position = reportTableTop + (i + 1) * 12
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
        // generateHr(doc, invoiceTableTop + 20)

        generateTableRow(
          doc,
          position,
          dateString,
          clientsSales[0].name + ' ' + clientsSales[0].lastname,
          item.description,
          item.total_sale,
          item.total_debt
        )
        //generateHr(doc, position + 20)
        /* console.log('sales items', item) */
      }
    }

    function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
      doc
        .fontSize(8)
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
const createReportReceipt = async (req, res) => {
  let doc = new pdf({ margin: 50 })
  let dataUtilities

  const path = 'C:/Users/Yulian/Documents/Facturas/fact.pdf'
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
      try {
        await generateHeader(doc)
        generateCustomerInformation(doc, report)
        await generateReporTable(doc, report)
        await generateFooter(doc)

        doc.pipe(fs.createWriteStream(path)) // write to PDF
        doc.pipe(res)

        doc.end()
        // await pool.query('TRUNCATE TABLE sessions')

        return res.status(200)
      } catch (error) {
        console.log(error)
      }
    }
    async function generateHeader(doc) {
      const token = req.headers.authorization
      let data
      let data2

      const idSession = await pool.query('SELECT data FROM sessions')

      let idSessionSale = JSON.parse(idSession[0].data)
      const client = await pool.query('SELECT id_client FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      const total = await pool.query('SELECT total_sale FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      const clientsSales = await pool.query('SELECT * FROM client WHERE id=?', [
        client[0].id_client,
      ])
      console.log('Mi cliente', clientsSales)
      //console.log(data2.products[0])

      // console.log('axios:', data)
      doc
        .image(
          'C:/Users/Yulian/Desktop/Practica4/store-app/src/images/logo.png',
          0,
          20,
          { width: 400, height: 90 }
        )
        .fillColor('#0f3492')
        .fontSize(15)
        .text('', 150, 60)
        .fontSize(13)

        /*   .text(
          'Cliente: ' + clientsSales[0].name + ' ' + clientsSales[0].lastname,
          200,
          65,
          {
            align: 'right',
          }
        )
        .text('Telefono: ' + clientsSales[0].phone, 200, 80, {
          align: 'right',
        }) */
        /* .text('Total deuda: ' + total[0].total_debt, 500, 95, {
          align: 'right',
        }) */

        .text(`Contacto: ${report.store[0].phone}`, 200, 105, {
          align: 'right',
        })
        .text(`Direccion: ${report.store[0].address}`, 200, 120, {
          align: 'right',
        })
        .moveDown()
    }
    function generateCustomerInformation(doc, report) {
      // generateHr(doc, 185)

      const customerInformationTop = 150
      doc
        .fontSize(16)
        .fillColor('#0f3492')
        .text(`${report.store[0].store_name}`, 50, customerInformationTop)

        .moveDown()
      //  generateHr(doc, 200)
    }

    async function generateFooter(doc) {
      const idSession = await pool.query('SELECT data FROM sessions')
      let idSessionSale = JSON.parse(idSession[0].data)

      const client = await pool.query('SELECT id_client FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])

      const clientsSales = await pool.query('SELECT * FROM client WHERE id=?', [
        client[0].id_client,
      ])
      const total = await pool.query('SELECT total_sale FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      doc

        .text('' + total[0].total_sale, 0, 600, {
          align: 'right',
          width: 500,
        })
        .text('Total: ' + total[0].total_sale, 0, 600, {
          align: 'right',
          width: 500,
        })

        .fontSize(16)
        //.fillColor('#0f3492')
        .text(`Informacion del cliente:`, 40, 590, {
          align: 'left',
          width: 500,
        })
        .fontSize(10)
        .text(
          'Cliente: ' + clientsSales[0].name + ' ' + clientsSales[0].lastname,
          40,
          620,
          {
            align: 'left',
            width: 500,
          }
        )
        .text('Telefono: ' + clientsSales[0].phone, 40, 650, {
          align: 'left',
          width: 500,
        })
    }

    function generateHr(doc, y) {
      doc
        .strokeColor('#aaaaaa')
        //.lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
    }
    async function generateReporTable(doc, report) {
      let reportTableTop = 200
      let car = []

      const idSession = await pool.query('SELECT data FROM sessions')

      let idSessionSale = JSON.parse(idSession[0].data)

      const current_sale = await pool.query(
        'SELECT * FROM sale_product WHERE id_sale=?',
        [idSessionSale.id_sale]
      )

      console.log(current_sale)

      for (let index = 0; index < current_sale.length; ++index) {
        const cli = await pool.query(
          'SELECT * FROM product WHERE id=?',
          current_sale[index].id_product
        )

        cli.price_sale = current_sale[index].price_sale
        cli.id_carproduct = current_sale[index].id
        cli.quantity = current_sale[index].quantity_sale
        console.log('Actual_sale', cli)
        car.push(cli)
      }
      let arr = []
      car.map((index) => {
        index.map((jotax) => {
          arr.push({
            id: jotax.id,
            barcode: jotax.barcode,
            image: jotax.image,
            name: jotax.name,
            expiration_date: jotax.expiration_date,
            price_sale: index.price_sale,
            id_carproduct: index.id_carproduct,
            tipo: 1,
            quantity: index.quantity,
          })
        })
      })

      for (let i = 0; i < arr.length; i++) {
        console.log('Current sale', arr)
        const item = arr[i]
        const invoiceTableTop = 220
        const position = reportTableTop + (i + 1) * 55
        let dateString = moment(item.expiration_date).format('YYYY-MM-DD')

        /*

        /*         console.log('cliente report', clientsSales[0])
         */
        doc.font('Helvetica-Bold')
        generateTableRow(
          doc,
          invoiceTableTop,
          'Fecha',
          'Producto',
          'Cantidad',
          'Precio'
          //   'Imagen'
        )
        // generateHr(doc, invoiceTableTop + 20)
        console.log(item.name)
        generateTableRow(
          doc,
          position,
          dateString,
          item.name, // clientsSales[0].name + ' ' + clientsSales[0].lastname,
          item.quantity,
          item.price_sale
          //  item.barcode
        )
        //generateHr(doc, position + 20)
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
const createReportReceiptDebt = async (req, res) => {
  let doc = new pdf({ margin: 50 })
  let dataUtilities

  const path = 'C:/Users/Yulian/Documents/Facturas/fact.pdf'
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
      try {
        await generateHeader(doc)
        generateCustomerInformation(doc, report)
        await generateReporTable(doc, report)
        await generateFooter(doc)

        doc.pipe(fs.createWriteStream(path)) // write to PDF
        doc.pipe(res)

        doc.end()
        // await pool.query('TRUNCATE TABLE sessions')
        return res.status(200)
      } catch (error) {
        console.log(error)
      }
    }
    async function generateHeader(doc) {
      const token = req.headers.authorization
      let data
      let data2

      const idSession = await pool.query('SELECT data FROM sessions')

      let idSessionSale = JSON.parse(idSession[0].data)
      const client = await pool.query('SELECT id_client FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      const total = await pool.query('SELECT total_debt FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      const clientsSales = await pool.query('SELECT * FROM client WHERE id=?', [
        client[0].id_client,
      ])
      console.log('Mi cliente', clientsSales)
      //console.log(data2.products[0])

      // console.log('axios:', data)
      doc
        .image(
          'C:/Users/Yulian/Desktop/Practica4/store-app/src/images/logo.png',
          0,
          20,
          { width: 400, height: 90 }
        )
        .fillColor('#0f3492')
        .fontSize(15)
        .text('', 150, 60)
        .fontSize(13)

        /*   .text(
          'Cliente: ' + clientsSales[0].name + ' ' + clientsSales[0].lastname,
          200,
          65,
          {
            align: 'right',
          }
        )
        .text('Telefono: ' + clientsSales[0].phone, 200, 80, {
          align: 'right',
        }) */
        /* .text('Total deuda: ' + total[0].total_debt, 500, 95, {
          align: 'right',
        }) */

        .text(`Contacto: ${report.store[0].phone}`, 200, 105, {
          align: 'right',
        })
        .text(`Direccion: ${report.store[0].address}`, 200, 120, {
          align: 'right',
        })
        .moveDown()
    }
    function generateCustomerInformation(doc, report) {
      // generateHr(doc, 185)

      const customerInformationTop = 150
      doc
        .fontSize(16)
        .fillColor('#0f3492')
        .text(`${report.store[0].store_name}`, 50, customerInformationTop)

        .moveDown()
      //  generateHr(doc, 200)
    }

    async function generateFooter(doc) {
      const idSession = await pool.query('SELECT data FROM sessions')
      let idSessionSale = JSON.parse(idSession[0].data)

      const client = await pool.query('SELECT id_client FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])

      const clientsSales = await pool.query('SELECT * FROM client WHERE id=?', [
        client[0].id_client,
      ])
      const total = await pool.query('SELECT total_debt FROM sale WHERE id=?', [
        idSessionSale.id_sale,
      ])
      doc

        .text('' + total[0].total_debt, 0, 600, {
          align: 'right',
          width: 500,
        })
        .text('Total: ' + total[0].total_debt, 0, 600, {
          align: 'right',
          width: 500,
        })

        .fontSize(16)
        //.fillColor('#0f3492')
        .text(`Informacion del cliente:`, 40, 590, {
          align: 'left',
          width: 500,
        })
        .fontSize(10)
        .text(
          'Cliente: ' + clientsSales[0].name + ' ' + clientsSales[0].lastname,
          40,
          620,
          {
            align: 'left',
            width: 500,
          }
        )
        .text('Telefono: ' + clientsSales[0].phone, 40, 650, {
          align: 'left',
          width: 500,
        })
    }

    function generateHr(doc, y) {
      doc
        .strokeColor('#aaaaaa')
        //.lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
    }
    async function generateReporTable(doc, report) {
      let reportTableTop = 200
      let car = []

      const idSession = await pool.query('SELECT data FROM sessions')

      let idSessionSale = JSON.parse(idSession[0].data)

      const current_sale = await pool.query(
        'SELECT * FROM sale_debt WHERE id_sale=?',
        [idSessionSale.id_sale]
      )

      console.log(current_sale)

      for (let index = 0; index < current_sale.length; ++index) {
        const cli = await pool.query(
          'SELECT * FROM product WHERE id=?',
          current_sale[index].id_product
        )

        cli.price_sale = current_sale[index].price_sale
        cli.id_carproduct = current_sale[index].id
        cli.quantity = current_sale[index].quantity_sale
        console.log('Actual_sale', cli)
        car.push(cli)
      }
      let arr = []
      car.map((index) => {
        index.map((jotax) => {
          arr.push({
            id: jotax.id,
            barcode: jotax.barcode,
            image: jotax.image,
            name: jotax.name,
            expiration_date: jotax.expiration_date,
            price_sale: index.price_sale,
            id_carproduct: index.id_carproduct,
            tipo: 1,
            quantity: index.quantity,
          })
        })
      })

      for (let i = 0; i < arr.length; i++) {
        console.log('Current sale', arr)
        const item = arr[i]
        const invoiceTableTop = 220
        const position = reportTableTop + (i + 1) * 55
        let dateString = moment(item.expiration_date).format('YYYY-MM-DD')

        /*

        /*         console.log('cliente report', clientsSales[0])
         */
        doc.font('Helvetica-Bold')
        generateTableRow(
          doc,
          invoiceTableTop,
          'Fecha',
          'Producto',
          'Cantidad',
          'Precio'
          //   'Imagen'
        )
        // generateHr(doc, invoiceTableTop + 20)
        console.log(item.name)
        generateTableRow(
          doc,
          position,
          dateString,
          item.name, // clientsSales[0].name + ' ' + clientsSales[0].lastname,
          item.quantity,
          item.price_sale
          //  item.barcode
        )
        //generateHr(doc, position + 20)
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

module.exports = { createReport, createReportReceipt, createReportReceiptDebt }
