import express from 'express'
const router = express.Router()
import {createClient,getClient} from '../controllers/client.controller'
import { verifyToken, isSeller } from '../middlewares/index'

router.post('/create-client', [verifyToken, isSeller],createClient)
router.get('/get-client',[verifyToken,isSeller],getClient)
export default router