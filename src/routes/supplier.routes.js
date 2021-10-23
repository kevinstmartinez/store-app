import express from 'express'
const router = express.Router()
import {createSupplier, getSupplier} from '../controllers/supplier.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-supplier', [verifyToken, isSeller], createSupplier)
router.get('/get-supplier', [verifyToken, isSeller], getSupplier)
export default router