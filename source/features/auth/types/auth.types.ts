export interface User {
<<<<<<< Updated upstream
    id: number
    email: string
    name: string
    role: string
}
=======
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
>>>>>>> Stashed changes
