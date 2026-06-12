//source/services/api.ts

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { tokenManager } from './tokenManager'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RefreshResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error)
    else if (token) promise.resolve(token)
    failedQueue = []
  })
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await tokenManager.getRefreshToken()

  if (!refreshToken) throw new Error('No refresh token available')

  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const {
    accessToken,
    expiresIn,
    refreshToken: newRefreshToken,
  } = response.data

  //Store new tokens
  tokenManager.setAccessToken(accessToken, expiresIn)
  tokenManager.setRefreshToken(newRefreshToken)

  return accessToken
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenManager.getAccessToken()

    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    //Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject: (error: Error) => {
              reject(error)
            },
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as Error, null)
        //Trigger logout on refresh failure
        await tokenManager.clearAllTokens()
        // Emit logout event(implement based on your navigation setup)
        throw refreshError
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
