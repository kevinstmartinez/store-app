import express from 'express'
const router = express.Router()
import {createClient,getClient, mostDebtClient } from '../controllers/client.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-client', [verifyToken, isSeller],createClient)
router.get('/get-client',[verifyToken,isSeller],getClient)
router.get('/most-debt-client',[verifyToken,isSeller], mostDebtClient )
export default router