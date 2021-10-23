import pool from '../database'
import jwt_decode from 'jwt-decode'
import pdf from 'pdfkit'
import fs from 'fs'
import moment from 'moment'
import getSales from '../controllers/sale.controller'
import getClient from '../controllers/client.controller'
import getUtilities from '../controllers/utilities.controller'


const getStore = async (req, res) =>{
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    console.log(decoded.id)
    const store = await pool.query('SELECT * FROM store WHERE id=?',[decoded.id])
    return res.status(200).json(store[0])
  }catch(e){
    console.log(e)
  }
}

const createReport =  async(req, res) => {
  // const store = await getStore()
  // // const clients = await getClient()
  // const sales = await getSales()
  // const utilities = await getUtilities()
  // const report = {
  //   ...store,
  //   ...clients,
  //   ...sales,
  //   ...utilities
  // }
  console.log(await getStore())
}
const clients = () => getClient()
 

module.exports = createReport
