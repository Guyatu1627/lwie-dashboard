import type React from "react"
import { ManagerNav } from "@/components/manager/manager-nav"
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen">
        <ManagerNav />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ThemeProvider>
  )
}

