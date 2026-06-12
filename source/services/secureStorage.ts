//source/services/secureStorage.ts

import * as Keychain from 'react-native-keychain'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

function isKeychainAvailable(): boolean {
    try {
      // The native module is null in Expo Go and test environments
      return Keychain != null && typeof Keychain.getGenericPassword === 'function'
    } catch {
      return false
    }
  }

class SecureStorageService {
  async storeRefreshToken(token: string) {
    try {
      await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, token, {
        service: REFRESH_TOKEN_KEY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      })
      return true
    } catch (error) {
      console.error('Failed to store refresh token:', error)
      return false
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: REFRESH_TOKEN_KEY,
      })
      if (credentials) return credentials.password
      return null
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error)
      return null
    }
  }

  async removeRefreshToken(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: REFRESH_TOKEN_KEY,
      })
      return true
    } catch (error) {
      console.error('Failed to remove refresh token:', error)
      return false
    }
  }

  async clearAllTokens(): Promise<void> {
    await this.removeRefreshToken()
  }
}

export const secureStorage = new SecureStorageService()
