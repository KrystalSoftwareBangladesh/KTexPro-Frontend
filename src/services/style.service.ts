import api from '@/config/api'
import type {
  CreateStyleInput,
  Style,
  StyleFilters,
  StyleListResponse,
  StyleStatusTransitionInput,
  UpdateStyleInput,
} from '@/types/style'
import { mockStyleService } from './style.service.mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_STYLES !== 'false'

const realStyleService = {
  getStyles: async (filters?: StyleFilters): Promise<StyleListResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.buyerId) params.append('buyer_id', filters.buyerId.toString())
    if (filters?.supplierId) params.append('supplier_id', filters.supplierId.toString())
    if (filters?.merchandiserId) params.append('merchandiser_id', filters.merchandiserId.toString())
    if (filters?.season) params.append('season', filters.season)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('page_size', filters.pageSize.toString())

    const response = await api.get<StyleListResponse>(
      `/style/v1/styles/${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },

  getStyleById: async (id: number): Promise<Style> => {
    const response = await api.get<Style>(`/style/v1/styles/${id}/`)
    return response.data
  },

  createStyle: async (data: CreateStyleInput): Promise<Style> => {
    const response = await api.post<Style>('/style/v1/styles/', data)
    return response.data
  },

  updateStyle: async (id: number, data: UpdateStyleInput): Promise<Style> => {
    const response = await api.patch<Style>(`/style/v1/styles/${id}/`, data)
    return response.data
  },

  deleteStyle: async (id: number): Promise<void> => {
    await api.delete(`/style/v1/styles/${id}/`)
  },

  transitionStatus: async (
    id: number,
    data: StyleStatusTransitionInput
  ): Promise<Style> => {
    const response = await api.post<Style>(
      `/style/v1/styles/${id}/status-transition/`,
      data
    )
    return response.data
  },

  getTimeline: async (id: number): Promise<Style['statusHistory']> => {
    const response = await api.get<Style['statusHistory']>(
      `/style/v1/styles/${id}/timeline/`
    )
    return response.data
  },
}

export const styleService = USE_MOCK ? mockStyleService : realStyleService
