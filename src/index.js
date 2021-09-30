import express from 'express'
import morgan from 'morgan'

import getSupplier from './routes/supplier.routes'
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
import createSaleProduct from './routes/sale.routes'
import getSales from './routes/sale.routes'
import getDebts from './routes/sale.routes'
import payDebt from './routes/sale.routes'
import getUtilities from './routes/utilities.routes'
import getClient from './routes/client.routes'
import createReport from './routes/report.routes'
import cors from 'cors'

import { generateUploadURL } from './s3'

let allowedOrigins = ['http://localhost:3000']

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

app.use(cors({
  origin: function(origin, callback){

    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(require('./routes'))
app.use('/auth', register)
app.use('/auth', login)
app.use('/inventory', createCategory)
app.use('/supplier', creatSupplier)
app.use('/products', createProducts)
app.use('/client', createClient)
app.use('/client',getClient)
app.use('/products', getPhoto)
app.use('/api/sales/', createSale)
app.use('/api/sales/', createDebtSale)
app.use('/api/sales/', createSaleProduct)
app.use('/api/sales/', payDebt)
app.use('/api/inventory', getInventory)
app.use('/api/sales/', getSales)
app.use('/api/sales/', getDebts)
app.use('/api/balance/',getUtilities)
app.use('/api/report', createReport)
app.use('/api/supplier', getSupplier)

app.get('/s3Url', async (req, res) => {
  const url = await generateUploadURL()
  res.send({url})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
