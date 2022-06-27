import express, { Application } from 'express'
import multer from 'multer'
import path from 'path'

import {
	adminRoutes,
	customerRoutes,
	shoppingRoutes,
	venderRoutes,
} from '../routes'

export default async (app: Application) => {
	app.use('/images', express.static(path.join(__dirname, 'images')))

	const imageStorage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'images')
		},
		filename: (req, file, cb) => {
			cb(null, new Date().toISOString() + '_' + file.originalname)
		},
	})
	const images = multer({ storage: imageStorage }).array('images', 20)

	/****** Routes  ***/
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	app.use('/admin', adminRoutes)
	app.use('/vender', images, venderRoutes)
	app.use(shoppingRoutes)
	app.use('/customer', customerRoutes)
}
