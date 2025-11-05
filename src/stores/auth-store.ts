import { create } from 'zustand'
import { AuthService } from '@/services/auth.service'

interface AuthUser {
  user_id: number
  username: string
  email: string
  roles: string[]
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    refreshToken: string
    setTokens: (accessToken: string, refreshToken: string) => void
    setAccessToken: (accessToken: string) => void
    getRefreshToken: () => string
    resetAccessToken: () => void
    reset: () => void
    initializeAuth: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initAccessToken = AuthService.getAccessToken() || ''
  const initRefreshToken = AuthService.getRefreshToken() || ''
  const userData = AuthService.getUserData()
  
  return {
    auth: {
      user: userData,
      accessToken: initAccessToken,
      refreshToken: initRefreshToken,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          AuthService.setTokens(accessToken, refreshToken)
          return { 
            ...state, 
            auth: { 
              ...state.auth, 
              accessToken, 
              refreshToken 
            } 
          }
        }),
      setAccessToken: (accessToken) =>
        set((state) => {
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      getRefreshToken: () => {
        return get().auth.refreshToken
      },
      resetAccessToken: () =>
        set((state) => {
          AuthService.clearTokens()
          return { 
            ...state, 
            auth: { 
              ...state.auth, 
              accessToken: '', 
              refreshToken: '' 
            } 
          }
        }),
      reset: () =>
        set((state) => {
          AuthService.logout()
          return {
            ...state,
            auth: { 
              ...state.auth, 
              user: null, 
              accessToken: '', 
              refreshToken: '' 
            },
          }
        }),
      initializeAuth: () =>
        set((state) => {
          const accessToken = AuthService.getAccessToken() || ''
          const refreshToken = AuthService.getRefreshToken() || ''
          const user = AuthService.getUserData()
          return {
            ...state,
            auth: { 
              ...state.auth, 
              user, 
              accessToken,
              refreshToken 
            },
          }
        }),
    },
  }
})
