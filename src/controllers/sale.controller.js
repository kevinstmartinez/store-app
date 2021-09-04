import pool from '../database'
import jwt_decode from 'jwt-decode'

const createSale = async (req, res) => {
  const { id_client, status, description } = req.body
  const date = new Date()
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    console.log(decoded)
    await pool.query(
      'INSERT INTO sale SET ?',
      {
        date_sale: date,
        id_client,
        id_store: decoded.id,
        status,
        description,
      },
      function (error, results, fields) {
        if (error) {
          console.log(error)
        } else {
          // Your row is inserted you can view
          console.log(results.insertId)
          req.session.id_sale = results.insertId
          return res.status(200).json({
            message: 'sale register successfully',
          })
        }
      }
    )
  } catch (e) {
    console.error(e)
  }
}

const createSale_product = async (req, res) => {
  const { id_product, quantity_sale } = req.body
  let descount_quantity = 0
  let price_sale = 0

  try {
    const product = await pool.query('SELECT * FROM product where id=?', [
      id_product,
    ])
    console.log(product)
    for (let i = 0; i < product.length; i++) {
      console.log(product[i])
      console.log((descount_quantity = product[i].quantity - quantity_sale))
      console.log((price_sale = product[i].unit_price * quantity_sale))
    }

    await pool.query('UPDATE product set quantity=? WHERE id=?', [
      descount_quantity,
      id_product,
    ])

    await pool.query('INSERT INTO sale_product SET ?', {
      id_sale: req.session.id_sale,
      id_product,
      quantity_sale,
      quantity_price: price_sale,
    })

    return res.status(200).json({
      message: 'sale_product register successfully',
    })
  } catch (error) {
    console.log(error)
  }
}

const createDebt_sale = async (req, res) => {
  const { id_product, quantity_sale } = req.body
  let descount_quantity = 0
  let price_sale = 0
  let products = []
  try {
    const product = await pool.query('SELECT * FROM product where id=?', [
      id_product,
    ])
    console.log(' Producto :', product[0].id)
    if(product[0].id != id_product){
      return res.status(404).json(
        {
          message : 'Product not found'
        }
      )
    }
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
    console.log(products)
    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < products[i].length; j++) {

        console.log("i","-->",i, "j","--->",j,"producto","-->",products[i][j])

        }
   
   
    }


    for (let i = 0; i < product.length; i++) {
      console.log((descount_quantity = product[i].quantity - quantity_sale))
      console.log((price_sale = product[i].unit_price * quantity_sale))
    }

    await pool.query('UPDATE product set quantity=? WHERE id=?', [
      descount_quantity,
      id_product,
    ])

    await pool.query('INSERT INTO sale_debt SET ?', {
      id_sale: req.session.id_sale,
      id_product,
      quantity_sale,
      quantity_price: price_sale,
    })

    return res.status(200).json({
      message: 'debt_sale register successfully',
    })
  } catch (error) {
    console.log(error)
  }
}

// const payDebt = async (req, res) => {
//   const { id, payment } = req.body
//   let descount_quantity = 0
//   let price_sale = 0
//   let toPay=0

//   try {
//     const product = await pool.query('SELECT * FROM product where id=?', [
//       id_product,
//     ])
//     console.log(product)
//     for (let i = 0; i < product.length; i++) {
//       console.log(product[i])
//       console.log((descount_quantity = product[i].quantity - quantity_sale))
//       /* console.log((price_sale = product[i].unit_price * quantity_sale)) */
//     }

//     await pool.query('UPDATE product set quantity=? WHERE id=?', [
//       descount_quantity,
//       id_product,
//     ])

//     await pool.query('INSERT INTO sale_debt SET ?', {
//       id_sale: req.session.id_sale,
//       id_product,
//       quantity_sale,
//       quantity_price: price_sale,
//     })

//     return res.status(200).json({
//       message: 'debt_sale register successfully',
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

module.exports = { createSale, createSale_product, createDebt_sale }
