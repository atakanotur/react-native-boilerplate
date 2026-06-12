import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { User } from '@/source/features/auth/types/auth.types'
import { STORAGE_KEYS } from '@/source/features/auth/constants/storage.constants'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean

  setAuth: (accessToken: string, refreshToken: string) => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  clearAuth: () => Promise<void>
  rehydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN_KEY, accessToken)
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN_KEY, refreshToken)
    set({ accessToken, refreshToken, isAuthenticated: true })
  },

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken })
  },

  setUser: (user) => set({ user }),

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN_KEY)
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
  },

  rehydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(
      STORAGE_KEYS.ACCESS_TOKEN_KEY
    )
    const refreshToken = await SecureStore.getItemAsync(
      STORAGE_KEYS.REFRESH_TOKEN_KEY
    )
    if (accessToken) {
      set({ accessToken, refreshToken, isAuthenticated: true })
    }
  },
}))