import express from 'express'
import morgan from 'morgan'

import register from './routes/authentication.routes'
import login from './routes/authentication.routes'
import createCategory from './routes/inventory.routes'
import getInventory from './routes/inventory.routes'
import creatSupplier from './routes/supplier.routes'
import createProducts from './routes/products.routes'
import getPhoto from './routes/products.routes'
import createClient from './routes/client.routes'
import createSale from './routes/sale.routes'
import createDebtSale from './routes/sale.routes'

const app = express()
const session = require('express-session')
const port = 4000 || process.env.PORT
app.use(
  session({
    secret: 'mykey',
    saveUninitialized: false,
    resave: false,
  })
)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(require('./routes'))
app.use('/auth', register)
app.use('/auth', login)
app.use('/inventory', createCategory)
app.use('/supplier', creatSupplier)
app.use('/products', createProducts)
app.use('/client', createClient)
app.use('/products', getPhoto)
app.use('/api/sales/', createSale)
app.use('/api/sales/', createDebtSale)
app.use('/api/inventory', getInventory)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
