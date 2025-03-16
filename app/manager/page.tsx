"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserActivityChart } from "@/components/manager/user-activity-chart"
import { RevenueChart } from "@/components/manager/revenue-chart"
import { PendingAdsTable } from "@/components/manager/pending-ads-table"
import { RecentTransactions } from "@/components/manager/recent-transactions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CreditCard,
  BadgePercent,
  ArrowUpRight,
  AlertTriangle,
  Flag,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

export default function ManagerDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("30d")
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [stats, setStats] = useState({
    activeUsers: 2853,
    revenue: 24389,
    pendingAds: 24,
    flaggedContent: 18,
  })

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update stats with small random changes
      setStats({
        activeUsers: Math.floor(stats.activeUsers * (1 + (Math.random() * 0.04 - 0.02))),
        revenue: Math.floor(stats.revenue * (1 + (Math.random() * 0.05 - 0.02))),
        pendingAds: Math.floor(stats.pendingAds * (1 + (Math.random() * 0.1 - 0.05))),
        flaggedContent: Math.floor(stats.flaggedContent * (1 + (Math.random() * 0.15 - 0.05))),
      })

      setIsLoading(false)
      toast({
        title: "Dashboard refreshed",
        description: "Latest data has been loaded successfully",
      })
    }, 1500)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Exporting reports",
      description: "Your dashboard reports are being prepared for download",
    })

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Dashboard reports have been downloaded successfully",
      })
    }, 2000)
  }

  // Update date range when timeframe changes
  useEffect(() => {
    const now = new Date()
    let fromDate = now

    switch (timeframe) {
      case "today":
        fromDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case "7d":
        fromDate = addDays(now, -7)
        break
      case "30d":
        fromDate = addDays(now, -30)
        break
      case "90d":
        fromDate = addDays(now, -90)
        break
      case "custom":
        // Don't change the date range for custom
        return
    }

    setDate({
      from: fromDate,
      to: new Date(),
    })
  }, [timeframe])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            {timeframe === "custom" ? (
              <DatePickerWithRange date={date} setDate={setDate} />
            ) : (
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden md:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Active Users</p>
              </div>
              <Badge className="bg-green-500">+12%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</h3>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Revenue</p>
              </div>
              <Badge className="bg-green-500">+8%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">${stats.revenue.toLocaleString()}</h3>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$1,824</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Pending Ads</p>
              </div>
              <Badge variant="outline">{stats.pendingAds}</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{stats.pendingAds}</h3>
              <div className="flex items-center text-amber-500 text-sm">
                <span>Needs Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Flagged Content</p>
              </div>
              <Badge className="bg-red-500">+5</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{stats.flaggedContent}</h3>
              <div className="flex items-center text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Urgent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {timeframe === "custom" && (
          <div className="mb-4">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UserActivityChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue from ads and premium listings</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Pending Advertisements</CardTitle>
                  <CardDescription>Ads waiting for approval</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/manager/ad-requests">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <PendingAdsTable />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest payment activities</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/manager/payments">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Detailed metrics about platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-muted-foreground">View detailed analytics on the Analytics page</p>
                <Button asChild>
                  <Link href="/manager/analytics">Go to Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download or view generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-muted-foreground">Access all reports on the Reports page</p>
                <Button asChild>
                  <Link href="/manager/reports">Go to Reports</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

