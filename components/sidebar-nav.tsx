"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Package, LayoutTemplate, ShoppingCart } from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Items",
    href: "/admin/items",
    icon: Package,
  },
  {
    title: "Template",
    href: "/admin/template",
    icon: LayoutTemplate,
    subItems: [
      { title: "Templates", href: "/admin/template/templates" },
      { title: "Category", href: "/admin/template/category" },
      { title: "Measurement", href: "/admin/template/measurement" },
    ],
  },
  {
    title: "Purchase Order",
    href: "/admin/purchase-order",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
]

export function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn("bg-[#004D4D] text-white p-4 flex flex-col gap-2", className)}>
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href
        const Icon = link.icon

        return (
          <div key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                isActive ? "bg-white/10" : "hover:bg-white/10",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.title}</span>
            </Link>
            {link.subItems && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                {link.subItems.map((subItem) => {
                  const isSubActive = pathname === subItem.href
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "text-sm rounded-lg px-3 py-2 transition-colors",
                        isSubActive ? "bg-white/10" : "hover:bg-white/10",
                      )}
                    >
                      {subItem.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

