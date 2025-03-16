"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  Users,
  Activity,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Mail,
  ExternalLink,
  UserCheck,
  UserX,
  Flag,
  Shield,
  TrendingUp,
  MapPin,
  Bell,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Mock user data
const mockUsers = [
  {
    id: "u1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "online",
    lastActive: "Just now",
    sessionTime: "45m 12s",
    actions: 28,
    listings: 3,
    swaps: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2023-01-15",
    trustScore: 92,
  },
  {
    id: "u2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    status: "online",
    lastActive: "5 minutes ago",
    sessionTime: "1h 23m",
    actions: 42,
    listings: 5,
    swaps: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2023-02-20",
    trustScore: 88,
  },
  {
    id: "u3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    status: "offline",
    lastActive: "2 hours ago",
    sessionTime: "32m 45s",
    actions: 15,
    listings: 2,
    swaps: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    joinDate: "2023-03-10",
    trustScore: 65,
  },
  {
    id: "u4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "online",
    lastActive: "Just now",
    sessionTime: "2h 15m",
    actions: 56,
    listings: 8,
    swaps: 4,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2022-11-05",
    trustScore: 95,
  },
  {
    id: "u5",
    name: "David Lee",
    email: "david.lee@example.com",
    status: "offline",
    lastActive: "1 day ago",
    sessionTime: "15m 30s",
    actions: 8,
    listings: 1,
    swaps: 0,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    joinDate: "2023-04-18",
    trustScore: 45,
  },
  {
    id: "u6",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    status: "online",
    lastActive: "15 minutes ago",
    sessionTime: "1h 05m",
    actions: 32,
    listings: 4,
    swaps: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2022-12-12",
    trustScore: 87,
  },
  {
    id: "u7",
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    status: "online",
    lastActive: "30 minutes ago",
    sessionTime: "55m 20s",
    actions: 24,
    listings: 3,
    swaps: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2023-01-30",
    trustScore: 82,
  },
  {
    id: "u8",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@example.com",
    status: "offline",
    lastActive: "3 hours ago",
    sessionTime: "28m 15s",
    actions: 18,
    listings: 2,
    swaps: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    joinDate: "2023-05-02",
    trustScore: 71,
  },
  {
    id: "u9",
    name: "James Wilson",
    email: "james.wilson@example.com",
    status: "online",
    lastActive: "10 minutes ago",
    sessionTime: "1h 42m",
    actions: 38,
    listings: 6,
    swaps: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2022-10-15",
    trustScore: 90,
  },
  {
    id: "u10",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    status: "online",
    lastActive: "Just now",
    sessionTime: "2h 05m",
    actions: 45,
    listings: 7,
    swaps: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    joinDate: "2023-02-08",
    trustScore: 93,
  },
]

// Mock activity data
const mockActivityData = [
  { date: "Jan", activeUsers: 1200, newUsers: 450, engagementRate: 68 },
  { date: "Feb", activeUsers: 1350, newUsers: 480, engagementRate: 72 },
  { date: "Mar", activeUsers: 1500, newUsers: 520, engagementRate: 75 },
  { date: "Apr", activeUsers: 1650, newUsers: 550, engagementRate: 73 },
  { date: "May", activeUsers: 1800, newUsers: 600, engagementRate: 78 },
  { date: "Jun", activeUsers: 2100, newUsers: 680, engagementRate: 82 },
  { date: "Jul", activeUsers: 2400, newUsers: 720, engagementRate: 85 },
  { date: "Aug", activeUsers: 2650, newUsers: 750, engagementRate: 83 },
  { date: "Sep", activeUsers: 2800, newUsers: 780, engagementRate: 80 },
  { date: "Oct", activeUsers: 3000, newUsers: 820, engagementRate: 82 },
  { date: "Nov", activeUsers: 3200, newUsers: 850, engagementRate: 84 },
  { date: "Dec", activeUsers: 3500, newUsers: 900, engagementRate: 86 },
]

