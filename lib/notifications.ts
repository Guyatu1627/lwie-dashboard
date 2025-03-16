import api from "./api"

export interface Notification {
  id: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getNotifications = async (page = 1, limit = 10, type = ""): Promise<NotificationListResponse> => {
  const response = await api.get("/notifications", {
    params: { page, limit, type },
  })
  return response.data
}

export const markNotificationAsRead = async (id: number): Promise<Notification> => {
  const response = await api.patch(`/notifications/${id}/read`)
  return response.data.notification
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.post("/notifications/mark-all-read")
}

export const sendNotification = async (
  userId: number,
  title: string,
  message: string,
  type: string,
): Promise<Notification> => {
  const response = await api.post("/notifications/send", {
    userId,
    title,
    message,
    type,
  })
  return response.data.notification
}

export const broadcastNotification = async (
  title: string,
  message: string,
  type: string,
  role?: string,
): Promise<void> => {
  await api.post("/notifications/broadcast", {
    title,
    message,
    type,
    role,
  })
}

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`)
}

