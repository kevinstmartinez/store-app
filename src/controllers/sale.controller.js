import pool from '../database'
import jwt_decode from 'jwt-decode'

const createSale = async (req, res) => {
  const { id_client, status, description } = req.body
  const date = new Date()
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    console.log(decoded)

    const client = await pool.query('SELECT * FROM client WHERE id_store=?', [
      decoded.id,
    ])

    console.log(client)

    for (let i = 0; i < client.length; i++) {
      console.log(client[i])
      if (client[i].id == id_client) {
        await pool.query(
          'INSERT INTO sale SET ?',
          {
            date_sale: date,
            id_client,
            id_store: decoded.id,
            status,
            description,
            total_sale: 0,
            total_debt: 0,
          },
          async function (error, results, fields) {
            if (error) {
              console.log(error)
            } else {
              console.log(results.insertId)
              await pool.query('TRUNCATE TABLE sessions')
              req.session.id_sale = results.insertId
              return res.status(200).json({
                message: 'sale register successfully',
              })
            }
          }
        )
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const createSaleProduct = async (req, res) => {
  const { id_product, quantity_sale } = req.body
  let descount_quantity = 0
  let price_sale = 0
  let total_sale = 0
  let products = []

  try {
    const product = await pool.query('SELECT * FROM product where id=?', [
      id_product,
    ])

    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const inventory = await pool.query(
      'SELECT * FROM inventory WHERE id_store=?',
      [decoded.id]
    )
    const idSession = await pool.query('SELECT data FROM sessions')
    let idSessionSale = JSON.parse(idSession[0].data)

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
        console.log(
          'category que llega',
          product[0].id_category,
          'category compa:',
          products[i][j].id_category
        )
        console.log(
          'id que llega',
          product[0].id,
          'id compa:',
          products[i][j].id
        )
        if (products[i][j].id_category === product[0].id_category) {
          if (products[i][j].id === product[0].id) {
            if (products[i][j].stock >= quantity_sale) {
              console.log(
                (descount_quantity = products[i][j].stock - quantity_sale)
              )
              console.log(
                (price_sale = products[i][j].unit_price * quantity_sale)
              )

              await pool.query('UPDATE product set stock=? WHERE id=?', [
                descount_quantity,
                id_product,
              ])

              const total = await pool.query(
                'SELECT total_sale FROM sale WHERE id=?',
                [idSessionSale.id_sale]
              )
              total_sale += total[0].total_sale + price_sale

              await pool.query('UPDATE sale set total_sale=? WHERE id=?', [
                total_sale,
                idSessionSale.id_sale,
              ])

              await pool.query('INSERT INTO sale_product SET ?', {
                id_sale: idSessionSale.id_sale,
                id_product,
                quantity_sale,
                price_sale,
              })

              return res.status(200).json({
                message: 'Sale register successfully',
              })
            } else {
              return res.status(200).json({
                message: 'No stock availabel',
              })
            }
          }
        }
        console.log('no existe')
      }
    }
    return res.status(404).json({
      message: 'Product not found',
    })
  } catch (error) {
    console.log(error)
  }
}

const createDebtSale = async (req, res) => {
  const { id_product, quantity_sale } = req.body
  let descount_quantity = 0
  let price_sale = 0
  let total_debt = 0
  let products = []

  try {
    const product = await pool.query('SELECT * FROM product where id=?', [
      id_product,
    ])

    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const idSession = await pool.query('SELECT data FROM sessions')
    let idSessionSale = JSON.parse(idSession[0].data)

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
    console.log(products[0][1])

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].length; j++) {
        console.log(
          'category que llega',
          product[0].id_category,
          'category compa:',
          products[i][j].id_category
        )
        console.log(
          'id que llega',
          product[0].id,
          'id compa:',
          products[i][j].id
        )
        if (products[i][j].id_category === product[0].id_category) {
          if (products[i][j].id === product[0].id) {
            console.log(
              (descount_quantity = products[i][j].stock - quantity_sale)
            )
            console.log(
              (price_sale = products[i][j].unit_price * quantity_sale)
            )

            const total = await pool.query(
              'SELECT total_debt FROM sale WHERE id=?',
              [idSessionSale.id_sale]
            )
            total_debt += total[0].total_debt + price_sale

            await pool.query('UPDATE sale set total_debt=? WHERE id=?', [
              total_debt,
              idSessionSale.id_sale,
            ])

            await pool.query('UPDATE product set stock=? WHERE id=?', [
              descount_quantity,
              id_product,
            ])

            await pool.query('INSERT INTO sale_debt SET ?', {
              id_sale: idSessionSale.id_sale,
              id_product,
              quantity_sale,
              price_sale,
            })

            return res.status(200).json({
              message: 'debt_sale register successfully',
            })
          }
        }
        console.log('no existe')
      }
    }
    return res.status(404).json({
      message: 'Product not found',
    })
  } catch (error) {
    console.log(error)
  }
}

