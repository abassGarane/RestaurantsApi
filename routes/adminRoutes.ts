import express from 'express'
import { createVender, getVenderById, getVenders } from '../controllers'

const router = express.Router()
router.post('/vender', createVender)
router.get('/vender', getVenders)
router.get('/vender/:id', getVenderById)
router.get('/', (_req, res) => {
	return res.json({
		route: 'admin',
	})
})
export { router as adminRoutes }
