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

    console.log(products)

    for (let i = 0; i < category.length; i++) {
      products.push(
        await pool.query('SELECT * FROM product where id_category=?', [
          category[i].id,
        ])
      )
    }

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].length; j++) {
        console.log('Nombre:', products[i][j].name)
        console.log('Producto costo unitario:', products[i][j].unit_cost)
        console.log('Cantidad de producto:', products[i][j].quantity)
        console.log(
          ' Costo de venta :',
          products[i][j].unit_cost * products[i][j].quantity
        )

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
    
    return res.status(200).json({
      products,
      totalExpense,
      totalSale,
      grossIncome,
      marginGrossIncome
    })
  } catch (e) {
    console.error(e)
  }
}

const getCostAndExpenses = (req, res) => {}

module.exports = getUtilities
