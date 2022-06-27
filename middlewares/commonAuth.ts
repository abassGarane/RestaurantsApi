import { Request, Response, NextFunction } from 'express'
import { AuthPayload } from '../dto/Auth.dto'
import { validateSignature } from '../utilities'

declare global {
	namespace Express {
		interface Request {
			user?: AuthPayload
		}
	}
}

export const Authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const validate = await validateSignature(req)
	if (validate) {
		next()
	} else {
		res.json({
			message: 'user not authorized',
		})
	}
}
