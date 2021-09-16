import express from 'express'
import createReport from '../controllers/report.controller'
import { verifyToken, isSeller } from '../middlewares/index'

const router = express.Router()

router.get('/get-report', [verifyToken, isSeller], createReport)

export default router