import api from "./api"

export interface DashboardAnalytics {
  overview: {
    totalUsers: number
    activeUsers: number
    totalItems: number
    activeItems: number
    totalTransactions: number
    completedTransactions: number
    totalAds: number
    activeAds: number
  }
  userGrowth: {
    month: string
    newUsers: number
  }[]
  itemGrowth: {
    month: string
    newItems: number
  }[]
  categoryDistribution: {
    categoryName: string
    itemCount: number
  }[]
}

export interface UserActivityAnalytics {
  dailyActiveUsers: {
    day: string
    activeUsers: number
  }[]
  mostActiveUsers: {
    id: number
    email: string
    firstName: string
    lastName: string
    sessionCount: number
  }[]
  userEngagementByHour: {
    hour: number
    activeUsers: number
  }[]
}

export interface GeographicalAnalytics {
  userDistribution: {
    location: string
    userCount: number
  }[]
  itemDistribution: {
    location: string
    itemCount: number
  }[]
}

export interface PerformanceAnalytics {
  period: string
  newUsers: {
    timePeriod: string
    count: number
  }[]
  newItems: {
    timePeriod: string
    count: number
  }[]
  completedTransactions: {
    timePeriod: string
    count: number
  }[]
  activeAds: {
    timePeriod: string
    count: number
  }[]
}

export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const response = await api.get("/analytics/dashboard")
  return response.data
}

export const getUserActivityAnalytics = async (
  startDate?: string,
  endDate?: string,
): Promise<UserActivityAnalytics> => {
  const response = await api.get("/analytics/user-activity", {
    params: { startDate, endDate },
  })
  return response.data
}

export const getGeographicalAnalytics = async (): Promise<GeographicalAnalytics> => {
  const response = await api.get("/analytics/geographical")
  return response.data
}

export const getPerformanceAnalytics = async (
  period: "7days" | "30days" | "90days" | "1year" = "30days",
): Promise<PerformanceAnalytics> => {
  const response = await api.get("/analytics/performance", {
    params: { period },
  })
  return response.data
}

