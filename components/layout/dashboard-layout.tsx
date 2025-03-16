"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/utils/auth"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Loader2 } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      return {
        href,
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
      }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  useEffect(() => {
    // Check authentication and load user data
    const checkAuth = async () => {
      try {
        setLoading(true)

        if (!auth.isAuthenticated()) {
          window.location.href = "/login"
          return
        }

        // Check if token needs refresh
        if (auth.needsRefresh()) {
          const refreshResult = await auth.refreshToken()
          if (!refreshResult) {
            window.location.href = "/login"
            return
          }
        }

        const userData = auth.getUser()
        setUser(userData)

        // Verify user role matches the dashboard type
        const isAdmin = userData?.role === "admin"
        const isManager = userData?.role === "manager"

        if (pathname.startsWith("/admin") && !isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the Admin Dashboard",
            variant: "destructive",
          })
          window.location.href = isManager ? "/manager" : "/login"
          return
        }

        if (pathname.startsWith("/manager") && !isManager && !isAdmin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the Manager Dashboard",
            variant: "destructive",
          })
          window.location.href = "/login"
          return
        }
      } catch (error) {
        console.error("Authentication error:", error)
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up socket connection for real-time updates
    const setupSocket = async () => {
      try {
        const { io } = await import("socket.io-client")
        const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
          auth: {
            token: auth.getAccessToken(),
          },
        })

        socket.on("connect", () => {
          console.log("Socket connected")
        })

        socket.on("notification", (data) => {
          toast({
            title: data.title,
            description: data.message,
          })
        })

        socket.on("disconnect", () => {
          console.log("Socket disconnected")
        })

        return () => {
          socket.disconnect()
        }
      } catch (error) {
        console.error("Socket connection error:", error)
      }
    }

    const cleanup = setupSocket()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [pathname, toast])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
          <main className="flex-1 overflow-x-hidden p-4 md:p-6 transition-all duration-200">
            <div className="mb-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
            {children}
          </main>
        </div>
        <Footer />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

