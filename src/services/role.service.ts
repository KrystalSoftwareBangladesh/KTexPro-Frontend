import api from '@/config/api'
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  DeleteRoleResponse,
} from '@/types/auth'

export class RoleService {
  static async getRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/user/v1/roles/')
    return response.data || []
  }

  static async getRole(id: number): Promise<Role> {
    const response = await api.get<Role>(`/user/v1/roles/${id}/`)
    return response.data
  }

  static async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await api.post<Role>('/user/v1/roles/', data)
    return response.data
  }

  static async updateRole(
    id: number,
    data: UpdateRoleRequest
  ): Promise<Role> {
    const response = await api.patch<Role>(`/user/v1/roles/${id}/`, data)
    return response.data
  }

  static async deleteRole(id: number): Promise<DeleteRoleResponse> {
    const response = await api.delete<DeleteRoleResponse>(
      `/user/v1/roles/${id}/`
    )
    return response.data
  }
}
