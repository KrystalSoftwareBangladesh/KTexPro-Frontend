import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import api from './api'
import { AuthService } from '@/services/auth.service'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })

  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = AuthService.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = AuthService.getRefreshToken()

      if (!refreshToken) {
        AuthService.clearTokens()
        window.location.href = '/sign-in'
        return Promise.reject(error)
      }

      try {
        const response = await AuthService.refreshToken(refreshToken)

        if (response.access && response.refresh) {
          AuthService.setTokens(response.access, response.refresh)
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.access}`
          }
          processQueue(null, response.access)
          return api(originalRequest)
        } else {
          throw new Error('Invalid refresh response')
        }
      } catch (refreshError) {
        processQueue(refreshError as Error)
        AuthService.clearTokens()
        window.location.href = '/sign-in'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
