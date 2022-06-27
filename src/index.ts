import express from 'express'
import { PORT } from './config'
import Database from './services/Database'
import ExpressApp from './services/ExpressApp'
const startServer = async () => {
	const app = express()

	await Database()
	await ExpressApp(app)

	app.listen(PORT, () => {
		console.log(`listening on http://localhost:${PORT}`)
	})
}

startServer()
