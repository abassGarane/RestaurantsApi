import mongoose, { Document, Schema } from 'mongoose'
import { isStringLiteralLike } from 'typescript'

export interface CustomerDoc extends Document {
	email: string
	password: string
	firstName: string
	lastName: string
	address: string
	phone: string
	lat: number
	long: number
	verified: boolean
	otp: number
	otpExpiry: Date
	salt: string
}

const CustomerSchema = new Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		firstName: { type: String },
		lastName: { type: String },
		address: { type: String },
		phone: { type: String },
		lat: { type: Number },
		long: { type: Number },
		verified: { type: Boolean, required: true, default: false },
		otp: { type: Number, required: true },
		otpExpiry: { type: Date, required: true },
		salt: { type: String, required: true },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password
				delete ret.salt
				delete ret.__v
				delete ret.createdAt
				delete ret.updatedAt
				delete ret.otp
				delete ret.otpExpiry
			},
		},
		timestamps: true,
	}
)

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)

export { Customer }
