import { jwtDecode } from "jwt-decode"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  mfaEnabled: boolean
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface DecodedToken {
  userId: string
  exp: number
}

/**
 * Authentication utility for handling tokens and user data
 */
export const auth = {
  /**
   * Store authentication tokens
   * @param tokens - Access and refresh tokens
   */
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("refreshToken", tokens.refreshToken)
  },

  /**
   * Get the stored access token
   * @returns Access token or null if not found
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken")
  },

  /**
   * Get the stored refresh token
   * @returns Refresh token or null if not found
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken")
  },

  /**
   * Clear all authentication tokens
   */
  clearTokens(): void {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  },

  /**
   * Store user data
   * @param user - User data
   */
  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user))
  },

  /**
   * Get the stored user data
   * @returns User data or null if not found
   */
  getUser(): User | null {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },

  /**
   * Clear user data
   */
  clearUser(): void {
    localStorage.removeItem("user")
  },

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  },

  /**
   * Check if the access token needs to be refreshed
   * @param thresholdMinutes - Minutes before expiration to trigger refresh
   * @returns True if token needs refresh, false otherwise
   */
  needsRefresh(thresholdMinutes = 5): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const currentTime = Date.now() / 1000
      const thresholdTime = decoded.exp - thresholdMinutes * 60

      // Check if token is close to expiration
      return currentTime > thresholdTime
    } catch (error) {
      return true
    }
  },

  /**
   * Refresh the access token
   * @returns New tokens and user data
   */
  async refreshToken(): Promise<{ accessToken: string; user: User } | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) throw new Error("Failed to refresh token")

      const data = await response.json()

      // Store new access token
      localStorage.setItem("accessToken", data.accessToken)

      return data
    } catch (error) {
      console.error("Token refresh error:", error)
      this.clearTokens()
      this.clearUser()
      return null
    }
  },

  /**
   * Log out the user
   */
  async logout(): Promise<boolean> {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()

    if (!accessToken) return true

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      })

      this.clearTokens()
      this.clearUser()

      return response.ok
    } catch (error) {
      console.error("Logout error:", error)
      this.clearTokens()
      this.clearUser()
      return false
    }
  },
}

