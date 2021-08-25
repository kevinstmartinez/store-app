import express from 'express'
const router = express.Router()
import createSupplier from '../controllers/supplier.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-supplier', [verifyToken, isSeller], createSupplier)
export default router
