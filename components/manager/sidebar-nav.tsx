"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart2,
  FileText,
  Settings,
  Megaphone,
  Activity,
  ShoppingCart,
  Bell,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ManagerSidebarNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Manager Dashboard</h2>
        <div className="space-y-1">
          <Button asChild variant={pathname === "/manager" ? "secondary" : "ghost"} className="w-full justify-start">
            <Link href="/manager">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/advertisements" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/advertisements">
              <Megaphone className="mr-2 h-4 w-4" />
              Advertisements
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/payments" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/payments">
              <DollarSign className="mr-2 h-4 w-4" />
              Payments
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/users" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/user-activity" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/user-activity">
              <Activity className="mr-2 h-4 w-4" />
              User Activity
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/reports" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/reports">
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Platform</h2>
        <div className="space-y-1">
          <Button
            asChild
            variant={pathname === "/manager/marketplace" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/marketplace">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Marketplace
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/notifications" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
        <div className="space-y-1">
          <Button
            asChild
            variant={pathname === "/manager/settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/settings">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/manager/help" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href="/manager/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Link>
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}

