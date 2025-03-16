"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NotificationBell } from "@/components/manager/notification-bell"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between">
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        <Link
          href="/manager"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/manager" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Overview
        </Link>
        <Link
          href="/manager/advertisements"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/manager/advertisements" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Advertisements
        </Link>
        <Link
          href="/manager/payments"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/manager/payments" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Payments
        </Link>
        <Link
          href="/manager/user-activity"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/manager/user-activity" ? "text-primary" : "text-muted-foreground",
          )}
        >
          User Activity
        </Link>
        <Link
          href="/manager/reports"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/manager/reports" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Reports
        </Link>
      </nav>
      <div className="flex items-center space-x-1">
        <NotificationBell />
        <ModeToggle />
      </div>
    </div>
  )
}

