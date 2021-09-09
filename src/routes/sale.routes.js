import express from 'express'
const router = express.Router()
import {
  createSale,
  createSaleProduct,
  createDebtSale,
  getSales,
  getDebts,
  payDebt
} from '../controllers/sale.controller'

import { verifyToken, isSeller } from '../middlewares/index'

router.post('/sale', [verifyToken, isSeller], createSale)
router.post('/sale_product', [verifyToken, isSeller], createSaleProduct)
router.post('/sale_debt', [verifyToken, isSeller], createDebtSale)
router.post('/payment', [verifyToken, isSeller], payDebt)
router.get('/get-sales', [verifyToken, isSeller], getSales)
router.get('/get-debts', [verifyToken, isSeller], getDebts)



export default router