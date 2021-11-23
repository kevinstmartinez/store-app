import pool from '../database'
import jwt_decode from 'jwt-decode'
const createClient = async (req, res) => {
  const { name, lastname, phone } = req.body
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    console.log(decoded)
    const client = await pool.query(
      'SELECT * FROM client WHERE id_store=?',
      [decoded.id]
    )
    console.log(client)
    console.log(phone)

    for (let i = 0; i < client.length; i++) {
      if (client[i].phone == phone) {
        return res.status(400).json({
          message: 'The client is already register, verify the fields.',
        })
        break
      }
    }

    await pool.query('INSERT INTO client SET ?', {
      name,
      lastname,
      phone,
      id_store: decoded.id,
    })
    return res.status(200).json({
      message: 'client register successfully',
    })
  } catch (e) {
    console.error(e)
  }
}


const getClient = async (req, res) => {

  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    console.log(decoded)
    const client = await pool.query('SELECT * FROM client WHERE id_store=?', [
      decoded.id,
    ])


    return res.status(200).json({
      message: 'Clientes',
      client
    })

  } catch (e) {
    console.error(e)
  }
}

const mostDebtClient = async (req, res) => {
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    console.log(decoded)
    const clients = await pool.query('SELECT CL.* FROM (SELECT AB.id_client, AB.name, AB.id_store, SUM(C.price_sale) AS total FROM (SELECT A.id AS id_client, B.id AS id_sale, B.id_store AS id_store, A.name FROM ( SELECT * FROM client ) A INNER JOIN ( SELECT * FROM sale )B ON A.id = B.id_client) AB LEFT JOIN ( SELECT * FROM sale_debt )C ON AB.id_sale = C.id_sale WHERE AB.id_store = ? GROUP BY AB.id_client, AB.id_store) CL ORDER BY CL.total DESC LIMIT 5', [decoded.id])
  
    return res.status(200).json({
      clients
    })
  } catch (e) {
    console.error(e)
    res.status(400).json({ e })
  }
}

const clientsWithMostSale = async (req, res) =>{
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    console.log(decoded)

    const clients = await pool.query('SELECT CL.* FROM (SELECT AB.id_client, AB.name, AB.id_store, SUM(C.price_sale) AS total FROM (SELECT A.id AS id_client, B.id AS id_sale, B.id_store AS id_store, A.name FROM ( SELECT * FROM client ) A INNER JOIN ( SELECT * FROM sale )B ON A.id = B.id_client) AB LEFT JOIN ( SELECT * FROM sale_product )C ON AB.id_sale = C.id_sale WHERE AB.id_store =? GROUP BY AB.id_client, AB.id_store) CL ORDER BY CL.total DESC LIMIT 5', [decoded.id])
    return res.status(200).json({
      clients
    })

  }catch(e){
    console.error(e)
    res.status(400).json({ e })
  }
}
module.exports = { createClient, getClient, mostDebtClient, clientsWithMostSale }
