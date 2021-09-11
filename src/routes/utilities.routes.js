import express from 'express'
const router = express.Router()
import getUtilities from '../controllers/utilities.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.get('/utilities', [verifyToken, isSeller], getUtilities)
export default router