// Mock retention data
const mockRetentionData = [
  { cohort: "Jan", week1: 100, week2: 85, week4: 72, week8: 65, week12: 58 },
  { cohort: "Feb", week1: 100, week2: 82, week4: 70, week8: 62, week12: 55 },
  { cohort: "Mar", week1: 100, week2: 88, week4: 75, week8: 68, week12: 60 },
  { cohort: "Apr", week1: 100, week2: 86, week4: 74, week8: 67, week12: 59 },
  { cohort: "May", week1: 100, week2: 90, week4: 78, week8: 70, week12: 63 },
  { cohort: "Jun", week1: 100, week2: 87, week4: 76, week8: 69, week12: 62 },
]

// Mock geographic data
const mockGeoData = [
  { name: "North America", users: 1245, change: "+12%" },
  { name: "Europe", users: 982, change: "+8%" },
  { name: "Asia", users: 754, change: "+15%" },
  { name: "South America", users: 421, change: "+5%" },
  { name: "Africa", users: 287, change: "+18%" },
  { name: "Oceania", users: 164, change: "+7%" },
]

// Mock device data
const mockDeviceData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 40 },
  { name: "Tablet", value: 15 },
]

// Mock recent activities
const mockRecentActivities = [
  { id: 1, user: "John Smith", action: "Created a new listing", time: "2 minutes ago", type: "listing" },
  { id: 2, user: "Emily Johnson", action: "Completed a swap", time: "15 minutes ago", type: "swap" },
  { id: 3, user: "Michael Brown", action: "Updated profile", time: "32 minutes ago", type: "profile" },
  { id: 4, user: "Sarah Wilson", action: "Left a review", time: "1 hour ago", type: "review" },
  { id: 5, user: "David Lee", action: "Viewed an item", time: "2 hours ago", type: "view" },
  { id: 6, user: "Jessica Taylor", action: "Sent a message", time: "3 hours ago", type: "message" },
  { id: 7, user: "Robert Martinez", action: "Requested a swap", time: "4 hours ago", type: "request" },
]

