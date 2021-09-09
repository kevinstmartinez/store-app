import pool from '../database'
import jwt_decode from 'jwt-decode'

const createCategory = async (req, res) => {
  const { name } = req.body

  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const inventory = await pool.query(
      'SELECT * FROM inventory WHERE id_store=?',
      [decoded.id]
    )
    await pool.query('INSERT INTO category SET ?', {
      name,
      id_inventory: inventory[0].id,
    })
    return res.status(200).json({
      message: 'Categoria insertada correctamente',
    })
  } catch (e) {
    console.error(e)
  }
}

const getInventory = async (req, res) => {
  let products = []

  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const inventory = await pool.query(
      'SELECT * FROM inventory WHERE id_store=?',
      [decoded.id]
    )
    const category = await pool.query(
      'SELECT * FROM category WHERE id_inventory=?',
      [inventory[0].id]
    )
    
    console.log(products)

    for (let i = 0; i < category.length; i++) {
      products.push(
        await pool.query('SELECT * FROM product where id_category=?', [
          category[i].id,
        ])
      )
    }
  
    return res.status(200).json({
      inventory,
      category,
      products
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = { createCategory, getInventory }
