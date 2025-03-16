"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  BarChart2,
  ShieldAlert,
  MessageSquare,
  ArrowLeftRight,
  Package,
  FileText,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-col bg-lwie">
      {/* Header with Logo */}
      <div className="p-4 flex items-center space-x-3">
        <div className="bg-white rounded-md w-8 h-8 flex items-center justify-center">
          <span className="text-lwie font-bold text-xl">L</span>
        </div>
        <h2 className="text-white text-xl font-medium">Lwie Admin</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <Link
            href="/admin"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/analytics"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/analytics" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            <span>Analytics</span>
          </Link>

          <Link
            href="/admin/users"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/users" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Users className="mr-3 h-5 w-5" />
            <span>Users</span>
          </Link>

          <Link
            href="/admin/items"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/items" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <Package className="mr-3 h-5 w-5" />
            <span>Items</span>
          </Link>

          <Link
            href="/admin/templates"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/templates" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <FileText className="mr-3 h-5 w-5" />
            <span>Templates</span>
          </Link>

          <Link
            href="/admin/moderation"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/moderation" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            <span>Moderation</span>
          </Link>

          <Link
            href="/admin/swaps"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/swaps" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <ArrowLeftRight className="mr-3 h-5 w-5" />
            <span>Swaps</span>
          </Link>

          <Link
            href="/admin/security"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/security" ? "bg-lwie-light" : "hover:bg-lwie-light",
            )}
          >
            <ShieldAlert className="mr-3 h-5 w-5" />
            <span>Security</span>
          </Link>

          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center px-3 py-3 text-white rounded-md",
              pathname === "/admin/settings" ? "bg-lwie-light" : "hover:bg-lwie-light",
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

