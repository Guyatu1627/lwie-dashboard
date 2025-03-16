import { auth } from "@/utils/auth"

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
  cacheTime?: number
}

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {}

/**
 * Enhanced API client with caching, authentication, and error handling
 */
export const apiClient = {
  /**
   * Base URL for API requests
   */
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",

  /**
   * Make a fetch request with authentication and caching
   */
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth = false, cacheTime = 0, ...fetchOptions } = options
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`

    // Check cache if it's a GET request and cacheTime is set
    if (fetchOptions.method === undefined || fetchOptions.method === "GET") {
      const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`
      const cachedResponse = cache[cacheKey]

      if (cachedResponse && cacheTime > 0) {
        const now = Date.now()
        if (now - cachedResponse.timestamp < cacheTime) {
          return cachedResponse.data
        }
      }
    }

    // Add authentication header if needed
    if (!skipAuth) {
      // Check if token needs refresh
      if (auth.needsRefresh()) {
        await auth.refreshToken()
      }

      const token = auth.getAccessToken()
      if (token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    // Add default headers
    fetchOptions.headers = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    try {
      const response = await fetch(url, fetchOptions)

      // Handle 401 Unauthorized (token expired or invalid)
      if (response.status === 401 && !skipAuth) {
        // Try to refresh the token
        const refreshResult = await auth.refreshToken()

        if (refreshResult) {
          // Retry the request with the new token
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${refreshResult.accessToken}`,
          }

          const retryResponse = await fetch(url, fetchOptions)

          if (!retryResponse.ok) {
            throw new Error(`API error: ${retryResponse.status} ${retryResponse.statusText}`)
          }

          const data = await retryResponse.json()

          // Cache the response if it's a GET request and cacheTime is set
          if ((fetchOptions.method === undefined || fetchOptions.method === "GET") && cacheTime > 0) {
            const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`
            cache[cacheKey] = {
              data,
              timestamp: Date.now(),
            }
          }

          return data
        } else {
          // If refresh failed, redirect to login
          auth.clearTokens()
          auth.clearUser()
          window.location.href = "/login"
          throw new Error("Authentication failed. Please log in again.")
        }
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the response if it's a GET request and cacheTime is set
      if ((fetchOptions.method === undefined || fetchOptions.method === "GET") && cacheTime > 0) {
        const cacheKey = `${url}:${JSON.stringify(fetchOptions)}`
        cache[cacheKey] = {
          data,
          timestamp: Date.now(),
        }
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  },

  /**
   * Clear the cache for a specific endpoint or all cache if no endpoint is provided
   */
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`

      Object.keys(cache).forEach((key) => {
        if (key.startsWith(`${url}:`)) {
          delete cache[key]
        }
      })
    } else {
      Object.keys(cache).forEach((key) => {
        delete cache[key]
      })
    }
  },
}

