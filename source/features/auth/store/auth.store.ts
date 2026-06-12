import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { STORAGE_KEYS } from '../constants/storage.constants'
import { tokenManager } from '@/source/services/tokenManager'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  signIn: (tokens: { accessToken: string; expiresIn: number }) => Promise<void>
  signOut: () => Promise<void>
  hydrate: () => Promise<string | null>
  updateAccessToken: (newAccessToken: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  signIn: async ({ accessToken, expiresIn }) => {
    tokenManager.setAccessToken(accessToken, expiresIn)
    set({ accessToken, isAuthenticated: true })
  },

  signOut: async () => {
    await tokenManager.clearAllTokens()
    set({ accessToken: null, isAuthenticated: false })
  },

  hydrate: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN_KEY
      )
      const refreshToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN_KEY
      )

      if (accessToken && refreshToken) {
        set({ accessToken, isAuthenticated: true })
        return accessToken
      }
    } catch (error) {
      console.error('Hydration error', error)
    }
    set({ accessToken: null, isAuthenticated: false })
    return null
  },

  updateAccessToken: async (newAccessToken: string) => {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.ACCESS_TOKEN_KEY,
      newAccessToken
    )
    set({ accessToken: newAccessToken })
  },
}))
