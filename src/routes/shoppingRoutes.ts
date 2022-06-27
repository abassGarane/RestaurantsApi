import express from 'express'
import {
	findRestaurantById,
	getAvailableFoods,
	getFoodsIn30Mins,
	getTopRestaurants,
	searchFoods,
} from '../controllers'

const router = express.Router()

/** food availablility **/

router.get('/:pincode', getAvailableFoods)
/** top Restaurants **/
router.get('/topRestaurants/:pincode', getTopRestaurants)

/** foods available in 30 minutes **/
router.get('/foodsIn30min/:pincode', getFoodsIn30Mins)
/** search foods  **/

router.get('/search/:pincode', searchFoods)

/** find Restaurant by id  **/
router.get('/restaurant/:id', findRestaurantById)
export { router as shoppingRoutes }
