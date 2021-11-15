import express from 'express'
const router = express.Router()
import {
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
} from '../controllers/sale.controller'

import { verifyToken, isSeller } from '../middlewares/index'

router.post('/sale', [verifyToken, isSeller], createSale)
router.post('/sale_product', [verifyToken, isSeller], createSaleProduct)
router.post('/sale_debt', [verifyToken, isSeller], createDebtSale)
router.post('/payment', [verifyToken, isSeller], payDebt)
router.get('/get-sales', [verifyToken, isSeller], getSales)
router.get('/get-debts', [verifyToken, isSeller], getDebts)
router.get('/get-currentsale', [verifyToken, isSeller], getcurrent_Sale)
router.get('/get-sale_products/:id', [verifyToken, isSeller], getsale_Product)
router.delete(
  '/delete_sale_product/:id',
  [verifyToken, isSeller],
  delete_sale_product
)
router.delete(
  '/delete_sale_debt/:id',
  [verifyToken, isSeller],
  delete_debt_product
)

export default router
