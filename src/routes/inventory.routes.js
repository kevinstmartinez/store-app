import route from 'color-convert/route'
import express from 'express'
const router = express.Router()
import {createCategory,getInventory} from '../controllers/inventory.controller'

import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-category', [verifyToken, isSeller], createCategory)
router.get('/get-inventory', [verifyToken, isSeller],getInventory)
export default router
