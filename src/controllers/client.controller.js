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

    for (var i = 0; i < client.length; i++) {
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
module.exports = createClient
