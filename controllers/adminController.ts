import { genSalt } from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import { CreateVenderInput } from '../dto'
import { Vender } from '../models'
import { generateSalt, generatePassword } from '../utilities'

export const findVender = async (id: string | undefined, email?: string) => {
	if (!email) return Vender.findById(id)
	return Vender.findOne({ email: email })
}
export const createVender = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		name,
		ownerName,
		address,
		foodType,
		phone,
		pincode,
		password,
		email,
	} = <CreateVenderInput>req.body
	const existingVender = await findVender(undefined, email)
	if (existingVender != null) {
		return res.json({
			message: `Vender with email : ${email} already exists`,
		})
	}
	const salt = await generateSalt()
	const userPassword = await generatePassword(password, salt)
	const newVender = await Vender.create({
		name,
		address,
		foodType,
		ownerName,
		phone,
		pincode,
		email,
		password: userPassword,
		rating: 0,
		serviceAvailable: false,
		coverImages: [],
		salt,
		foods: [],
	})
	return res.json(newVender)
}
export const getVenders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//getVenders
	const venders = await Vender.find()
	if (venders != null) return res.json(venders)
	return res.json({
		message: 'There are no venders in the database',
	})
}
export const getVenderById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//getVender
	const venderId = req.params.id
	const vender = await findVender(venderId)
	if (vender != null) return res.json(vender)
	return res.json({
		message: `Vender with id: ${venderId} does not exist`,
	})
}
