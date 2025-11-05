export interface LoginRequest {
  credential: string
  username: string
  password: string
}

export interface LoginResponse {
  refresh: string
  access: string
  user_id: number
  username: string
  email: string
  roles: string[]
  message: string
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  refresh: string
  message: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  middle_name?: string
  last_name: string
  roles: string[]
}

export interface CreateUserRequest {
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  username: string
  password: string
  confirm_password: string
  groups?: number[]
}

export interface CreateUserResponse {
  message: string
  user?: User
}

export interface UserListResponse {
  results: User[]
  count: number
  next?: string
  previous?: string
}