const payDebt = async (req, res) => {
  const { id_debt, payment } = req.body
  let now = new Date()
  try {
    const debt = await pool.query(
      'SELECT total_debt, total_sale FROM sale WHERE id=?',
      [id_debt]
    )
    const total_debt_init = await pool.query(
      'SELECT total_debt FROM sale WHERE id=?',
      [id_debt]
    )
    if (payment > total_debt_init[0].total_debt) return res.status(203).json({message: 'El pago no corresponde al monto de la deuda'})

    if (total_debt_init[0].total_debt == 0) {
      res.status(200).json({
        message: 'Deuda pagada',
      })
    } else {
      console.log('sale actually:', debt)

      let currentTotalSale = debt[0].total_debt - payment
      let pay = payment + debt[0].total_sale
      console.log('payment:', pay)
      console.log('currentTstate:', currentTotalSale)

      await pool.query('UPDATE sale SET date_sale = ? WHERE id=?', [
        now,
        id_debt,
      ])
      await pool.query(
        'UPDATE sale SET total_sale=?, total_debt=? WHERE id=?',
        [pay, currentTotalSale, id_debt]
      )

      const sale_updated = await pool.query(
        'SELECT total_debt, total_sale FROM sale WHERE id=?',
        [id_debt]
      )
      const total_debt = await pool.query(
        'SELECT total_debt FROM sale WHERE id=?',
        [id_debt]
      )
      
      console.log('total_debt:', total_debt[0].total_debt)
      console.log('sale_update:', sale_updated)
      //console.log("debt:",debt[0].total_debt)
      //  await pool.query('UPDATE sale SET status=1 WHERE id=?', [id_debt])

      total_debt[0].total_debt === 0
        ? (await pool.query('UPDATE sale SET status=1 WHERE id=?', [id_debt]),
          res.status(200).json({
            message: 'Deuda pagada',
          }))
        : res.status(200).json({
            message: 'Seguir pagando',
          })
    }
  } catch (error) {
    console.log(error)
  }
}
const getSales = async (req, res) => {
  let clients = []
  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const sale = await pool.query(
      'SELECT * FROM sale WHERE id_store=? AND total_debt=0',
      [decoded.id]
    )
    for (let index = 0; index < sale.length; ++index) {
      const cli = await pool.query(
        'SELECT * FROM client WHERE id=?',
        sale[index].id_client
      )
      clients.push(cli)
    }
    let arr = []
    clients.map((index) => {
      index.map((jotax) => {
        arr.push({
          id: jotax.id,
          name: jotax.name,
          lastname: jotax.lastname,
          phone: jotax.phone,
        })
      })
    })

    return res.status(200).json({ sales: sale, clients: arr })
  } catch (error) {
    console.log(error)
  }
}
const getDebts = async (req, res) => {
  let clients = []

  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))
    const debt = await pool.query(
      'SELECT * FROM sale WHERE id_store=? AND total_debt>0',
      [decoded.id]
    )
    for (let index = 0; index < debt.length; ++index) {
      const cli = await pool.query(
        'SELECT * FROM client WHERE id=?',
        debt[index].id_client
      )
      clients.push(cli)
    }
    let arr = []
    clients.map((index) => {
      index.map((jotax) => {
        arr.push({
          id: jotax.id,
          name: jotax.name,
          lastname: jotax.lastname,
          phone: jotax.phone,
        })
      })
    })

    return res.status(200).json({ Debt: debt, clients: arr })
  } catch (error) {
    console.log(error)
  }
}