export default function UserActivityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [liveUpdates, setLiveUpdates] = useState(true)
  const [timeframe, setTimeframe] = useState("30d")
  const [userType, setUserType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortField, setSortField] = useState("actions")
  const [sortDirection, setSortDirection] = useState("desc")
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [notifications, setNotifications] = useState([])

  const [filters, setFilters] = useState({
    hasListings: false,
    hasSwaps: false,
    isVerified: false,
    joinedRecently: false,
    highActivity: false,
  })

  const [stats, setStats] = useState({
    activeUsers: 0,
    avgSessionTime: "0:00",
    engagementRate: 0,
    newUsers: 0,
    totalUsers: 0,
    onlineUsers: 0,
    totalSwaps: 0,
    totalListings: 0,
  })

  const [users, setUsers] = useState([])
  const [activityData, setActivityData] = useState([])
  const [retentionData, setRetentionData] = useState([])
  const [geoData, setGeoData] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  // Initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setUsers(mockUsers)
      setActivityData(mockActivityData)
      setRetentionData(mockRetentionData)
      setGeoData(mockGeoData)
      setDeviceData(mockDeviceData)
      setRecentActivities(mockRecentActivities)

      setStats({
        activeUsers: 2853,
        avgSessionTime: "8:42",
        engagementRate: 68,
        newUsers: 342,
        totalUsers: 12467,
        onlineUsers: 876,
        totalSwaps: 5842,
        totalListings: 9735,
      })

      // Initial notifications
      setNotifications([
        { id: 1, type: "user_joined", message: "New user registered: Emily Parker", time: "2 minutes ago" },
        { id: 2, type: "swap_completed", message: "Swap #4582 completed successfully", time: "15 minutes ago" },
        {
          id: 3,
          type: "high_activity",
          message: "Unusual activity detected from IP 192.168.1.45",
          time: "32 minutes ago",
        },
      ])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!liveUpdates || isLoading) return

    // Simulate connection established
    toast({
      title: "Real-time connection established",
      description: "You are now receiving live user activity updates",
    })

    const interval = setInterval(() => {
      // Update stats with small random changes
      setStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 7) - 3,
        avgSessionTime: `${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        engagementRate: Math.min(100, Math.max(0, prev.engagementRate + (Math.random() * 2 - 1))),
        newUsers: prev.newUsers + Math.floor(Math.random() * 3),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 5) - 2,
        totalSwaps: prev.totalSwaps + Math.floor(Math.random() * 2),
        totalListings: prev.totalListings + Math.floor(Math.random() * 3),
      }))

      // Randomly update a user's status or activity
      setUsers((prev) => {
        const newList = [...prev]
        const randomIndex = Math.floor(Math.random() * newList.length)
        const randomUser = { ...newList[randomIndex] }

        // Randomly choose what to update
        const updateType = Math.floor(Math.random() * 4)

        switch (updateType) {
          case 0: // Update status
            randomUser.status = randomUser.status === "online" ? "offline" : "online"
            randomUser.lastActive =
              randomUser.status === "online" ? "Just now" : `${Math.floor(Math.random() * 30) + 1} minutes ago`
            break
          case 1: // Update session time
            const minutes = Math.floor(Math.random() * 60)
            const hours = Math.floor(Math.random() * 3)
            randomUser.sessionTime = `${hours > 0 ? hours + "h " : ""}${minutes}m ${Math.floor(Math.random() * 60)}s`
            break
          case 2: // Update actions
            randomUser.actions += Math.floor(Math.random() * 5) + 1
            break
          case 3: // Update listings or swaps
            if (Math.random() > 0.5) {
              randomUser.listings += 1
            } else {
              randomUser.swaps += 1
            }
            break
        }

        newList[randomIndex] = randomUser
        return newList
      })

      // Occasionally add new notifications (20% chance)
      if (Math.random() < 0.2) {
        const notificationTypes = [
          {
            type: "user_joined",
            message: `New user registered: ${["Alex Thompson", "Maria Garcia", "James Wilson", "Sophia Chen"][Math.floor(Math.random() * 4)]}`,
          },
          {
            type: "swap_completed",
            message: `Swap #${Math.floor(Math.random() * 1000) + 4000} completed successfully`,
          },
          {
            type: "high_activity",
            message: `Unusual activity detected from IP ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          },
          {
            type: "new_listing",
            message: `New premium listing created: ${["Vintage Camera", "Mountain Bike", "Gaming Console", "Designer Watch"][Math.floor(Math.random() * 4)]}`,
          },
        ]

        const newNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        setNotifications((prev) => [
          {
            id: Date.now(),
            ...newNotification,
            time: "Just now",
          },
          ...prev.slice(0, 9),
        ]) // Keep only the 10 most recent notifications

        // Show toast for important notifications
        if (newNotification.type === "high_activity" || Math.random() < 0.3) {
          toast({
            title: "New activity detected",
            description: newNotification.message,
          })
        }
      }

      // Add new activity
      if (Math.random() < 0.3) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const actionTypes = [
          { action: "Created a new listing", type: "listing" },
          { action: "Completed a swap", type: "swap" },
          { action: "Updated profile", type: "profile" },
          { action: "Left a review", type: "review" },
          { action: "Viewed an item", type: "view" },
          { action: "Sent a message", type: "message" },
          { action: "Requested a swap", type: "request" },
        ]
        const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)]

        setRecentActivities((prev) => [
          {
            id: Date.now(),
            user: randomUser?.name || "Anonymous User",
            action: randomAction.action,
            time: "Just now",
            type: randomAction.type,
          },
          ...prev.slice(0, 6),
        ])
      }
    }, 5000) // Update every 5 seconds

    return () => {
      clearInterval(interval)
      if (!isLoading) {
        toast({
          title: "Real-time updates paused",
          description: "Live data feed has been disconnected",
          variant: "destructive",
        })
      }
    }
  }, [liveUpdates, isLoading, users])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)

      // Update stats
      setStats((prev) => ({
        activeUsers: Math.floor(prev.activeUsers * (1 + (Math.random() * 0.1 - 0.05))),
        avgSessionTime: `${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        engagementRate: Math.min(100, Math.max(0, prev.engagementRate + (Math.random() * 6 - 3))),
        newUsers: Math.floor(prev.newUsers * (1 + (Math.random() * 0.1 - 0.05))),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        onlineUsers: Math.floor(prev.onlineUsers * (1 + (Math.random() * 0.15 - 0.05))),
        totalSwaps: prev.totalSwaps + Math.floor(Math.random() * 15),
        totalListings: prev.totalListings + Math.floor(Math.random() * 25),
      }))

      toast({
        title: "Data refreshed",
        description: "User activity data has been updated",
      })
    }, 1500)
  }, [])

  // Handle export
  const handleExport = useCallback((format) => {
    setIsExporting(true)

    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Export complete",
        description: `User activity data exported as ${format.toUpperCase()}`,
      })
    }, 1500)
  }, [])

  // Toggle live updates
  const toggleLiveUpdates = useCallback(() => {
    setLiveUpdates((prev) => !prev)
  }, [])

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      hasListings: false,
      hasSwaps: false,
      isVerified: false,
      joinedRecently: false,
      highActivity: false,
    })
    setSearchQuery("")
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
    })
  }, [])

  // Handle sort
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("desc")
      }
    },
    [sortField, sortDirection],
  )

  // Handle user action
  const handleUserAction = useCallback((action, userId) => {
    // Simulate API call
    toast({
      title: `${action} action initiated`,
      description: `Processing ${action.toLowerCase()} action for user ID: ${userId}`,
    })

    setTimeout(() => {
      // Update UI based on action
      if (action === "Suspend") {
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: "offline", lastActive: "Suspended" } : user)),
        )
      } else if (action === "Verify") {
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isVerified: true } : user)))
      }

      toast({
        title: `${action} action completed`,
        description: `Successfully performed ${action.toLowerCase()} action on user ID: ${userId}`,
      })
    }, 1000)
  }, [])

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Search query filter
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // User type filter
    if (userType !== "all") {
      if (userType === "active" && user.status !== "online") return false
      if (userType === "inactive" && user.status !== "offline") return false
      if (userType === "new" && new Date(user.joinDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return false
      if (userType === "returning" && user.swaps === 0) return false
    }

    // Additional filters
    if (filters.hasListings && user.listings === 0) return false
    if (filters.hasSwaps && user.swaps === 0) return false
    if (filters.isVerified && !user.isVerified) return false
    if (filters.joinedRecently && new Date(user.joinDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      return false
    if (filters.highActivity && user.actions < 30) return false

    return true
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "name" || sortField === "email" || sortField === "lastActive" || sortField === "sessionTime") {
      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField])
    } else {
      return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)

  // Device data colors
  const deviceColors = ["#006666", "#0ea5e9", "#f59e0b"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Activity Tracking</h1>
          <p className="text-muted-foreground flex items-center">
            Monitor user engagement and platform activity in real-time
            {liveUpdates && (
              <span className="ml-2 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
                {notifications.length > 0 && <Badge className="ml-1 bg-red-500">{notifications.length}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <h4 className="font-medium">Recent Activity</h4>
                <p className="text-xs text-muted-foreground">Real-time platform notifications</p>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 rounded-full",
                            notification.type === "high_activity"
                              ? "bg-red-500"
                              : notification.type === "user_joined"
                                ? "bg-green-500"
                                : notification.type === "swap_completed"
                                  ? "bg-blue-500"
                                  : "bg-amber-500",
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

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

          <Button
            variant={liveUpdates ? "default" : "outline"}
            size="icon"
            onClick={toggleLiveUpdates}
            className={liveUpdates ? "bg-green-500 hover:bg-green-600" : ""}
            title={liveUpdates ? "Disable live updates" : "Enable live updates"}
          >
            <Activity className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Active Users</p>
                  </div>
                  <Badge className="bg-green-500">+12%</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</h3>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+156</span> from previous period
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.activeUsers / stats.totalUsers) * 100 * 3)}%` }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Avg. Session Time</p>
                  </div>
                  <Badge className="bg-green-500">+8%</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stats.avgSessionTime}</h3>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+0:36</span> from previous period
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Engagement Rate</p>
                  </div>
                  <Badge className="bg-green-500">+5%</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stats.engagementRate.toFixed(1)}%</h3>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+3%</span> from previous period
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.engagementRate}%` }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">New Users</p>
                  </div>
                  <Badge className="bg-green-500">+18%</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stats.newUsers}</h3>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+52</span> from previous period
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full md:w-[240px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && <Badge className="ml-1 bg-primary">{activeFiltersCount}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px]" align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filter Users</h4>
                  <p className="text-sm text-muted-foreground">Narrow down user activity results</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasListings"
                      checked={filters.hasListings}
                      onCheckedChange={(checked) => handleFilterChange("hasListings", checked)}
                    />
                    <Label htmlFor="hasListings">Has active listings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasSwaps"
                      checked={filters.hasSwaps}
                      onCheckedChange={(checked) => handleFilterChange("hasSwaps", checked)}
                    />
                    <Label htmlFor="hasSwaps">Has completed swaps</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVerified"
                      checked={filters.isVerified}
                      onCheckedChange={(checked) => handleFilterChange("isVerified", checked)}
                    />
                    <Label htmlFor="isVerified">Verified users only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="joinedRecently"
                      checked={filters.joinedRecently}
                      onCheckedChange={(checked) => handleFilterChange("joinedRecently", checked)}
                    />
                    <Label htmlFor="joinedRecently">Joined in last 30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highActivity"
                      checked={filters.highActivity}
                      onCheckedChange={(checked) => handleFilterChange("highActivity", checked)}
                    />
                    <Label htmlFor="highActivity">High activity users</Label>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="new">New Users</SelectItem>
              <SelectItem value="returning">Returning Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
            </SelectContent>
          </Select>
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
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export as PDF"}
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Retention</span>
          </TabsTrigger>
          <TabsTrigger value="geographic" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Geographic</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Recent user activity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-white",
                            activity.type === "listing"
                              ? "bg-green-500"
                              : activity.type === "swap"
                                ? "bg-blue-500"
                                : activity.type === "profile"
                                  ? "bg-purple-500"
                                  : activity.type === "review"
                                    ? "bg-amber-500"
                                    : activity.type === "view"
                                      ? "bg-gray-500"
                                      : activity.type === "message"
                                        ? "bg-pink-500"
                                        : "bg-indigo-500",
                          )}
                        >
                          {activity.type === "listing" ? (
                            <BarChart className="h-5 w-5" />
                          ) : activity.type === "swap" ? (
                            <RefreshCw className="h-5 w-5" />
                          ) : activity.type === "profile" ? (
                            <UserCheck className="h-5 w-5" />
                          ) : activity.type === "review" ? (
                            <Star className="h-5 w-5" />
                          ) : activity.type === "view" ? (
                            <Eye className="h-5 w-5" />
                          ) : activity.type === "message" ? (
                            <MessageSquare className="h-5 w-5" />
                          ) : (
                            <ArrowRightLeft className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.action} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>User access by device type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          animationDuration={1000}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "6px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "none",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>Detailed user information and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                        User {getSortIcon("name")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {getSortIcon("status")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("lastActive")} style={{ cursor: "pointer" }}>
                        Last Active {getSortIcon("lastActive")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("sessionTime")} style={{ cursor: "pointer" }}>
                        Session Time {getSortIcon("sessionTime")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("actions")} style={{ cursor: "pointer" }}>
                        Actions {getSortIcon("actions")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("listings")} style={{ cursor: "pointer" }}>
                        Listings {getSortIcon("listings")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("swaps")} style={{ cursor: "pointer" }}>
                        Swaps {getSortIcon("swaps")}
                      </TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(itemsPerPage)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-[120px]" />
                                  <Skeleton className="h-3 w-[150px] mt-1" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No users found matching the current filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="group transition-colors hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="border border-border">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name.charAt(0)}
                                    {user.name.split(" ")[1]?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {user.isVerified && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                                    <Shield className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "online"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>{user.sessionTime}</TableCell>
                          <TableCell>{user.actions}</TableCell>
                          <TableCell>{user.listings}</TableCell>
                          <TableCell>{user.swaps}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction("View profile for", user.id)}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("Contact", user.id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Contact User
                                </DropdownMenuItem>
                                {!user.isVerified && (
                                  <DropdownMenuItem onClick={() => handleUserAction("Verify", user.id)}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Verify User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleUserAction("Flag", user.id)}
                                  className="text-amber-600"
                                >
                                  <Flag className="mr-2 h-4 w-4" />
                                  Flag Account
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUserAction("Suspend", user.id)}
                                  className="text-red-600"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
                <div className="text-sm text-muted-foreground">
                  {sortedUsers.length > 0 ? (
                    <>
                      Showing {Math.min(sortedUsers.length, (currentPage - 1) * itemsPerPage + 1)} to{" "}
                      {Math.min(sortedUsers.length, currentPage * itemsPerPage)} of {sortedUsers.length} users
                    </>
                  ) : (
                    <>No users found</>
                  )}
                </div>
                {sortedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="hidden sm:flex"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="hidden sm:flex"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>User Engagement Trends</CardTitle>
              <CardDescription>User engagement metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="left" />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      orientation="right"
                      yAxisId="right"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                      animationDuration={300}
                    />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#006666"
                      strokeWidth={2}
                      yAxisId="left"
                      name="Active Users"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#006666", strokeWidth: 2 }}
                      animationDuration={1000}
                    />

                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      yAxisId="left"
                      name="New Users"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2 }}
                      animationDuration={1000}
                    />

                    <Line
                      type="monotone"
                      dataKey="engagementRate"
                      stroke="#a855f7"
                      strokeWidth={2}
                      yAxisId="right"
                      name="Engagement Rate (%)"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Top Users by Trust Score</CardTitle>
                <CardDescription>Users with highest platform trust ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...users]
                      .sort((a, b) => b.trustScore - a.trustScore)
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="border border-border">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                  {user.name.split(" ")[1]?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {user.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                                  <Shield className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{user.trustScore}</div>
                            <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="bg-green-500 h-full rounded-full"
                                style={{ width: `${user.trustScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Most Active Users</CardTitle>
                <CardDescription>Users with highest activity levels</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...users]
                      .sort((a, b) => b.actions - a.actions)
                      .slice(0, 5)
                      .map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="border border-border">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                  {user.name.split(" ")[1]?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {user.status === "online" && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                                  <div className="h-2 w-2 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {user.actions} actions • {user.sessionTime}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>User retention rates over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retentionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="cohort"
                      type="category"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Retention Rate"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                      animationDuration={300}
                    />
                    <Legend />
                    <Bar dataKey="week1" name="Week 1" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    <Bar dataKey="week2" name="Week 2" fill="#0ea5e9" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    <Bar dataKey="week4" name="Week 4" fill="#f59e0b" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    <Bar dataKey="week8" name="Week 8" fill="#a855f7" radius={[0, 4, 4, 0]} animationDuration={1000} />
                    <Bar
                      dataKey="week12"
                      name="Week 12"
                      fill="#ef4444"
                      radius={[0, 4, 4, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>User Churn Analysis</CardTitle>
              <CardDescription>Understanding why users leave the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Top Churn Reasons</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Found better alternative</span>
                          <span className="text-sm font-medium">38%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "38%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Poor user experience</span>
                          <span className="text-sm font-medium">24%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "24%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Lack of desired items</span>
                          <span className="text-sm font-medium">18%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "18%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Trust concerns</span>
                          <span className="text-sm font-medium">12%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Other reasons</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: "8%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Churn Prevention Strategies</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">Improve Onboarding</h4>
                        <p className="text-sm text-muted-foreground">
                          Streamline the user onboarding process to increase initial engagement.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">Enhance User Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          Address UX pain points identified through user feedback.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">Expand Item Categories</h4>
                        <p className="text-sm text-muted-foreground">
                          Increase the variety of items available for swapping.
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">Build Trust</h4>
                        <p className="text-sm text-muted-foreground">
                          Implement additional verification and security measures.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User distribution by location</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[450px] w-full" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
                  <div className="lg:col-span-3 h-[400px] lg:h-full bg-muted rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Interactive map visualization</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Regions</h3>
                    <div className="space-y-2">
                      {geoData.map((region) => (
                        <Card key={region.name} className="overflow-hidden transition-all hover:shadow-md">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{region.name}</span>
                              <Badge className="bg-green-500">{region.change}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {region.users.toLocaleString()} active users
                            </div>
                            <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="bg-green-500 h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (region.users / 1500) * 100)}%`,
                                  transition: "width 0.5s ease-in-out",
                                }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing imports for the icons used in the recent activities section
function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Eye(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function MessageSquare(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ArrowRightLeft(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 8 4 4-4 4" />
      <path d="M6 12h16" />
      <path d="m6 16-4-4 4-4" />
      <path d="M18 12H2" />
    </svg>
  )
}

