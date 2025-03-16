"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePickerWithRange } from "@/components/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import {
  BarChart,
  DollarSign,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  X,
  ChevronDown,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react"

import {
  Line,
  Bar,
  Pie,
  Area,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Mock data for analytics
const generateMockData = () => {
  // Add some randomness to make it look like real-time data
  const randomFactor = () => 0.9 + Math.random() * 0.2

  // Revenue data
  const revenueData = [
    { month: "Jan", revenue: Math.floor(12500 * randomFactor()), target: 12000 },
    { month: "Feb", revenue: Math.floor(15000 * randomFactor()), target: 14000 },
    { month: "Mar", revenue: Math.floor(18000 * randomFactor()), target: 16000 },
    { month: "Apr", revenue: Math.floor(24000 * randomFactor()), target: 20000 },
    { month: "May", revenue: Math.floor(28000 * randomFactor()), target: 25000 },
    { month: "Jun", revenue: Math.floor(32000 * randomFactor()), target: 30000 },
    { month: "Jul", revenue: Math.floor(38000 * randomFactor()), target: 35000 },
    { month: "Aug", revenue: Math.floor(42000 * randomFactor()), target: 40000 },
    { month: "Sep", revenue: Math.floor(45000 * randomFactor()), target: 45000 },
    { month: "Oct", revenue: Math.floor(50000 * randomFactor()), target: 50000 },
    { month: "Nov", revenue: Math.floor(55000 * randomFactor()), target: 55000 },
    { month: "Dec", revenue: Math.floor(60000 * randomFactor()), target: 60000 },
  ]

  // User activity data
  const userActivityData = [
    { date: "2024-01-01", activeUsers: Math.floor(1200 * randomFactor()), newUsers: Math.floor(150 * randomFactor()) },
    { date: "2024-01-02", activeUsers: Math.floor(1250 * randomFactor()), newUsers: Math.floor(140 * randomFactor()) },
    { date: "2024-01-03", activeUsers: Math.floor(1300 * randomFactor()), newUsers: Math.floor(160 * randomFactor()) },
    { date: "2024-01-04", activeUsers: Math.floor(1350 * randomFactor()), newUsers: Math.floor(170 * randomFactor()) },
    { date: "2024-01-05", activeUsers: Math.floor(1400 * randomFactor()), newUsers: Math.floor(180 * randomFactor()) },
    { date: "2024-01-06", activeUsers: Math.floor(1450 * randomFactor()), newUsers: Math.floor(190 * randomFactor()) },
    { date: "2024-01-07", activeUsers: Math.floor(1500 * randomFactor()), newUsers: Math.floor(200 * randomFactor()) },
    { date: "2024-01-08", activeUsers: Math.floor(1550 * randomFactor()), newUsers: Math.floor(210 * randomFactor()) },
    { date: "2024-01-09", activeUsers: Math.floor(1600 * randomFactor()), newUsers: Math.floor(220 * randomFactor()) },
    { date: "2024-01-10", activeUsers: Math.floor(1650 * randomFactor()), newUsers: Math.floor(230 * randomFactor()) },
    { date: "2024-01-11", activeUsers: Math.floor(1700 * randomFactor()), newUsers: Math.floor(240 * randomFactor()) },
    { date: "2024-01-12", activeUsers: Math.floor(1750 * randomFactor()), newUsers: Math.floor(250 * randomFactor()) },
    { date: "2024-01-13", activeUsers: Math.floor(1800 * randomFactor()), newUsers: Math.floor(260 * randomFactor()) },
    { date: "2024-01-14", activeUsers: Math.floor(1850 * randomFactor()), newUsers: Math.floor(270 * randomFactor()) },
  ]

  // Category distribution data
  const categoryData = [
    { name: "Electronics", value: Math.floor(35 * randomFactor()) },
    { name: "Clothing", value: Math.floor(25 * randomFactor()) },
    { name: "Home", value: Math.floor(20 * randomFactor()) },
    { name: "Sports", value: Math.floor(15 * randomFactor()) },
    { name: "Books", value: Math.floor(5 * randomFactor()) },
  ]

  // Geographic distribution data
  const geoData = [
    { name: "North America", value: Math.floor(45 * randomFactor()) },
    { name: "Europe", value: Math.floor(30 * randomFactor()) },
    { name: "Asia", value: Math.floor(15 * randomFactor()) },
    { name: "South America", value: Math.floor(5 * randomFactor()) },
    { name: "Africa", value: Math.floor(3 * randomFactor()) },
    { name: "Australia", value: Math.floor(2 * randomFactor()) },
  ]

  // Platform performance data
  const platformData = [
    { name: "Page Load Time", value: (2 + Math.random()).toFixed(2) + "s" },
    { name: "API Response Time", value: (0.5 + Math.random() * 0.5).toFixed(2) + "s" },
    { name: "Error Rate", value: (0.5 + Math.random()).toFixed(2) + "%" },
    { name: "Uptime", value: (99.9 + Math.random() * 0.09).toFixed(2) + "%" },
  ]

  // Conversion funnel data
  const funnelData = [
    { name: "Visitors", value: Math.floor(10000 * randomFactor()) },
    { name: "Registrations", value: Math.floor(2500 * randomFactor()) },
    { name: "Active Users", value: Math.floor(1800 * randomFactor()) },
    { name: "Transactions", value: Math.floor(500 * randomFactor()) },
    { name: "Repeat Customers", value: Math.floor(300 * randomFactor()) },
  ]

  // Revenue sources data
  const revenueSourcesData = [
    { name: "Premium Subscriptions", value: Math.floor(45 * randomFactor()) },
    { name: "Advertisements", value: Math.floor(30 * randomFactor()) },
    { name: "Featured Listings", value: Math.floor(15 * randomFactor()) },
    { name: "Transaction Fees", value: Math.floor(10 * randomFactor()) },
  ]

  // Device usage data
  const deviceData = [
    { name: "Desktop", value: Math.floor(40 * randomFactor()) },
    { name: "Mobile", value: Math.floor(50 * randomFactor()) },
    { name: "Tablet", value: Math.floor(10 * randomFactor()) },
  ]

  // User retention data
  const retentionData = [
    {
      cohort: "Jan",
      week1: 100,
      week2: Math.floor(85 * randomFactor()),
      week4: Math.floor(70 * randomFactor()),
      week8: Math.floor(60 * randomFactor()),
    },
    {
      cohort: "Feb",
      week1: 100,
      week2: Math.floor(82 * randomFactor()),
      week4: Math.floor(68 * randomFactor()),
      week8: Math.floor(58 * randomFactor()),
    },
    {
      cohort: "Mar",
      week1: 100,
      week2: Math.floor(88 * randomFactor()),
      week4: Math.floor(75 * randomFactor()),
      week8: Math.floor(65 * randomFactor()),
    },
    {
      cohort: "Apr",
      week1: 100,
      week2: Math.floor(86 * randomFactor()),
      week4: Math.floor(72 * randomFactor()),
      week8: Math.floor(62 * randomFactor()),
    },
    {
      cohort: "May",
      week1: 100,
      week2: Math.floor(90 * randomFactor()),
      week4: Math.floor(78 * randomFactor()),
      week8: Math.floor(68 * randomFactor()),
    },
    {
      cohort: "Jun",
      week1: 100,
      week2: Math.floor(87 * randomFactor()),
      week4: Math.floor(74 * randomFactor()),
      week8: Math.floor(64 * randomFactor()),
    },
  ]

  return {
    revenueData,
    userActivityData,
    categoryData,
    geoData,
    platformData,
    funnelData,
    revenueSourcesData,
    deviceData,
    retentionData,
    kpis: {
      totalRevenue: Math.floor(385000 * randomFactor()),
      totalUsers: Math.floor(25000 * randomFactor()),
      activeUsers: Math.floor(12500 * randomFactor()),
      totalItems: Math.floor(45000 * randomFactor()),
      totalTransactions: Math.floor(8500 * randomFactor()),
      averageOrderValue: Math.floor(85 * randomFactor()),
      conversionRate: (3.2 * randomFactor()).toFixed(1),
      userGrowth: (12.5 * randomFactor()).toFixed(1),
    },
  }
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [timeframe, setTimeframe] = useState("30d")
  const [currentTab, setCurrentTab] = useState("overview")
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [analyticsData, setAnalyticsData] = useState(null)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)
  const [currentChart, setCurrentChart] = useState(null)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false)

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setAnalyticsData(generateMockData())
      setIsLoading(false)
    }, 1500)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled || isLoading) return

    const interval = setInterval(() => {
      setAnalyticsData((prev) => {
        if (!prev) return generateMockData()

        // Update only specific parts of the data to simulate real-time changes
        return {
          ...prev,
          userActivityData: prev.userActivityData.map((item) => ({
            ...item,
            activeUsers: Math.floor(item.activeUsers * (0.98 + Math.random() * 0.04)),
            newUsers: Math.floor(item.newUsers * (0.98 + Math.random() * 0.04)),
          })),
          kpis: {
            ...prev.kpis,
            activeUsers: Math.floor(prev.kpis.activeUsers * (0.99 + Math.random() * 0.02)),
            totalTransactions: prev.kpis.totalTransactions + Math.floor(Math.random() * 5),
          },
        }
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isRealTimeEnabled, isLoading])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateMockData())
      setIsRefreshing(false)

      toast({
        title: "Data refreshed",
        description: "Analytics data has been updated",
      })
    }, 1500)
  }, [])

  // Handle export
  const handleExport = useCallback((format) => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)

      toast({
        title: `Export complete`,
        description: `Analytics data has been exported as ${format.toUpperCase()}`,
      })
    }, 1500)
  }, [])

  // Handle chart modal
  const handleOpenChartModal = (chartType, chartData) => {
    setCurrentChart({ type: chartType, data: chartData })
    setIsChartModalOpen(true)
  }

  // Colors for charts
  const COLORS = ["#006666", "#0ea5e9", "#f59e0b", "#a855f7", "#ef4444", "#84cc16"]

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[350px] mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
        </div>

        <Skeleton className="h-10 w-[400px]" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics for your platform</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeframe === "custom" && <DatePickerWithRange date={dateRange} setDate={setDateRange} />}

          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            size="icon"
            onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            className={isRealTimeEnabled ? "bg-green-500 hover:bg-green-600" : ""}
            title={isRealTimeEnabled ? "Disable real-time updates" : "Enable real-time updates"}
          >
            <Activity className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Total Revenue</p>
              </div>
              <Badge className="bg-green-500">+12%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">${analyticsData.kpis.totalRevenue.toLocaleString()}</h3>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+$32,500</span> from previous period
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: "85%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Active Users</p>
              </div>
              <Badge className="bg-green-500">+{analyticsData.kpis.userGrowth}%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{analyticsData.kpis.activeUsers.toLocaleString()}</h3>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+1,245</span> from previous period
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(analyticsData.kpis.activeUsers / analyticsData.kpis.totalUsers) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Transactions</p>
              </div>
              <Badge className="bg-green-500">+8%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{analyticsData.kpis.totalTransactions.toLocaleString()}</h3>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+632</span> from previous period
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: "72%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Conversion Rate</p>
              </div>
              <Badge className="bg-green-500">+1.2%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{analyticsData.kpis.conversionRate}%</h3>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+0.8%</span> from previous period
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.kpis.conversionRate * 10}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Compare Periods
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]" align="end">
              <div className="grid gap-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export as CSV"}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleExport("excel")}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export as Excel"}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export as PDF"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={() => handleExport("report")} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue vs target</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenChartModal("line", analyticsData.revenueData)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#006666"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        animationDuration={1000}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active and new users over time</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenChartModal("area", analyticsData.userActivityData)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={analyticsData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users"
                        stroke="#006666"
                        fill="#00666633"
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                      <Area
                        type="monotone"
                        dataKey="newUsers"
                        name="New Users"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Items by category</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenChartModal("pie", analyticsData.categoryData)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {analyticsData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Users by region</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleOpenChartModal("bar", analyticsData.geoData)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData.geoData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                      <Bar dataKey="value" name="Users" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#006666"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1000}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Sources */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown by revenue stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.revenueSourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {analyticsData.revenueSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Average Order Value */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Average transaction amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[350px]">
                  <div className="text-6xl font-bold text-primary">${analyticsData.kpis.averageOrderValue}</div>
                  <div className="flex items-center mt-4 text-green-500">
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                    <span className="font-medium">+8.2%</span>
                    <span className="text-muted-foreground ml-1">from previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey to purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData.funnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [value.toLocaleString(), "Count"]} />
                      <Bar dataKey="value" name="Users" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={analyticsData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                      <YAxis />
                      <Tooltip formatter={(value) => [value.toLocaleString(), "Users"]} />
                      <Area
                        type="monotone"
                        dataKey="newUsers"
                        name="New Users"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Retention */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Cohort analysis by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData.retentionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="cohort" type="category" width={50} />
                      <Tooltip formatter={(value) => [`${value}%`, "Retention Rate"]} />
                      <Legend />
                      <Bar
                        dataKey="week1"
                        name="Week 1"
                        fill="#006666"
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="week2"
                        name="Week 2"
                        fill="#0ea5e9"
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="week4"
                        name="Week 4"
                        fill="#f59e0b"
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="week8"
                        name="Week 8"
                        fill="#a855f7"
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>Users by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {analyticsData.deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analyticsData.geoData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Bar dataKey="value" name="Users" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Items by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {analyticsData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Content Growth */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Content Growth</CardTitle>
                <CardDescription>New items added over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value.toLocaleString(), "Items"]} />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="New Items"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1000}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Popular Items */}
            <Card className="overflow-hidden transition-all hover:shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
                <CardDescription>Most viewed and interacted items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item Name</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Interactions</th>
                        <th className="text-left py-3 px-4">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Vintage Camera</td>
                        <td className="py-3 px-4">Electronics</td>
                        <td className="py-3 px-4">1,245</td>
                        <td className="py-3 px-4">352</td>
                        <td className="py-3 px-4">28.3%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Mountain Bike</td>
                        <td className="py-3 px-4">Sports</td>
                        <td className="py-3 px-4">982</td>
                        <td className="py-3 px-4">287</td>
                        <td className="py-3 px-4">29.2%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Designer Watch</td>
                        <td className="py-3 px-4">Fashion</td>
                        <td className="py-3 px-4">876</td>
                        <td className="py-3 px-4">245</td>
                        <td className="py-3 px-4">28.0%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Gaming Console</td>
                        <td className="py-3 px-4">Electronics</td>
                        <td className="py-3 px-4">754</td>
                        <td className="py-3 px-4">198</td>
                        <td className="py-3 px-4">26.3%</td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">Acoustic Guitar</td>
                        <td className="py-3 px-4">Music</td>
                        <td className="py-3 px-4">687</td>
                        <td className="py-3 px-4">176</td>
                        <td className="py-3 px-4">25.6%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Metrics */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.platformData.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            metric.name === "Error Rate" ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{
                            width:
                              metric.name === "Page Load Time"
                                ? `${(Number.parseFloat(metric.value) / 5) * 100}%`
                                : metric.name === "API Response Time"
                                  ? `${(Number.parseFloat(metric.value) / 2) * 100}%`
                                  : metric.name === "Error Rate"
                                    ? `${Number.parseFloat(metric.value) * 10}%`
                                    : `${Number.parseFloat(metric.value)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Time Trend */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Response Time Trend</CardTitle>
                <CardDescription>API and page load times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                      <YAxis domain={[0, 5]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(2)}s`, "Time"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        name="Page Load Time"
                        stroke="#006666"
                        strokeWidth={2}
                        // Transform the data for this demo
                        // In a real app, you'd have actual response time data
                        dataKey={(data) => (data.activeUsers % 500) / 100 + 1.5}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        name="API Response Time"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        // Transform the data for this demo
                        dataKey={(data) => (data.newUsers % 100) / 100 + 0.5}
                        animationDuration={1000}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Error Rate */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>Percentage of failed requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analyticsData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                      <YAxis domain={[0, 5]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Error Rate"]} />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        name="Error Rate"
                        stroke="#ef4444"
                        strokeWidth={2}
                        // Transform the data for this demo
                        dataKey={(data) => (data.activeUsers % 300) / 100 + 0.5}
                        animationDuration={1000}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Server Load */}
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Server Load</CardTitle>
                <CardDescription>CPU and memory utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={analyticsData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Utilization"]} />
                      <Legend />
                      <Area
                        type="monotone"
                        name="CPU"
                        stroke="#006666"
                        fill="#00666633"
                        strokeWidth={2}
                        // Transform the data for this demo
                        dataKey={(data) => (data.activeUsers % 1000) / 20 + 30}
                        animationDuration={1000}
                      />
                      <Area
                        type="monotone"
                        name="Memory"
                        stroke="#0ea5e9"
                        fill="#0ea5e933"
                        strokeWidth={2}
                        // Transform the data for this demo
                        dataKey={(data) => (data.newUsers % 500) / 10 + 40}
                        animationDuration={1000}
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Chart Modal */}
      <Dialog open={isChartModalOpen} onOpenChange={setIsChartModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentChart?.type === "line" && "Revenue Trend"}
              {currentChart?.type === "area" && "User Activity"}
              {currentChart?.type === "pie" && "Category Distribution"}
              {currentChart?.type === "bar" && "Geographic Distribution"}
            </DialogTitle>
            <DialogDescription>
              {currentChart?.type === "line" && "Monthly revenue vs target"}
              {currentChart?.type === "area" && "Active and new users over time"}
              {currentChart?.type === "pie" && "Items by category"}
              {currentChart?.type === "bar" && "Users by region"}
            </DialogDescription>
          </DialogHeader>

          <div className="h-[500px] w-full">
            {currentChart?.type === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={currentChart.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#006666"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    animationDuration={1000}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}

            {currentChart?.type === "area" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={currentChart.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(value) => value.split("-")[2]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    name="Active Users"
                    stroke="#006666"
                    fill="#00666633"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    name="New Users"
                    stroke="#0ea5e9"
                    fill="#0ea5e933"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            )}

            {currentChart?.type === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={currentChart.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={180}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {currentChart.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}

            {currentChart?.type === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={currentChart.data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                  <Bar dataKey="value" name="Users" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChartModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button onClick={() => handleExport("chart")}>
              <Download className="mr-2 h-4 w-4" />
              Export Chart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

