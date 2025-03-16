import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AdminMainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/admin" className="text-xl font-bold transition-colors hover:text-primary">
        Lwie Admin
      </Link>
      <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link
        href="/admin/analytics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Analytics
      </Link>
      <Link
        href="/admin/users"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Users
      </Link>
      <Link
        href="/admin/moderation"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Moderation
      </Link>
    </nav>
  )
}

