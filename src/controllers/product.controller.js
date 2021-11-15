import pool from '../database'
import jwt_decode from 'jwt-decode'
import { get } from '../routes'


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
    console.log(parseInt('770' + generateBarCode()))
    const create_product = await pool.query('INSERT INTO product SET?', {
      barcode: '770' + generateBarCode(),
      expiration_date: date,
      id_category,
      id_supplier: supplier[0].id,
      image,
      name,
      quantity,
      stock: quantity,
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
    console.log(e)
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
    products,
  })
}

const generateBarCode = () => {
  let num = ''
  while (num.length < 10) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

const updateProduct = async (req, res) => {
  const { id } = req.params
  const {
    expiration_date,
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
    const getProductId = await pool.query('SELECT * FROM product WHERE id=?', [id])
    console.log(getProductId[0])

    const newProduct = { id:getProductId[0].id, barcode:getProductId[0].barcode, image: getProductId[0].image, expiration_date:getProductId[0].expiration_date,  name, quantity: getProductId[0].quantity += quantity, unit_cost, unit_price, id_category: getProductId[0].id_category, id_supplier: getProductId[0].id_supplier, stock: getProductId[0].stock += quantity }
    
   await pool.query('UPDATE product SET ? WHERE id=?', [newProduct, id])
    
    return res.status(201).json({ message: 'Product updated successfully' })
  } catch (e) {
    console.log(e)
  }
}

const getShopCar = async (req, res) => {
  let car = []
  try {
    const idSession = await pool.query('SELECT data FROM sessions')

    let idSessionSale = JSON.parse(idSession[0].data)

    const current_sale = await pool.query(
      'SELECT * FROM sale_product WHERE id_sale=?',
      [idSessionSale.id_sale]
    )
    console.log(current_sale)
    const current_sale_debt = await pool.query(
      'SELECT * FROM sale_debt WHERE id_sale=?',
      [idSessionSale.id_sale]
    )
    console.log(current_sale_debt)

    for (let index = 0; index < current_sale.length; ++index) {
      const cli = await pool.query(
        'SELECT * FROM product WHERE id=?',
        current_sale[index].id_product
      )

      cli.price_sale = current_sale[index].price_sale
      cli.id_carproduct = current_sale[index].id
      console.log('Actual_sale', cli)
      car.push(cli)
    }
    let arr = []
    car.map((index) => {
      index.map((jotax) => {
        arr.push({
          id: jotax.id,
          barcode: jotax.barcode,
          image: jotax.image,
          name: jotax.name,
          expiration_date: jotax.expiration_date,
          price_sale: index.price_sale,
          id_carproduct: index.id_carproduct,
          tipo: 1,
        })
      })
    })
    return res.status(200).json({
      arr,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({})
  }
}

module.exports = { createProducts, getPhoto, getShopCar, updateProduct }
