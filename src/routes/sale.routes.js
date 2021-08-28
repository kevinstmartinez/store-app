import express from 'express'
const router = express.Router()
import createSale from '../controllers/sale.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/sale', [verifyToken, isSeller], createSale)

export default router