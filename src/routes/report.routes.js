import express from 'express'
import {
  createReport,
  createReportReceipt,
  createReportReceiptDebt,
} from '../controllers/report.controller'

import { verifyToken, isSeller } from '../middlewares/index'

const router = express.Router()

router.get('/get-report', [verifyToken, isSeller], createReport)
router.get('/get-report/receipt', [verifyToken, isSeller], createReportReceipt)
router.get(
  '/get-report/receipt-debt',
  [verifyToken, isSeller],
  createReportReceiptDebt
)
export default router
