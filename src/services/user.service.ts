import api from '@/config/api'
import type {
  CreateUserRequest,
  CreateUserResponse,
  User,
  UserListResponse,
} from '@/types/auth'

export class UserService {
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
    const response = await api.get<UserListResponse>('/user/v1/list')
    return response.data.results || []
  }
}