const getsale_Product = async (req, res) => {
  try {
    const { id } = req.params
    const products = await pool.query(
      'SELECT * FROM sale_product WHERE id_sale=?',
      [id]
    )
    console.log(products)
    return res.status(200).json({
      products,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
}
const getcurrent_Sale = async (req, res) => {
  try {
    const idSession = await pool.query('SELECT data FROM sessions')
    let idSessionSale = JSON.parse(idSession[0].data)
    const sale = await pool.query('SELECT * FROM sale WHERE id=?', [
      idSessionSale.id_sale,
    ])
    let clients=[]
    for (let index = 0; index < sale.length; ++index) {
      const cli = await pool.query(
        'SELECT * FROM client WHERE id=?',
        sale[index].id_client
      )
      clients.push(cli)
    }
    let arr = []
    clients.map((index) => {
      index.map((jotax) => {
        arr.push({
          id: jotax.id,
          name: jotax.name,
          lastname: jotax.lastname,
          phone: jotax.phone,
        })
      })
    })

    return res.status(200).json({ sales: sale, clients: arr })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
}

const delete_sale_product = async (req, res) => {
  try {
    const { id } = req.params
    console.log(req.params.id)
    const idSession = await pool.query('SELECT data FROM sessions')

    let idSessionSale = JSON.parse(idSession[0].data)

    const total_sale = await pool.query(
      'SELECT total_sale FROM sale WHERE id=?',
      [idSessionSale.id_sale]
    )
    console.log(total_sale)

    const price_products = await pool.query(
      'SELECT price_sale FROM sale_product WHERE id=?',
      [id]
    )

    let grand_total = total_sale[0].total_sale - price_products[0].price_sale

    await pool.query('UPDATE sale SET total_sale=? where id=?', [
      grand_total,
      idSessionSale.id_sale,
    ])

    await pool.query('DELETE FROM sale_product where id=?', [id])

    const current_total_sale = await pool.query(
      'SELECT total_sale FROM sale WHERE id=?',
      [idSessionSale.id_sale]
    )

    /*  const products = await pool.query('DELETE FROM sale_product WHERE id=?', [
      id_sale_product,
    ]) */

    /* console.log(products) */
    return res.status(200).json({
      total_sale,
      price_products,
      grand_total,
      current_total_sale,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
}

const delete_debt_product = async (req, res) => {
  try {
    const { id } = req.params
    console.log(req.params.id)
    const idSession = await pool.query('SELECT data FROM sessions')

    let idSessionSale = JSON.parse(idSession[0].data)

    const total_debt = await pool.query(
      'SELECT total_debt FROM sale WHERE id=?',
      [idSessionSale.id_sale]
    )

    const price_products = await pool.query(
      'SELECT price_sale FROM sale_debt WHERE id=?',
      [id]
    )

    let grand_total = total_debt[0].total_debt - price_products[0].price_sale

    await pool.query('UPDATE sale SET total_debt=? where id=?', [
      grand_total,
      idSessionSale.id_sale,
    ])

    await pool.query('DELETE FROM sale_debt where id=?', [id])

    const current_total_sale = await pool.query(
      'SELECT total_debt FROM sale WHERE id=?',
      [idSessionSale.id_sale]
    )

    /*  const products = await pool.query('DELETE FROM sale_product WHERE id=?', [
      id_sale_product,
    ]) */

    /* console.log(products) */
    return res.status(200).json({
      total_debt,
      price_products,
      grand_total,
      current_total_sale,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
}

module.exports = {
  createSale,
  createSaleProduct,
  createDebtSale,
  getSales,
  getDebts,
  payDebt,
  getsale_Product,
  delete_sale_product,
  delete_debt_product,
  getcurrent_Sale,
}
