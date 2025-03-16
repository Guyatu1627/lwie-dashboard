"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Search } from "@/components/search"
import { Overview } from "@/components/overview"
import { RecentItems } from "@/components/recent-items"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, Users, AlertTriangle } from "lucide-react"

export function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", icon: Users },
    { title: "Total Items", value: "0", icon: Package },
    { title: "Templates", value: "0", icon: FileText },
    { title: "Reported Items", value: "0", icon: AlertTriangle },
  ])

  // Fix hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)

    // Simulate API call for stats
    const fetchStats = () => {
      setStats([
        { title: "Total Users", value: "156", icon: Users },
        { title: "Total Items", value: "423", icon: Package },
        { title: "Templates", value: "15", icon: FileText },
        { title: "Reported Items", value: "8", icon: AlertTriangle },
      ])
    }

    fetchStats()
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <MainNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white dark:bg-gray-950 flex items-center px-4 justify-between sticky top-0 z-10">
          <Search />
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Items</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentItems />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

