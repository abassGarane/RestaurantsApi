import { VenderPayload } from '../dto'
import { CustomerPayload } from './Customer.dto'

export type AuthPayload = VenderPayload | CustomerPayload
