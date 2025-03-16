import type { GetServerSidePropsContext } from "next"
import { apiClient } from "./api-client"

/**
 * Helper function to fetch data with SSR
 * @param context - GetServerSideProps context
 * @param endpoint - API endpoint to fetch
 * @param options - Fetch options
 * @returns Fetched data
 */
export async function fetchWithSSR<T>(
  context: GetServerSidePropsContext,
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    // Get auth token from cookies if available
    const authCookie = context.req.cookies["auth-token"]

    if (authCookie) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authCookie}`,
      }
    }

    // Make the API request
    const response = await fetch(`${apiClient.baseUrl}${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("SSR fetch error:", error)
    throw error
  }
}

/**
 * Helper function to check authentication status on the server
 * @param context - GetServerSideProps context
 * @returns Authentication status and redirect if needed
 */
export async function checkAuthSSR(context: GetServerSidePropsContext) {
  try {
    // Get auth token from cookies
    const authCookie = context.req.cookies["auth-token"]

    if (!authCookie) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    // Verify token with the API
    const response = await fetch(`${apiClient.baseUrl}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${authCookie}`,
      },
    })

    if (!response.ok) {
      // Clear the invalid cookie
      context.res.setHeader("Set-Cookie", ["auth-token=; Path=/; Max-Age=0", "refresh-token=; Path=/; Max-Age=0"])

      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    const data = await response.json()

    // Check role-based access
    const path = context.resolvedUrl
    const isAdmin = data.user.role === "admin"
    const isManager = data.user.role === "manager"

    if (path.startsWith("/admin") && !isAdmin) {
      return {
        redirect: {
          destination: isManager ? "/manager" : "/login",
          permanent: false,
        },
      }
    }

    if (path.startsWith("/manager") && !isManager && !isAdmin) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: data.user,
      },
    }
  } catch (error) {
    console.error("Auth check error:", error)

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
}

