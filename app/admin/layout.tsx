import type React from "react"
import { AdminSidebarNav } from "@/components/admin/sidebar-nav"
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen">
        <AdminSidebarNav />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ThemeProvider>
  )
}

