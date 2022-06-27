import bcrypt from 'bcrypt'
import { VenderPayload, AuthPayload } from '../dto'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config'
import { Request } from 'express'

export const generateSalt = async () => {
	return await bcrypt.genSalt(10)
}

export const generatePassword = async (password: string, salt: string) => {
	return await bcrypt.hash(password, salt)
}

export const validatePassword = async (
	savedPassword: string,
	enteredPassword: string
) => {
	return bcrypt.compareSync(enteredPassword, savedPassword)
}

export const generateSignature = (payload: AuthPayload) => {
	return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' })
}
export const validateSignature = async (req: Request) => {
	const signature = req.get('Authorization')

	if (signature) {
		const payload = jwt.verify(signature.split(' ')[1], APP_SECRET, {
			ignoreExpiration: true,
		}) as AuthPayload

		//need to handle the errors of expired tokens --> ignoring them now
		req.user = payload
		return true
	}

	return false
}
