import api from "./api"

export interface Advertisement {
  id: number
  userId: number
  userEmail: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  status: "pending" | "active" | "rejected" | "completed"
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  budget: number
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: number
  amount: number
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  transactionId: string
  createdAt: string
  updatedAt: string
}

export interface AdvertisementListResponse {
  advertisements: Advertisement[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface AdvertisementDetailResponse {
  advertisement: Advertisement
  payments: Payment[]
}

export interface CreateAdvertisementData {
  title: string
  description?: string
  imageUrl: string
  targetUrl?: string
  budget: number
  startDate?: string
  endDate?: string
}

export const getAdvertisements = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
  userId = "",
  sortBy = "created_at",
  sortOrder = "DESC",
): Promise<AdvertisementListResponse> => {
  const response = await api.get("/advertisements", {
    params: { page, limit, search, status, userId, sortBy, sortOrder },
  })
  return response.data
}

export const getAdvertisementById = async (id: number): Promise<AdvertisementDetailResponse> => {
  const response = await api.get(`/advertisements/${id}`)
  return response.data
}

export const createAdvertisement = async (data: CreateAdvertisementData): Promise<Advertisement> => {
  const response = await api.post("/advertisements", data)
  return response.data.advertisement
}

export const updateAdvertisement = async (
  id: number,
  data: Partial<CreateAdvertisementData>,
): Promise<Advertisement> => {
  const response = await api.put(`/advertisements/${id}`, data)
  return response.data.advertisement
}

export const updateAdvertisementStatus = async (
  id: number,
  status: "pending" | "active" | "rejected" | "completed",
  reason?: string,
): Promise<Advertisement> => {
  const response = await api.patch(`/advertisements/${id}/status`, { status, reason })
  return response.data.advertisement
}

export const recordAdImpression = async (id: number): Promise<void> => {
  await api.post(`/advertisements/${id}/impression`)
}

export const recordAdClick = async (id: number): Promise<void> => {
  await api.post(`/advertisements/${id}/click`)
}

export const processPayment = async (
  id: number,
  amount: number,
  paymentMethod: string,
  transactionId?: string,
): Promise<Payment> => {
  const response = await api.post(`/advertisements/${id}/payment`, {
    amount,
    paymentMethod,
    transactionId,
  })
  return response.data.payment
}

export const updatePaymentStatus = async (
  id: number,
  status: "pending" | "completed" | "failed" | "refunded",
): Promise<Payment> => {
  const response = await api.patch(`/advertisements/payment/${id}/status`, { status })
  return response.data.payment
}

