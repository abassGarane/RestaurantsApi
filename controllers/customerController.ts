import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import {
	CustomerInput,
	EditCustomerInput,
	UserLoginInputs,
} from '../dto/Customer.dto'
import { Customer } from '../models'
import {
	GenerateOtp,
	generatePassword,
	generateSalt,
	generateSignature,
	onRequestOtp,
	validatePassword,
} from '../utilities'

export const customerSignup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customerInput = plainToClass(CustomerInput, req.body)
	const inputErrors = await validate(customerInput, {
		validationError: { target: true },
	})

	if (inputErrors.length > 0) {
		return res.status(400).json(inputErrors)
	}

	const { email, phone, password } = customerInput

	// Ensure that the customer doesnt already exist
	// const oldCustomer = await Customer.find({ email: email })
	// if (oldCustomer !== null) {
	// 	return res.json({ message: `Customer with email ${email} already exists` })
	// }

	//save customer
	const salt = await generateSalt()
	const userPassword = await generatePassword(password, salt)

	const { otp, otpExpiry } = GenerateOtp()

	const customer = await Customer.create({
		email,
		phone,
		otp,
		otpExpiry,
		password: userPassword,
		firstName: '',
		lastName: '',
		lat: 0,
		long: 0,
		verified: false,
		address: '',
		salt: salt,
	})

	if (customer) {
		await onRequestOtp(otp, phone)

		const signature = generateSignature({
			_id: customer._id,
			email: customer.email,
			verified: customer.verified,
		})
		return res.status(201).json({
			signature: signature,
			verified: customer.verified,
			email: customer.email,
		})
	}
}

export const customerLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const loginInputs = plainToClass(UserLoginInputs, req.body)
	const loginErrors = await validate(loginInputs, {
		validationError: { target: false },
	})
	if (loginErrors.length > 0) {
		return res.status(400).json(loginErrors)
	}

	const { email, password } = loginInputs
	const customer = await Customer.findOne({ email })
	if (customer) {
		const validation = await validatePassword(customer.password, password)
		if (validation) {
			const signature = generateSignature({
				_id: customer._id,
				email: customer.email,
				verified: customer.verified,
			})
			return res.status(201).json({
				signature: signature,
				verified: customer.verified,
				email: customer.email,
			})
		}
		return res.status(401).json({
			message: 'Not valid email and password',
		})
	}
	res.status(404).json({
		message: `Customer with email ${email} does not exist`,
	})
}

export const customerVerification = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customer = req.user
	const saved_customer = await Customer.findById(customer && customer._id)
	const { otp } = req.body
	if (saved_customer) {
		if (
			saved_customer.otp === parseInt(otp) &&
			saved_customer.otpExpiry >= new Date()
		) {
			saved_customer.verified = true
			const s = await saved_customer.save()
			const sig = generateSignature({
				_id: s._id,
				email: s.email,
				verified: s.verified,
			})
			return res.status(201).json({
				signature: sig,
				verified: s.verified,
				email: s.email,
			})
		}
		return res.json({
			message: 'invalid otp',
		})
	}
	return res.json({
		message: 'invalid auth',
	})
}

export const customerOtp = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customer = req.user
	if (customer) {
		const savedCustomer = await Customer.findById(customer._id)
		if (savedCustomer) {
			const { otp, otpExpiry } = GenerateOtp()
			savedCustomer.otp = otp
			savedCustomer.otpExpiry = otpExpiry
			const updatedCustomer = await savedCustomer.save()
			await onRequestOtp(otp, updatedCustomer.phone)
			return res.status(200).json({
				message: `SMS with OTP sent to ${updatedCustomer.phone}`,
			})
		}
		return res.status(404).json({
			message: `Customer with email ${customer.email} does not exist`,
		})
	}
}

export const getCustomerProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customer = req.user
	if (customer) {
		const profile = await Customer.findById(customer._id)
		if (profile) {
			return res.status(200).json(profile)
		}
	}
	return res.status(404).json({
		message: 'could not find customer',
	})
}

// update customer details
export const editCustomerProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customer = req.user
	const customerInput = plainToClass(EditCustomerInput, req.body)
	const customerInputErrors = await validate(customerInput, {
		validationError: { target: false },
	})
	if (customerInputErrors.length > 0) {
		return res.status(400).json({
			customerInputErrors,
		})
	}
	if (customer) {
		const savedCustomer = await Customer.findById(customer._id)
		if (savedCustomer) {
			savedCustomer.firstName = customerInput.firstName
			savedCustomer.lastName = customerInput.lastName
			savedCustomer.address = customerInput.address
			const updatedCustomer = await savedCustomer.save()

			return res.status(200).json({
				updatedCustomer,
			})
		}
	}
	return res.status(400).json({
		message: 'Could not update Customer',
	})
}
