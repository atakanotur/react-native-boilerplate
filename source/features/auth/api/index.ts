import { apiClient } from '@/source/services/api'

export const login = async (username: string, password: string) => {
  const response = await apiClient.post('/auth/login', { username, password })
  return response.data
}

export const register = async (username: string, password: string) => {
  const response = await apiClient.post('/auth/register', {
    username,
    password,
  })
  return response.data
}
