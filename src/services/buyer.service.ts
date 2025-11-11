import api from '@/config/api'
import type {
  Buyer,
  CreateBuyerRequest,
  UpdateBuyerRequest,
  CreateBuyerContactPerson,
  ContactPerson,
} from '@/types/buyer'

export class BuyerService {
  static async getBuyers(): Promise<Buyer[]> {
    const response = await api.get<Buyer[]>('/buyer/v1/buyers/')
    return response.data || []
  }

  static async getBuyerById(id: number): Promise<Buyer> {
    const response = await api.get<Buyer>(`/buyer/v1/buyers/${id}/`)
    return response.data
  }

  static async createBuyer(data: CreateBuyerRequest): Promise<Buyer> {
    const response = await api.post<Buyer>('/buyer/v1/buyers/', data)
    return response.data
  }

  static async updateBuyer(id: number, data: UpdateBuyerRequest): Promise<Buyer> {
    const response = await api.patch<Buyer>(`/buyer/v1/buyers/${id}/`, data)
    return response.data
  }

  static async deleteBuyer(id: number): Promise<void> {
    await api.delete(`/buyer/v1/buyers/${id}/`)
  }

  static async addContactPersons(
    id: number,
    contactPersons: CreateBuyerContactPerson[]
  ): Promise<ContactPerson[]> {
    const response = await api.post<ContactPerson[]>(
      `/buyer/v1/buyers/${id}/add-contact-persons/`,
      contactPersons
    )
    return response.data
  }
}
