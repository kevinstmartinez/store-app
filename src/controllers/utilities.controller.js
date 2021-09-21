import pool from '../database'
import jwt_decode from 'jwt-decode'

const getUtilities = async (req, res) => {
  let products = []
  let totalExpense = 0
  let totalSale = 0
  let grossIncome = 0
  let marginGrossIncome = 0
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

  

    for (let i = 0; i < category.length; i++) {
      products.push(
        await pool.query('SELECT * FROM product where id_category=?', [
          category[i].id,
        ])
      )
    }

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].length; j++) {
     

        totalExpense += products[i][j].unit_cost * products[i][j].quantity
      }
    }

    const sales = await pool.query(
      'SELECT total_sale FROM sale WHERE id_store=?',
      [decoded.id]
    )

    for (let i = 0; i < sales.length; i++) {
      totalSale += sales[i].total_sale
    }
    grossIncome = totalSale -totalExpense
    marginGrossIncome = ( grossIncome / totalSale ) * 100
    const obj = {
      grossIncome,
      marginGrossIncome
    }
    
    return (res.status(200).json(obj))
  } catch (e) {
    console.error(e)
  }
}


module.exports = getUtilities
