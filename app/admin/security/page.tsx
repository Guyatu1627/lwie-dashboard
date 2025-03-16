"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Eye,
  Filter,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  UserX,
  Globe,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SecurityLogs } from "@/components/security/security-logs"
import { FraudDetectionSettings } from "@/components/security/fraud-detection-settings"
import { IPBanList } from "@/components/security/ip-ban-list"

export default function SecurityPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [securityAlerts, setSecurityAlerts] = useState([])
  const [reportedUsers, setReportedUsers] = useState([])
  const [filteredAlerts, setFilteredAlerts] = useState([])
  const [filteredReports, setFilteredReports] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for security alerts
    const fetchSecurityAlerts = () => {
      const mockAlerts = [
        {
          id: "1",
          type: "Login Attempt",
          severity: "High",
          description: "Multiple failed login attempts from IP 192.168.1.1",
          timestamp: "2024-01-14T10:23:45",
          status: "Open",
          ipAddress: "192.168.1.1",
          userId: "user123",
          userName: "john_doe",
        },
        {
          id: "2",
          type: "Suspicious Activity",
          severity: "Medium",
          description: "User posted 15 similar items in 5 minutes",
          timestamp: "2024-01-14T09:15:30",
          status: "Investigating",
          ipAddress: "192.168.2.2",
          userId: "user456",
          userName: "jane_smith",
        },
        {
          id: "3",
          type: "Fraud Attempt",
          severity: "High",
          description: "Attempt to use stolen credit card information",
          timestamp: "2024-01-13T18:45:12",
          status: "Resolved",
          ipAddress: "192.168.3.3",
          userId: "user789",
          userName: "bob_johnson",
        },
        {
          id: "4",
          type: "Account Takeover",
          severity: "Critical",
          description: "Password reset from unrecognized device and location",
          timestamp: "2024-01-13T14:30:22",
          status: "Open",
          ipAddress: "192.168.4.4",
          userId: "user101",
          userName: "alice_brown",
        },
        {
          id: "5",
          type: "Prohibited Content",
          severity: "Medium",
          description: "User attempted to post prohibited items",
          timestamp: "2024-01-12T11:20:15",
          status: "Resolved",
          ipAddress: "192.168.5.5",
          userId: "user202",
          userName: "charlie_wilson",
        },
      ]
      setSecurityAlerts(mockAlerts)
      setFilteredAlerts(mockAlerts)
    }

    // Simulate API call for reported users
    const fetchReportedUsers = () => {
      const mockReports = [
        {
          id: "1",
          userId: "user123",
          userName: "john_doe",
          reportCount: 5,
          lastReportDate: "2024-01-14",
          reportReason: "Suspicious behavior",
          status: "Under Review",
          trustScore: 35,
        },
        {
          id: "2",
          userId: "user456",
          userName: "jane_smith",
          reportCount: 3,
          lastReportDate: "2024-01-13",
          reportReason: "Fake listings",
          status: "Under Review",
          trustScore: 42,
        },
        {
          id: "3",
          userId: "user789",
          userName: "bob_johnson",
          reportCount: 8,
          lastReportDate: "2024-01-12",
          reportReason: "Scam attempt",
          status: "Suspended",
          trustScore: 15,
        },
        {
          id: "4",
          userId: "user101",
          userName: "alice_brown",
          reportCount: 2,
          lastReportDate: "2024-01-11",
          reportReason: "Harassment",
          status: "Cleared",
          trustScore: 78,
        },
        {
          id: "5",
          userId: "user202",
          userName: "charlie_wilson",
          reportCount: 4,
          lastReportDate: "2024-01-10",
          reportReason: "Prohibited items",
          status: "Suspended",
          trustScore: 22,
        },
      ]
      setReportedUsers(mockReports)
      setFilteredReports(mockReports)
    }

    fetchSecurityAlerts()
    fetchReportedUsers()
  }, [])

  useEffect(() => {
    // Filter security alerts based on search query and status filter
    let filtered = securityAlerts

    if (searchQuery) {
      filtered = filtered.filter((alert) =>
        Object.values(alert).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)

    // Filter reported users based on search query
    if (searchQuery) {
      const filteredUsers = reportedUsers.filter((user) =>
        Object.values(user).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
      setFilteredReports(filteredUsers)
    } else {
      setFilteredReports(reportedUsers)
    }
  }, [searchQuery, statusFilter, securityAlerts, reportedUsers])

  if (!mounted) {
    return null
  }

  const handleResolveAlert = (alertId) => {
    setSecurityAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "Resolved" } : alert)))
  }

  const handleBanUser = (userId) => {
    setReportedUsers((prev) => prev.map((user) => (user.userId === userId ? { ...user, status: "Suspended" } : user)))
  }

  const handleClearUser = (userId) => {
    setReportedUsers((prev) => prev.map((user) => (user.userId === userId ? { ...user, status: "Cleared" } : user)))
  }

  const alertColumns = [
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity")
        let badgeClass = ""

        switch (severity) {
          case "Critical":
            badgeClass = "bg-red-500"
            break
          case "High":
            badgeClass = "bg-orange-500"
            break
          case "Medium":
            badgeClass = "bg-yellow-500"
            break
          case "Low":
            badgeClass = "bg-blue-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{severity}</Badge>
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "userName",
      header: "User",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const timestamp = new Date(row.getValue("timestamp"))
        return timestamp.toLocaleString()
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Open":
            badgeClass = "bg-red-500"
            break
          case "Investigating":
            badgeClass = "bg-yellow-500"
            break
          case "Resolved":
            badgeClass = "bg-green-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const alert = row.original
        const isResolved = alert.status === "Resolved"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Ban IP">
              <Ban className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Resolve"
              onClick={() => handleResolveAlert(alert.id)}
              disabled={isResolved}
            >
              <CheckCircle className={`h-4 w-4 ${isResolved ? "text-green-500" : ""}`} />
            </Button>
          </div>
        )
      },
    },
  ]

  const reportedUserColumns = [
    {
      accessorKey: "userName",
      header: "Username",
    },
    {
      accessorKey: "reportCount",
      header: "Reports",
      cell: ({ row }) => {
        const count = row.getValue("reportCount")
        return <Badge variant="outline">{count}</Badge>
      },
    },
    {
      accessorKey: "reportReason",
      header: "Reason",
    },
    {
      accessorKey: "lastReportDate",
      header: "Last Report",
    },
    {
      accessorKey: "trustScore",
      header: "Trust Score",
      cell: ({ row }) => {
        const score = row.getValue("trustScore")
        let textClass = ""

        if (score < 30) {
          textClass = "text-red-500"
        } else if (score < 60) {
          textClass = "text-yellow-500"
        } else {
          textClass = "text-green-500"
        }

        return <span className={`font-medium ${textClass}`}>{score}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Under Review":
            badgeClass = "bg-yellow-500"
            break
          case "Suspended":
            badgeClass = "bg-red-500"
            break
          case "Cleared":
            badgeClass = "bg-green-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        const isSuspended = user.status === "Suspended"
        const isCleared = user.status === "Cleared"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Profile">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isSuspended ? "User Suspended" : "Suspend User"}
              onClick={() => handleBanUser(user.userId)}
              disabled={isSuspended}
            >
              <UserX className={`h-4 w-4 ${isSuspended ? "text-red-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isCleared ? "User Cleared" : "Clear User"}
              onClick={() => handleClearUser(user.userId)}
              disabled={isCleared}
            >
              <UserCheck className={`h-4 w-4 ${isCleared ? "text-green-500" : ""}`} />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform security, fraud detection, and user reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityAlerts.filter((a) => a.status !== "Resolved").length}</div>
            <p className="text-xs text-muted-foreground">Open alerts requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportedUsers.filter((u) => u.status === "Under Review").length}</div>
            <p className="text-xs text-muted-foreground">Users under review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">Active IP bans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended Accounts</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportedUsers.filter((u) => u.status === "Suspended").length}</div>
            <p className="text-xs text-muted-foreground">Currently suspended</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">Security Alerts</TabsTrigger>
          <TabsTrigger value="reported">Reported Users</TabsTrigger>
          <TabsTrigger value="ip-bans">IP & Device Bans</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        {/* Security Alerts Tab */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Monitor and respond to security incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Status: {statusFilter === "all" ? "All" : statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Open")}>Open</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Investigating")}>
                        Investigating
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Resolved")}>Resolved</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <DataTable columns={alertColumns} data={filteredAlerts} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Activity Logs</CardTitle>
              <CardDescription>Recent security events and admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityLogs />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Users Tab */}
        <TabsContent value="reported" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reported Users</CardTitle>
              <CardDescription>Users reported for suspicious activity or rule violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <DataTable columns={reportedUserColumns} data={filteredReports} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trust Score Distribution</CardTitle>
                <CardDescription>User trust scores based on platform behavior</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Low Trust (0-30)</span>
                  <Badge variant="outline" className="text-red-500">
                    124 users
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Medium Trust (31-70)</span>
                  <Badge variant="outline" className="text-yellow-500">
                    3,245 users
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">High Trust (71-100)</span>
                  <Badge variant="outline" className="text-green-500">
                    9,089 users
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Reasons</CardTitle>
                <CardDescription>Most common reasons for user reports</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Scam Attempts</span>
                      <span className="text-sm text-muted-foreground">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Fake Listings</span>
                      <span className="text-sm text-muted-foreground">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Prohibited Items</span>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Harassment</span>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Other</span>
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* IP & Device Bans Tab */}
        <TabsContent value="ip-bans" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>IP & Device Ban Management</CardTitle>
              <CardDescription>Manage banned IPs and devices</CardDescription>
            </CardHeader>
            <CardContent>
              <IPBanList />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Ban</CardTitle>
              <CardDescription>Ban an IP address or device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input id="ip-address" placeholder="e.g. 192.168.1.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device-id">Device ID (Optional)</Label>
                  <Input id="device-id" placeholder="Device identifier" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ban-reason">Reason for Ban</Label>
                  <Input id="ban-reason" placeholder="e.g. Multiple fraud attempts" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ban-duration">Ban Duration</Label>
                  <select
                    id="ban-duration"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Ban</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geolocation Restrictions</CardTitle>
              <CardDescription>Restrict access from specific countries or regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>High-risk countries</span>
                  </div>
                  <Switch id="high-risk" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Require additional verification for suspicious locations</span>
                  </div>
                  <Switch id="additional-verification" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Temporary IP blocking for failed login attempts</span>
                  </div>
                  <Switch id="temp-blocking" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Settings</CardTitle>
              <CardDescription>Configure AI-powered fraud detection system</CardDescription>
            </CardHeader>
            <CardContent>
              <FraudDetectionSettings />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Login Security</CardTitle>
                <CardDescription>Configure login security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="max-attempts" className="block mb-1">
                        Maximum login attempts
                      </Label>
                      <p className="text-sm text-muted-foreground">Before temporary lockout</p>
                    </div>
                    <Input id="max-attempts" type="number" defaultValue="5" className="w-20" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lockout-duration" className="block mb-1">
                        Lockout duration (minutes)
                      </Label>
                      <p className="text-sm text-muted-foreground">After exceeding max attempts</p>
                    </div>
                    <Input id="lockout-duration" type="number" defaultValue="30" className="w-20" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Require 2FA for admin accounts</span>
                    </div>
                    <Switch id="require-2fa" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Save Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Configure automated content moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span>AI content screening</span>
                    </div>
                    <Switch id="ai-screening" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sensitivity" className="block mb-1">
                        AI sensitivity level
                      </Label>
                      <p className="text-sm text-muted-foreground">Higher = more strict</p>
                    </div>
                    <select
                      id="sensitivity"
                      className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium" selected>
                        Medium
                      </option>
                      <option value="high">High</option>
                      <option value="very-high">Very High</option>
                    </select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Auto-flag suspicious listings</span>
                    </div>
                    <Switch id="auto-flag" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Save Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

