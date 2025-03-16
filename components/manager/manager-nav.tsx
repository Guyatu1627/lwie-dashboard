"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, CreditCard, BarChart2, FileText, Settings, Megaphone, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function ManagerNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-col bg-lwie">
      {/* Header with Logo */}
      <div className="p-4 flex items-center space-x-3">
        <div className="bg-white rounded-md w-8 h-8 flex items-center justify-center">
          <span className="text-lwie font-bold text-xl">L</span>
        </div>
        <h2 className="text-white text-xl font-medium">Lwie Manager</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <Link
            href="/manager"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/manager/user-activity"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/user-activity" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>User Activity</span>
          </Link>

          <Link
            href="/manager/advertisements"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/advertisements" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Megaphone className="mr-3 h-5 w-5" />
            <span>Advertisements</span>
          </Link>

          <Link
            href="/manager/payments"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/payments" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <CreditCard className="mr-3 h-5 w-5" />
            <span>Payments</span>
          </Link>

          <Link
            href="/manager/analytics"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/analytics" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            <span>Analytics</span>
          </Link>

          <Link
            href="/manager/reports"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/reports" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <FileText className="mr-3 h-5 w-5" />
            <span>Reports</span>
          </Link>

          <Link
            href="/manager/settings"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/manager/settings" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-lwie-light">
        <Link href="/login" className="flex items-center px-3 py-3 text-white hover:bg-lwie-light rounded-md">
          <LogOut className="mr-3 h-5 w-5" />
          <span>Log out</span>
        </Link>
      </div>
    </div>
  )
}

