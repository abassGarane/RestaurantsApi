import { Request, Response, NextFunction } from 'express'
import { isExpressionStatement } from 'typescript'
import { EditVender, VenderLoginInput } from '../dto'
import { FoodInput } from '../dto'
import { Food } from '../models'
import { generateSignature, validatePassword } from '../utilities'
import { findVender } from './adminController'

export const venderLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = <VenderLoginInput>req.body
	const existingVender = await findVender(undefined, email)
	if (existingVender !== null) {
		//perform validations
		const validated = await validatePassword(existingVender.password, password)
		if (validated) {
			const sign = generateSignature({
				_id: existingVender._id,
				email: existingVender.email,
				foodType: existingVender.foodType,
				name: existingVender.name,
			})
			//validated user
			return res.json(sign)
		}
		return res.json({
			message: 'invalid password',
		})
	}
	return res.json({
		message: 'Login credentials not valid',
	})
}

export const getVenderProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	if (user) {
		const vender = await findVender(user._id)
		return res.json(vender)
	}
	res.json({
		message: 'could not find vender',
	})
}
export const updateVenderCoverImages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	if (user) {
		const vender = await findVender(user._id)
		if (vender !== null) {
			const files = req.files as [Express.Multer.File]
			const images = files.map((file: Express.Multer.File) => file.filename)
			vender.coverImages.push(...images)
			const savedVender = await vender.save()
			return res.json(savedVender)
		}
	}
	return res.json({
		message: 'could not add images',
	})
}
export const updateVenderProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	const { name, address, foodType, phone } = <EditVender>req.body
	if (user) {
		const vender = await findVender(user._id)
		if (vender !== null) {
			vender.name = name
			vender.address = address
			vender.foodType = foodType
			vender.phone = phone

			const updatedVender = await vender.save()
			return res.json(updatedVender)
		}
		return res.json(vender)
	}
	res.json({
		message: 'could not find vender',
	})
}
export const getVenderService = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	if (user) {
		const vender = await findVender(user._id)
		if (vender) {
			vender.serviceAvailable = !vender.serviceAvailable
			const savedVender = await vender.save()
			return res.json(savedVender)
		}
	}
	return res.json({
		message: 'could not find vender',
	})
}

export const addFood = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	if (user) {
		const { name, description, category, foodType, readyTime, price } = <
			FoodInput
		>req.body
		const vender = await findVender(user._id)
		if (vender !== null) {
			const files = req.files as [Express.Multer.File]
			const images = files.map((file: Express.Multer.File) => file.filename)
			const food = await Food.create({
				venderId: vender._id,
				name,
				description,
				category,
				foodType,
				readyTime,
				price,
				images: [...images],
				rating: 0,
			})

			vender.foods.push(food)
			const savedVender = await vender.save()
			return res.json(savedVender)
		}
	}
	return res.json({
		message: 'could not add food',
	})
}

export const getFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user
	if (user) {
		const foods = await Food.find({ venderId: user._id })
		if (foods !== null) {
			return res.json(foods)
		}
		return res.json({
			message: 'no food available from vender',
		})
	}
	return res.json({
		message: 'could not find any food',
	})
}
