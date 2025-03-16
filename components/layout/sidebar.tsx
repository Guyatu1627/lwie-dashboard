"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Users,
  Settings,
  Package,
  ShieldCheck,
  FileText,
  Home,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  DollarSign,
  Layers,
  MessageSquare,
  PieChart,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const isAdmin = user?.role === "admin"
  const isManager = user?.role === "manager" || isAdmin

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  // Define navigation items based on user role
  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
      exact: true,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
    {
      title: "User Management",
      icon: Users,
      group: "users",
      children: [
        {
          title: "All Users",
          href: "/admin/users",
        },
        {
          title: "Roles & Permissions",
          href: "/admin/users/roles",
        },
        {
          title: "User Activity",
          href: "/admin/users/activity",
        },
      ],
    },
    {
      title: "Item Management",
      icon: Package,
      group: "items",
      children: [
        {
          title: "All Items",
          href: "/admin/items",
        },
        {
          title: "Categories",
          href: "/admin/items/categories",
        },
        {
          title: "Templates",
          href: "/admin/items/templates",
        },
        {
          title: "Custom Fields",
          href: "/admin/items/fields",
        },
      ],
    },
    {
      title: "Security",
      href: "/admin/security",
      icon: ShieldCheck,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const managerNavItems = [
    {
      title: "Dashboard",
      href: "/manager",
      icon: Home,
      exact: true,
    },
    {
      title: "Analytics",
      href: "/manager/analytics",
      icon: PieChart,
    },
    {
      title: "Advertisements",
      icon: Zap,
      group: "ads",
      children: [
        {
          title: "All Advertisements",
          href: "/manager/advertisements",
        },
        {
          title: "Pending Approval",
          href: "/manager/advertisements/pending",
        },
        {
          title: "Performance",
          href: "/manager/advertisements/performance",
        },
      ],
    },
    {
      title: "Payments",
      icon: DollarSign,
      group: "payments",
      children: [
        {
          title: "All Payments",
          href: "/manager/payments",
        },
        {
          title: "Verification",
          href: "/manager/payments/verification",
        },
        {
          title: "Reports",
          href: "/manager/payments/reports",
        },
      ],
    },
    {
      title: "Content",
      icon: Layers,
      group: "content",
      children: [
        {
          title: "Pages",
          href: "/manager/content/pages",
        },
        {
          title: "Blog Posts",
          href: "/manager/content/blog",
        },
        {
          title: "Media Library",
          href: "/manager/content/media",
        },
      ],
    },
    {
      title: "Messages",
      href: "/manager/messages",
      icon: MessageSquare,
    },
    {
      title: "Notifications",
      href: "/manager/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/manager/settings",
      icon: Settings,
    },
  ]

  const navItems = pathname.startsWith("/admin") ? adminNavItems : managerNavItems

  // Initialize open groups based on current path
  useEffect(() => {
    const newOpenGroups: Record<string, boolean> = {}

    navItems.forEach((item) => {
      if (item.group && item.children) {
        const isActive = item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))
        if (isActive) {
          newOpenGroups[item.group] = true
        }
      }
    })

    setOpenGroups(newOpenGroups)
  }, [pathname, navItems])

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href={isAdmin ? "/admin" : "/manager"} className="flex items-center gap-2 font-semibold">
          <span className="font-bold">Lwie {isAdmin ? "Admin" : "Manager"}</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            // Check if the item is active
            const isItemActive = item.exact
              ? pathname === item.href
              : item.href
                ? pathname === item.href || pathname.startsWith(item.href + "/")
                : item.children
                  ? item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"))
                  : false

            // If it's a group
            if (item.group && item.children) {
              const isOpen = openGroups[item.group]

              return (
                <div key={index} className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-between", isItemActive && "bg-accent text-accent-foreground")}
                    onClick={() => toggleGroup(item.group!)}
                  >
                    <span className="flex items-center">
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      {item.title}
                    </span>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  {isOpen && (
                    <div className="ml-4 space-y-1 pl-2 border-l">
                      {item.children.map((child, childIndex) => {
                        const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/")

                        return (
                          <Button
                            key={childIndex}
                            variant="ghost"
                            asChild
                            className={cn("w-full justify-start", isChildActive && "bg-accent text-accent-foreground")}
                          >
                            <Link href={child.href}>{child.title}</Link>
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // If it's a single item
            return (
              <Button
                key={index}
                variant="ghost"
                asChild
                className={cn("w-full justify-start", isItemActive && "bg-accent text-accent-foreground")}
              >
                <Link href={item.href!}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex flex-col gap-1 text-sm">
          <div className="text-xs text-muted-foreground">Logged in as:</div>
          <div className="font-medium">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[240px] p-0 sm:w-[280px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] flex-col border-r md:flex lg:w-[280px]">
        <SidebarContent />
      </aside>
    </>
  )
}

