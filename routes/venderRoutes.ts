import express from 'express'
import {
	addFood,
	getFoods,
	getVenderProfile,
	getVenderService,
	updateVenderCoverImages,
	updateVenderProfile,
	venderLogin,
} from '../controllers/venderController'
import { Authenticate } from '../middlewares'

const router = express.Router()
router.post('/login', venderLogin)
router.use(Authenticate)
router.route('/profile').get(getVenderProfile).patch(updateVenderProfile)

router.route('/food').get(getFoods).post(addFood)

router.patch("/coverImages",updateVenderCoverImages)
router.patch('/service', getVenderService)
router.get('/', (_req, res) => {
	return res.json({
		route: 'vender',
	})
})

export { router as venderRoutes }
