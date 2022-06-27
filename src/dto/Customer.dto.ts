import { IsEmail, IsEmpty, Length } from 'class-validator'

export class CustomerInput {
	@Length(7, 16)
	phone: string

	@IsEmail()
	email: string

	@Length(5, 12)
	password: string
}
export class UserLoginInputs {
	@IsEmail()
	email: string

	@Length(5, 12)
	password: string
}

export class EditCustomerInput {
	@Length(3, 20)
	firstName: string
	@Length(3, 12)
	lastName: string
	@Length(5, 12)
	address: string
}

export interface CustomerPayload {
	_id: string
	email: string
	verified: boolean
}
