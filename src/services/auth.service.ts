import api from '@/config/api'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@/types/auth'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      '/user/v1/login',
      credentials
    )
    
    if (response.data.access && response.data.refresh) {
      this.setTokens(response.data.access, response.data.refresh)
      this.setUserData({
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles,
      })
    }
    
    return response.data
  }

  static async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      '/user/v1/refresh',
      { refresh: refreshToken }
    )
    
    if (response.data.access) {
      this.setTokens(response.data.access, response.data.refresh)
    }
    
    return response.data
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  static setUserData(userData: {
    user_id: number
    username: string
    email: string
    roles: string[]
  }): void {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  static getUserData(): {
    user_id: number
    username: string
    email: string
    roles: string[]
  } | null {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  }

  static clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  static logout(): void {
    this.clearTokens()
  }
}
