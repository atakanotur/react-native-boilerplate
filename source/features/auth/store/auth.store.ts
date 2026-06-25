import { create } from 'zustand'
import { tokenManager } from '@/source/services/tokenManager'
import { secureStorage } from '@/source/services/secureStorage'

interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
<<<<<<< Updated upstream
  signIn: (tokens: { accessToken: string; expiresIn: number }) => Promise<void>
=======
  signIn: (tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    rememberMe?: boolean
    email?: string
  }) => Promise<void>
>>>>>>> Stashed changes
  signOut: () => Promise<void>
  hydrate: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

<<<<<<< Updated upstream
  signIn: async ({ accessToken, expiresIn }) => {
    tokenManager.setAccessToken(accessToken, expiresIn)
=======
  signIn: async ({
    accessToken,
    refreshToken,
    expiresIn,
    rememberMe = true,
    email,
  }) => {
    tokenManager.setAccessToken(accessToken, expiresIn)
    await tokenManager.setRefreshToken(refreshToken, rememberMe)

    if (rememberMe && email) {
      await secureStorage.storeRememberedEmail(email)
    } else if (!rememberMe) {
      await secureStorage.removeRememberedEmail()
    }
>>>>>>> Stashed changes
    set({ accessToken, isAuthenticated: true })
  },

  signOut: async () => {
    await tokenManager.clearAllTokens()
    set({ accessToken: null, isAuthenticated: false })
  },

  hydrate: async () => {
    try {
      const accessToken = tokenManager.getAccessToken()
      const refreshToken = await tokenManager.getRefreshToken()

      if (refreshToken) {
        set({ accessToken, isAuthenticated: true })
        return refreshToken
      }
    } catch (error) {
      console.error('Hydration error', error)
    }
    set({ accessToken: null, isAuthenticated: false })
    return null
  },
}))
