import express from 'express'
const router = express.Router()
import { verifyToken, isSeller, upload } from '../middlewares/index'
import {
  createProducts,
  getPhoto,
  getShopCar,
} from '../controllers/product.controller'

router.post('/create-products', [verifyToken, isSeller], createProducts)

router.get('/product/:id', getPhoto)
router.get('/shop-car', [verifyToken, isSeller],getShopCar)

export default router
