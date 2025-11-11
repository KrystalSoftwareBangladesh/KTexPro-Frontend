import api from '@/config/api'
import type {
  CreateUserRequest,
  CreateUserResponse,
  User,
  UserProfile,
  UserListResponse,
  Permission,
  AssignRoleRequest,
  AssignRoleResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  VerifyUniqueRequest,
  VerifyUniqueResponse,
} from '@/types/auth'

export class UserService {
  static async verifyUnique(payload: VerifyUniqueRequest): Promise<VerifyUniqueResponse> {
    const res = await api.post('/user/v1/verify', payload)
    return res.data
  }

  static async createUser(
    userData: CreateUserRequest
  ): Promise<CreateUserResponse> {
    const response = await api.post<CreateUserResponse>(
      '/user/v1/create',
      userData
    )
    return response.data
  }

  static async getUserList(): Promise<User[]> {
    const response = await api.get<User[] | UserListResponse>('/user/v1/list')

    if (Array.isArray(response.data)) {
      return response.data
    }

    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      return (response.data as UserListResponse).results || []
    }

    return []
  }

  static async getUserProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/user/v1/profile')
    return response.data
  }

  static async getPermissions(): Promise<Permission[]> {
    const response = await api.get<Permission[]>('/user/v1/permissions')
    return response.data || []
  }

  static async assignRole(
    userId: number,
    data: AssignRoleRequest
  ): Promise<AssignRoleResponse> {
    const response = await api.patch<AssignRoleResponse>(
      `/user/v1/${userId}/assign-role`,
      data
    )
    return response.data
  }

  static async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const response = await api.patch<UpdateProfileResponse>(
      '/user/v1/profile',
      data
    )
    return response.data
  }

  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const response = await api.patch<ChangePasswordResponse>(
      '/user/v1/change-password',
      data
    )
    return response.data
  }
}
