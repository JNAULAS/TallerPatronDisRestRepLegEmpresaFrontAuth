import { Router } from 'express'
import * as authCtrl from '../controllers/auth.controller'
import { is_admin, verify_token } from '../middlewares/auth.jwt'
const router = Router()

router.post('/signin', authCtrl.sign_in)
// Verifica validez de tocken
router.get('/verifica',verify_token, is_admin)

export default router
