import express from 'express'
const router = express.Router()
import {
  createSale,
  createSale_product,
  createDebtSale,
} from '../controllers/sale.controller'

import { verifyToken, isSeller } from '../middlewares/index'

router.post('/sale', [verifyToken, isSeller], createSale)
router.post('/sale_product', [verifyToken, isSeller], createSale_product)
router.post('/sale_debt', [verifyToken, isSeller], createDebtSale)



export default router