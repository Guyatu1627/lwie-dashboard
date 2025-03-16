"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  Download,
  Users,
  ShieldAlert,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Flag,
  RefreshCw,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { CategoryBreakdown } from "@/components/analytics/category-breakdown"
import { UserEngagementChart } from "@/components/analytics/user-engagement-chart"
import { FraudTrendsChart } from "@/components/analytics/fraud-trends-chart"
import { GeographicalDistribution } from "@/components/analytics/geographical-distribution"
import { CategoryPopularity } from "@/components/analytics/category-popularity"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [timeframe, setTimeframe] = useState("30d")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for analytics
  const overviewData = [
    { name: "Jan", users: 400, items: 240, swaps: 180 },
    { name: "Feb", users: 450, items: 280, swaps: 210 },
    { name: "Mar", users: 500, items: 320, swaps: 240 },
    { name: "Apr", users: 470, items: 300, swaps: 220 },
    { name: "May", users: 520, items: 350, swaps: 260 },
    { name: "Jun", users: 580, items: 390, swaps: 290 },
    { name: "Jul", users: 650, items: 420, swaps: 320 },
  ]

  const userStats = {
    totalUsers: 12458,
    activeUsers: 8734,
    newUsers: 342,
    growthRate: 4.2,
    verifiedUsers: 7865,
    suspendedUsers: 124,
    userRetentionRate: 78,
  }

  const contentStats = {
    totalItems: 28945,
    activeItems: 18734,
    pendingModeration: 342,
    flaggedItems: 87,
    rejectedItems: 1245,
    popularCategories: [
      { name: "Electronics", value: 32 },
      { name: "Vehicles", value: 24 },
      { name: "Furniture", value: 18 },
      { name: "Fashion", value: 14 },
      { name: "Other", value: 12 },
    ],
  }

  const securityStats = {
    totalFraudAttempts: 278,
    blockedAccounts: 124,
    suspiciousActivities: 342,
    ipBans: 87,
    reportedUsers: 156,
    fraudTrends: [
      { name: "Jan", attempts: 32, blocked: 28 },
      { name: "Feb", attempts: 40, blocked: 35 },
      { name: "Mar", attempts: 35, blocked: 30 },
      { name: "Apr", attempts: 42, blocked: 38 },
      { name: "May", attempts: 38, blocked: 34 },
      { name: "Jun", attempts: 45, blocked: 40 },
      { name: "Jul", attempts: 50, blocked: 45 },
    ],
  }

  const swapStats = {
    totalSwaps: 8945,
    completedSwaps: 6734,
    pendingSwaps: 1245,
    cancelledSwaps: 966,
    disputedSwaps: 87,
    swapSuccessRate: 75.3,
    swapTrends: [
      { name: "Jan", completed: 780, disputed: 32 },
      { name: "Feb", completed: 850, disputed: 40 },
      { name: "Mar", completed: 920, disputed: 35 },
      { name: "Apr", completed: 890, disputed: 42 },
      { name: "May", completed: 950, disputed: 38 },
      { name: "Jun", completed: 1020, disputed: 45 },
      { name: "Jul", completed: 1100, disputed: 50 },
    ],
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = (format) => {
    // In a real app, this would generate and download a report
    alert(`Exporting ${activeTab} report as ${format}...`)
  }

  const handleTimeframeChange = (value) => {
    setTimeframe(value)
    // In a real app, this would fetch new data for the selected timeframe

    // Set date range based on timeframe
    const now = new Date()
    let from = new Date()

    switch (value) {
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    setDateRange({ from, to: now })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reporting</h1>
          <p className="text-muted-foreground">Monitor platform activity, user engagement, and security metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Button variant="outline" onClick={() => handleExport("csv")}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" onClick={() => handleExport("pdf")}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="swaps">Swaps</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">+{userStats.newUsers}</span> new users this period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentStats.totalItems.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-500 font-medium">{contentStats.pendingModeration}</span> pending
                  moderation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Swaps</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{swapStats.totalSwaps.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">{swapStats.swapSuccessRate}%</span> success rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.totalFraudAttempts}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 font-medium">{securityStats.suspiciousActivities}</span> suspicious
                  activities
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>User registrations, item listings, and completed swaps</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="items" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="swaps" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Geographical Distribution</CardTitle>
                <CardDescription>User distribution by location</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <GeographicalDistribution />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Popularity</CardTitle>
                <CardDescription>Most popular item categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <CategoryPopularity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={userStats.growthRate > 0 ? "text-green-500" : "text-red-500"}>
                    {userStats.growthRate > 0 ? "+" : ""}
                    {userStats.growthRate}%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% of total users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.verifiedUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100)}% verification rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.suspendedUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((userStats.suspendedUsers / userStats.totalUsers) * 100).toFixed(2)}% of total users
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Daily active users and retention metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <UserEngagementChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Age groups and user types</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "18-24", value: 20 },
                        { name: "25-34", value: 35 },
                        { name: "35-44", value: 25 },
                        { name: "45-54", value: 15 },
                        { name: "55+", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ffc658" />
                      <Cell fill="#ff8042" />
                      <Cell fill="#0088fe" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Jan", retention: 85 },
                      { month: "Feb", retention: 82 },
                      { month: "Mar", retention: 78 },
                      { month: "Apr", retention: 75 },
                      { month: "May", retention: 79 },
                      { month: "Jun", retention: 80 },
                      { month: "Jul", retention: 78 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="retention" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentStats.totalItems.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {contentStats.activeItems.toLocaleString()} active listings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentStats.pendingModeration}</div>
                <p className="text-xs text-muted-foreground">Items awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentStats.flaggedItems}</div>
                <p className="text-xs text-muted-foreground">Reported by users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Items</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contentStats.rejectedItems}</div>
                <p className="text-xs text-muted-foreground">
                  {((contentStats.rejectedItems / contentStats.totalItems) * 100).toFixed(2)}% rejection rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Distribution of items by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <CategoryBreakdown />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Moderation actions over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { month: "Jan", approved: 420, rejected: 65 },
                      { month: "Feb", approved: 480, rejected: 78 },
                      { month: "Mar", approved: 520, rejected: 90 },
                      { month: "Apr", approved: 490, rejected: 85 },
                      { month: "May", approved: 540, rejected: 95 },
                      { month: "Jun", approved: 580, rejected: 105 },
                      { month: "Jul", approved: 620, rejected: 110 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                    <Bar dataKey="rejected" fill="#ff8042" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Most active item categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentStats.popularCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {contentStats.popularCategories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Attempts</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.totalFraudAttempts}</div>
                <p className="text-xs text-muted-foreground">{securityStats.blockedAccounts} accounts blocked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Activities</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.suspiciousActivities}</div>
                <p className="text-xs text-muted-foreground">Flagged for review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IP Bans</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.ipBans}</div>
                <p className="text-xs text-muted-foreground">Active IP bans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reported Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityStats.reportedUsers}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Trends</CardTitle>
              <CardDescription>Fraud attempts and blocked activities</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <FraudTrendsChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Incidents by Type</CardTitle>
                <CardDescription>Breakdown of security issues</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Account Takeover", value: 35 },
                        { name: "Fake Listings", value: 45 },
                        { name: "Spam", value: 20 },
                        { name: "Prohibited Items", value: 15 },
                        { name: "Other", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#ff0000" />
                      <Cell fill="#ff8042" />
                      <Cell fill="#ffbb28" />
                      <Cell fill="#00c49f" />
                      <Cell fill="#0088fe" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Login Attempts</CardTitle>
                <CardDescription>Successful vs. failed login attempts</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { day: "Mon", successful: 245, failed: 15 },
                      { day: "Tue", successful: 258, failed: 18 },
                      { day: "Wed", successful: 278, failed: 22 },
                      { day: "Thu", successful: 290, failed: 25 },
                      { day: "Fri", successful: 310, failed: 30 },
                      { day: "Sat", successful: 350, failed: 35 },
                      { day: "Sun", successful: 320, failed: 28 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="successful" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="failed" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Swaps Tab */}
        <TabsContent value="swaps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Swaps</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{swapStats.totalSwaps.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{swapStats.completedSwaps.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{swapStats.swapSuccessRate}% success rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Swaps</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{swapStats.pendingSwaps.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Awaiting completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disputed Swaps</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{swapStats.disputedSwaps}</div>
                <p className="text-xs text-muted-foreground">
                  {((swapStats.disputedSwaps / swapStats.totalSwaps) * 100).toFixed(2)}% dispute rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Swap Trends</CardTitle>
              <CardDescription>Completed and disputed swaps over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={swapStats.swapTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="disputed" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Swap Categories</CardTitle>
                <CardDescription>Most swapped item categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { category: "Electronics", count: 2450 },
                      { category: "Vehicles", count: 1850 },
                      { category: "Furniture", count: 1540 },
                      { category: "Fashion", count: 1280 },
                      { category: "Sports", count: 980 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Swaps" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Swap Value Distribution</CardTitle>
                <CardDescription>Distribution of swaps by estimated value</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "$0-$50", value: 25 },
                        { name: "$51-$200", value: 35 },
                        { name: "$201-$500", value: 20 },
                        { name: "$501-$1000", value: 15 },
                        { name: "$1000+", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ffc658" />
                      <Cell fill="#ff8042" />
                      <Cell fill="#0088fe" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

