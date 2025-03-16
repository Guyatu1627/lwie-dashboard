"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, LayoutTemplate, Users, Settings, ChevronDown } from "lucide-react"

// Updated navigation without Purchase Order and Measurement
const mainNav = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
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
    ],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-64 bg-[#004D4D]"></div>
  }

  return (
    <nav className="w-64 bg-[#004D4D] text-white flex flex-col min-h-screen lg:h-screen lg:sticky lg:top-0">
      <div className="h-16 border-b border-white/10 flex items-center px-4">
        <span className="font-semibold">Lwie Admin</span>
      </div>
      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <div key={item.title}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors",
                pathname === item.href && "bg-white/10",
              )}
              onClick={() => {
                if (item.subItems) {
                  setOpenSubmenu(openSubmenu === item.title ? null : item.title)
                }
              }}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              <span>{item.title}</span>
              {item.subItems && (
                <ChevronDown
                  className={cn("ml-auto h-4 w-4 transition-transform", openSubmenu === item.title && "rotate-180")}
                />
              )}
            </Link>
            {item.subItems && openSubmenu === item.title && (
              <div className="ml-12 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "block py-2 px-4 text-sm hover:bg-white/10 transition-colors rounded-md",
                      pathname === subItem.href && "bg-white/10",
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

