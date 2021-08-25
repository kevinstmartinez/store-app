import express from 'express'
const router = express.Router()
import { verifyToken, isSeller } from '../middlewares/index'
import createProducts from '../controllers/product.controller'
router.post('/create-products', [verifyToken, isSeller], createProducts)
export default router