import api from '@/config/api'
import type { Permission } from '@/types/auth'

export class PermissionService {
  static async getPermissions(): Promise<Permission[]> {
    const response = await api.get<Permission[]>('/user/v1/permissions/')
    return response.data || []
  }
}
