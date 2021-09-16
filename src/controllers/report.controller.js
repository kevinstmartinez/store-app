import pool from '../database'
import jwt_decode from 'jwt-decode'
import pdf from 'pdfkit'
import fs from 'fs'
import moment from 'moment'


const createReport = async (req, res) =>{
  let doc = new pdf({ margin: 50 })
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    const store = await pool.query('SELECT * FROM store WHERE id=?',[decoded.id])
    const sales = await pool.query('SELECT * FROM sale WHERE id_store=?',[store[0].id])
    const clients = await pool.query('SELECT id_client FROM sale WHERE id_store=?',[store[0].id])
    const clientsSales = await pool.query('SELECT * FROM client WHERE id=?',[clients[0].id_client])
    console.log(clientsSales)


    let dateString = moment(sales[0].date_sale).format('YYYY-MM-DD')
    const report ={
      store: store[0].store_name,
      items: [
        {
          fecha: dateString,
          cliente: clientsSales[0].name,
          descripcion: sales[0].description,
          valor: sales[0].total_sale
        }
        
      ]
    }

    let reportTableTop = 330

  for (let i = 0; i < report.items.length; i++) {
    const item = report.items[i];
    const position = reportTableTop + (i + 1) * 50;
    generateTableRow(
      doc,
      position,
      item.fecha,
      item.cliente,
      item.descripcion,
      item.valor
    );
  }
    doc.pipe(fs.createWriteStream('/Users/root1/Desktop/report.pdf'))
    doc
    .fontSize(20)
    .text(store[0].store_name, 110, 57)
    doc.end()
  } catch (error) {
    console.log(error)
  }
}



function header(doc){

}

function content(doc){
  
}

function footer(doc){
  
}

function generateTableRow(doc, y, c1, c2, c3, c4) {
  doc
    .fontSize(10)
    .text(c1, 50, y, { width: 200, align: "left" })
    .text(c2, 150, y, { width: 90, align: "center" })
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
}

module.exports = createReport
