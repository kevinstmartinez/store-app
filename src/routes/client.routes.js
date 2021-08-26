import express from 'express'
const router = express.Router()
import createClient from '../controllers/client.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-client', [verifyToken, isSeller],createClient)
export default router