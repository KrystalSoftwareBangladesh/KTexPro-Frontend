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

export interface LogoutRequest {
  refresh: string
}

export interface LogoutResponse {
  message: string
}

export interface Permission {
  id: number
  codename: string
  name: string
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  groups: number[]
}

export interface UserProfile {
  id: number
  full_name: string
  email: string
  username: string
  groups: number[]
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

export interface CreateRoleRequest {
  name: string
}

export interface UpdateRoleRequest {
  name?: string
  permission_ids?: number[]
}

export interface DeleteRoleResponse {
  message: string
}

export interface AssignRoleRequest {
  username: string
  email: string
  groups: number[]
}

export interface AssignRoleResponse {
  id: number
  username: string
  email: string
  groups: number[]
}
