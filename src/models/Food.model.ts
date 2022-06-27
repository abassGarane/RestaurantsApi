import mongoose, { Document, Schema } from 'mongoose'

export interface FoodDoc extends Document {
	venderId: string
	name: string
	category: string
	foodType: string
	description: string
	readyTime: number
	price: number
	images: [string]
	rating: number
}

const foodSchema = new Schema(
	{
		venderId: { type: String },
		name: { type: String, require: true },
		category: { type: String, required: true },
		foodType: { type: String, required: true },
		description: { type: String, required: true },
		readyTime: { type: Number },
		price: { type: String, required: true },
		images: { type: [String] },
		rating: { type: Number },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.__v
				delete ret.createdAt
				delete ret.updatedAt
			},
		},
		timestamps: true,
	}
)

export const Food = mongoose.model<FoodDoc>('food', foodSchema)
