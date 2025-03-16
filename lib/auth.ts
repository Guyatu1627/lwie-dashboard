import api from "./api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  profileImage?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials)
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout")
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/auth/me")
  return response.data.user
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token")
}

export const getRole = (): string | null => {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    const user = JSON.parse(userStr)
    return user.role
  } catch (error) {
    return null
  }
}

export const hasAdminAccess = (): boolean => {
  return getRole() === "admin"
}

export const hasManagerAccess = (): boolean => {
  const role = getRole()
  return role === "manager" || role === "admin"
}

