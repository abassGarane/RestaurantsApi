import { Request, Response, NextFunction } from 'express'
import { FoodDoc, Vender } from '../models'
import { findVender } from './adminController'

export const getAvailableFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	const result = await Vender.find({
		pincode: pincode,
		serviceAvailable: false, // this should be reset to true
	})
		.sort({ rating: 'descending' })
		.populate('foods')

	if (result.length > 0) {
		return res.status(200).json(result)
	}
	return res.status(400).json({
		message: 'Data not found',
	})
}

export const getTopRestaurants = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	const result = await Vender.find({
		pincode: pincode,
		serviceAvailable: false,
	})
		.sort({ rating: 'descending' })
		.limit(1)
		.select('address phone name')
	if (result.length > 0) {
		return res.status(200).json(result)
	}
	return res.status(400).json({
		message: 'Data not found',
	})
}

export const getFoodsIn30Mins = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	const result = await Vender.find({
		pincode: pincode,
		serviceAvailable: false,
	}).populate('foods')
	if (result.length > 0) {
		let foodResults: any = []
		result.map((vender) => {
			const foods = vender.foods as [FoodDoc]
			foodResults.push(...foods.filter((food) => food.readyTime <= 30))
		})

		return res.status(200).json(foodResults)
	}
	return res.status(400).json({
		message: 'No food  found',
	})
}

export const searchFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	const result = await Vender.find({
		pincode: pincode,
		serviceAvailable: false,
	}).populate('foods')
	if (result.length > 0) {
		let foodResults: any = []
		result.map((vender) => {
			foodResults.push(...vender.foods)
		})

		return res.status(200).json(foodResults)
	}
	return res.status(400).json({
		message: 'No food  found',
	})
}

export const findRestaurantById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const restaurantId = req.params.id
	const result = await Vender.findById(restaurantId).populate('foods')
	if (result) {
		return res.status(200).json(result)
	}

	return res.status(404).send({
		message: `could not find a vender with id : ${restaurantId}`,
	})
}
