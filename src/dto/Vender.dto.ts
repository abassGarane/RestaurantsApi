export interface CreateVenderInput {
	name: string
	ownerName: string
	foodType: [string]
	pincode: string
	address: string
	phone: string
	email: string
	password: string
}

export interface VenderLoginInput {
	email: string
	password: string
}
export interface EditVender {
	name: string
	foodType: [string]
	address: string
	phone: string
}

export interface VenderPayload {
	_id: string
	name: string
	email: string
	foodType: [string]
}
