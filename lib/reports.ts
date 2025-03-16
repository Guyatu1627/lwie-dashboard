import api from "./api"

export interface Report {
  id: number
  name: string
  type: string
  parameters: any
  results: any
  createdAt: string
  updatedAt: string
}

export interface ReportListResponse {
  reports: Report[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getReports = async (page = 1, limit = 10, type = ""): Promise<ReportListResponse> => {
  const response = await api.get("/reports", {
    params: { page, limit, type },
  })
  return response.data
}

export const getReportById = async (id: number): Promise<Report> => {
  const response = await api.get(`/reports/${id}`)
  return response.data.report
}

export const generateUserActivityReport = async (
  name: string,
  startDate?: string,
  endDate?: string,
  userId?: number,
): Promise<Report> => {
  const response = await api.post("/reports/user-activity", {
    name,
    startDate,
    endDate,
    userId,
  })
  return response.data.report
}

export const generateRevenueReport = async (
  name: string,
  startDate?: string,
  endDate?: string,
  groupBy: "day" | "week" | "month" = "day",
): Promise<Report> => {
  const response = await api.post("/reports/revenue", {
    name,
    startDate,
    endDate,
    groupBy,
  })
  return response.data.report
}

export const generateContentReport = async (
  name: string,
  startDate?: string,
  endDate?: string,
  categoryId?: number,
): Promise<Report> => {
  const response = await api.post("/reports/content", {
    name,
    startDate,
    endDate,
    categoryId,
  })
  return response.data.report
}

export const generatePlatformPerformanceReport = async (
  name: string,
  startDate?: string,
  endDate?: string,
  period: "7days" | "30days" | "90days" | "1year" = "30days",
): Promise<Report> => {
  const response = await api.post("/reports/platform-performance", {
    name,
    startDate,
    endDate,
    period,
  })
  return response.data.report
}

export const deleteReport = async (id: number): Promise<void> => {
  await api.delete(`/reports/${id}`)
}

