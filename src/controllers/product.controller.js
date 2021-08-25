import pool from '../database'
import jwt_decode from 'jwt-decode'

const createProducts = async (req, res) => {
  const {
    barcode,
    expiration_date,
    id_category,
    id_supplier,
    image,
    name,
    quantity,
    unit_cost,
    unit_price,
  } = req.body
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    console.log(decoded)
    const inventory = await pool.query(
      'SELECT * FROM inventory WHERE id_store=?',
      [decoded.id]
    )

    const category = await pool.query(
      'SELECT * FROM category WHERE id_inventory=?',
      [inventory[0].id]
    )

    const supplier = await pool.query(
      'SELECT * FROM supplier WHERE id_store=?',
      [decoded.id]
    )
     
  
    

    await pool.query('INSERT INTO product SET?', {
      barcode,
      expiration_date,
      id_category:category[0].id,
      id_supplier:supplier[0].id,
      //image,
      name,
      quantity,
      unit_cost,
      unit_price,
    }) 

    console.log(category)
    console.log(inventory)
    console.log(supplier)
     return res.status(200).json({
       message: 'Product register successfully',
     })
  } catch (e) {

      return res.status(400).json({
        message : "Failed"
      })
  }
}

module.exports = createProducts
