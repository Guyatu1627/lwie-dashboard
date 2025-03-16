import api from "./api"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  profileImage?: string
  phone?: string
  location?: string
  bio?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  users: User[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UserActivityResponse {
  activities: {
    type: string
    id: number
    title?: string
    status: string
    createdAt: string
  }[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getUsers = async (
  page = 1,
  limit = 10,
  search = "",
  role = "",
  sortBy = "created_at",
  sortOrder = "DESC",
): Promise<UserListResponse> => {
  const response = await api.get("/users", {
    params: { page, limit, search, role, sortBy, sortOrder },
  })
  return response.data
}

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`)
  return response.data.user
}

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data.user
}

export const updateUserRole = async (id: number, role: string): Promise<User> => {
  const response = await api.patch(`/users/${id}/role`, { role })
  return response.data.user
}

export const updateUserStatus = async (id: number, isActive: boolean): Promise<User> => {
  const response = await api.patch(`/users/${id}/status`, { isActive })
  return response.data.user
}

export const getUserActivity = async (
  id: number,
  page = 1,
  limit = 10,
  startDate?: string,
  endDate?: string,
): Promise<UserActivityResponse> => {
  const response = await api.get(`/users/${id}/activity`, {
    params: { page, limit, startDate, endDate },
  })
  return response.data
}

