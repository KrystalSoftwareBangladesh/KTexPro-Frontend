export interface ContactPerson {
  id: number
  full_name: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  username: string
  groups: number[]
}

export interface Buyer {
  id: number
  name: string
  industry: string
  website: string
  email: string
  phone_number: string
  billing_address: string
  contact_persons: ContactPerson[]
  created_at: string
  created_by: number
  updated_by: number
  created_by_name: string
  updated_by_name: string
}

export interface CreateBuyerContactPerson {
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  username: string
  password: string
  confirm_password: string
  groups?: number[]
}

export interface CreateBuyerRequest {
  name: string
  industry: string
  website: string
  email: string
  phone_number: string
  billing_address: string
  contact_persons?: CreateBuyerContactPerson[]
}

export interface UpdateBuyerRequest {
  name?: string
  industry?: string
  website?: string
  email?: string
  phone_number?: string
  billing_address?: string
  contact_persons?: CreateBuyerContactPerson[]
}

export interface AddContactPersonsRequest {
  contact_persons: CreateBuyerContactPerson[]
}

export interface BuyerInquiry {
  id: number
  style_id: string
  product_type: string
  quantity: number
  status: string
  created_at: string
}

export interface CommunicationEvent {
  id: number
  date: string
  description: string
  type: 'email' | 'call' | 'meeting' | 'note'
  status?: string
}
