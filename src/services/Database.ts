import mongoose, { ConnectOptions } from 'mongoose'
import { MONGO_URI } from '../config'

/**
 ** connect to mongodb
 **/

export default async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions)
		console.log('Db connected ...')
	} catch (error) {
		console.log(`error : ${error}`)
	}
}
