import pool from '../database'
import jwt_decode from 'jwt-decode'

const createSupplier = async (req, res) => {
  const { name, lastname, phone } = req.body
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    console.log(decoded)
    const suppliers = await pool.query(
      'SELECT * FROM supplier WHERE id_store=?',
      [decoded.id]
    )
    console.log(suppliers)
    console.log(phone)

    for(var i=0; i<suppliers.length;i++) {
      if (suppliers[i].phone == phone) {
         return res.status(400).json({
          message: 'The supplier is already register, verify the fields.',
          
        })
        break;
      }
    }

    await pool.query('INSERT INTO supplier SET ?', {
      name,
      lastname,
      phone,
      id_store: decoded.id,
    })
    return res.status(200).json({
      message: 'Supplier register successfully',
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = createSupplier
