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
  const date = new Date(req.body.expiration_date)

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

    const create_product = await pool.query('INSERT INTO product SET?', {
      barcode,
      expiration_date: date,
      id_category,
      id_supplier: supplier[0].id,
      image: req.file.filename,
      name,
      quantity,
      unit_cost,
      unit_price,
    })

    console.log(category)
    console.log(inventory)
    console.log(supplier)
    console.log(create_product)
    return res.status(200).json({
      message: 'Product register successfully',
      create_product,
    })
  } catch (e) {
    return res.status(400).json({
      message: 'Failed',
    })
  }
}

const getPhoto = async (req, res) => {
  const { id } = req.params
  const products = await pool.query('SELECT * FROM product WHERE id=?', [id])
  console.log(products)
   return res.status(200).json({
        products
   })
}

 
module.exports = { createProducts, getPhoto }
