import { Router } from 'express'
import { get_Roles } from '../controllers/roles.controller'

const router = Router()

router.get('/', get_Roles)

export default router