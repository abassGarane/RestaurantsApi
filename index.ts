import express from 'express'
import Database from './services/Database'
import ExpressApp from './services/ExpressApp'
const startServer = async () => {
	const app = express()

	await Database()
	await ExpressApp(app)

	app.listen(8080, () => {
		console.log('listening on http://localhost:8080')
	})
}

startServer()
