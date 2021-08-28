import pool from '../database'
import jwt_decode from 'jwt-decode'

const createSale = async (req, res) => {
  const { quantity, status, description, id_product, id_client } = req.body
  // let listProducts = req.body.id_product


  try {
    const token = req.headers.authorization
    const decoded = jwt_decode(token.slice(7, -1))

    const inventory = await pool.query(
      'SELECT * FROM inventory WHERE id_store=?',
      [decoded.id]
    )
    const category = await pool.query('SELECT * FROM category WHERE id_inventory=?', [inventory[0].id])

    console.log(category)

    // const product = await pool.query('SELECT * FROM product WHERE id_category=?', [category[0].id])

    const product = await pool.query('SELECT * FROM product WHERE id=?', [id_product])



    for (let j = 0; j < product.length; ++j) {
      for (let i = 0; i < category.length; ++i) {

        if (product[j].id_category === category[i].id) {
          let price = product[j].unit_price * quantity
          let currQuantity = product[j].quantity - quantity

          console.log(currQuantity)
          const newSale = {
            date_sale: new Date(),
            quantity,
            status,
            description,
            price_sale: price,
            id_product,
            id_client
          }
          if (status === 1) {
            await pool.query('UPDATE product SET quantity=? WHERE id=?', [currQuantity, product[j].id])
            await pool.query('INSERT INTO sale SET ?', [newSale])

            return res.status(200).json({ message: 'Sale inserted successfully' })
          }
        }

      }
    }

  } catch (error) {
    console.log(error)
  }
}

module.exports = createSale