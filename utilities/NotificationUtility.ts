import { ACCOUNTSID, AUTHTOKEN } from '../config'

export const GenerateOtp = () => {
	const otp = Math.floor(10000 * Math.random() * 90000)
	let otpExpiry = new Date()

	otpExpiry.setTime(new Date().getTime() + 30 * 60 * 1000)

	return { otp, otpExpiry }
}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
	const accountSid = ACCOUNTSID
	const authToken = AUTHTOKEN

	const client = require('twilio')(accountSid, authToken)

	const response = await client.messages.create({
		body: `Your OTP is ${otp}`,
		from: '+19302033548',
		to: `+254${toPhoneNumber}`,
	})

	return response
}
