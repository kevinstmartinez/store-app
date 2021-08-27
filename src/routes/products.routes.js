import express from 'express'
const router = express.Router()
import { verifyToken, isSeller, upload } from '../middlewares/index'
import {createProducts, getPhoto} from '../controllers/product.controller'

router.post('/create-products', [verifyToken, isSeller,upload.single('image') ] , createProducts)

router.get('/product/:id', getPhoto)

export default router