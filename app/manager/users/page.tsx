"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Mail,
  UserCheck,
  Shield,
  Unlock,
  TrashIcon,
  Edit,
  Eye,
  Save,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from "lucide-react"

// Mock user data for demonstration purposes
const mockUsers = [
  {
    id: "u1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "User",
    status: "Active",
    verified: true,
    registrationDate: "2023-01-15",
    lastActive: "Today",
    listings: 12,
    swaps: 8,
    trustScore: 95,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u2",
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    role: "User",
    status: "Active",
    verified: true,
    registrationDate: "2023-02-10",
    lastActive: "Yesterday",
    listings: 8,
    swaps: 5,
    trustScore: 88,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Moderator",
    status: "Active",
    verified: true,
    registrationDate: "2022-11-20",
    lastActive: "2 days ago",
    listings: 15,
    swaps: 12,
    trustScore: 90,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u4",
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    role: "User",
    status: "Inactive",
    verified: false,
    registrationDate: "2023-03-05",
    lastActive: "1 month ago",
    listings: 2,
    swaps: 0,
    trustScore: 60,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u5",
    name: "William Lee",
    email: "william.lee@example.com",
    role: "User",
    status: "Suspended",
    verified: true,
    registrationDate: "2022-12-18",
    lastActive: "3 months ago",
    listings: 5,
    swaps: 3,
    trustScore: 72,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u6",
    name: "Olivia Wilson",
    email: "olivia.wilson@example.com",
    role: "Premium",
    status: "Active",
    verified: true,
    registrationDate: "2023-01-28",
    lastActive: "Today",
    listings: 20,
    swaps: 15,
    trustScore: 98,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u7",
    name: "James Taylor",
    email: "james.taylor@example.com",
    role: "User",
    status: "Active",
    verified: true,
    registrationDate: "2023-02-15",
    lastActive: "Yesterday",
    listings: 7,
    swaps: 4,
    trustScore: 85,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u8",
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    role: "User",
    status: "Pending",
    verified: false,
    registrationDate: "2023-03-20",
    lastActive: "1 week ago",
    listings: 0,
    swaps: 0,
    trustScore: 50,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u9",
    name: "Ethan Anderson",
    email: "ethan.anderson@example.com",
    role: "User",
    status: "Active",
    verified: true,
    registrationDate: "2022-10-12",
    lastActive: "3 days ago",
    listings: 10,
    swaps: 7,
    trustScore: 92,
    avatar: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "u10",
    name: "Charlotte Thompson",
    email: "charlotte.thompson@example.com",
    role: "Premium",
    status: "Active",
    verified: true,
    registrationDate: "2022-09-05",
    lastActive: "Today",
    listings: 25,
    swaps: 18,
    trustScore: 96,
    avatar: "/placeholder.svg?height=128&width=128",
  },
]

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userRole, setUserRole] = useState("all")
  const [userStatus, setUserStatus] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortField, setSortField] = useState("registrationDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState(null)

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    // Search query filter
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Role filter
    if (userRole !== "all" && user.role.toLowerCase() !== userRole.toLowerCase()) {
      return false
    }

    // Status filter
    if (userStatus !== "all" && user.status.toLowerCase() !== userStatus.toLowerCase()) {
      return false
    }

    // Tab filter
    if (currentTab === "verified" && !user.verified) return false
    if (currentTab === "unverified" && user.verified) return false
    if (currentTab === "premium" && user.role !== "Premium") return false
    if (currentTab === "suspended" && user.status !== "Suspended") return false

    return true
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA = a[sortField]
    let valueB = b[sortField]

    // Convert date strings to Date objects for proper comparison
    if (sortField === "registrationDate" || sortField === "lastActive") {
      if (sortField === "lastActive") {
        // For "lastActive" field with relative time strings like "Today", "Yesterday", etc.
        const timeValueMap = {
          Today: new Date(),
          Yesterday: new Date(Date.now() - 86400000),
          "week ago": new Date(Date.now() - 7 * 86400000),
          "month ago": new Date(Date.now() - 30 * 86400000),
          "months ago": new Date(Date.now() - 90 * 86400000),
          "days ago": new Date(Date.now() - 2 * 86400000),
        }

        // Try to match relative time strings
        for (const [key, value] of Object.entries(timeValueMap)) {
          if (a.lastActive.includes(key)) valueA = value
          if (b.lastActive.includes(key)) valueB = value
        }
      } else {
        // For actual date strings
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }
    }

    // Perform comparison based on sort direction
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Get sort indicator
  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  // Handle bulk selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId])
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action) => {
    // Simulate API call
    toast({
      title: `Bulk ${action}`,
      description: `${action} applied to ${selectedUsers.length} users`,
    })

    // Update UI based on action
    if (action === "Verify") {
      setUsers((prev) => prev.map((user) => (selectedUsers.includes(user.id) ? { ...user, verified: true } : user)))
    } else if (action === "Activate") {
      setUsers((prev) => prev.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "Active" } : user)))
    } else if (action === "Delete") {
      setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
    }

    // Clear selection
    setSelectedUsers([])
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      // Refresh data by adding a new user and modifying existing ones randomly
      setUsers((prev) => {
        const updated = [...prev]

        // Randomly update some users
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length)
          updated[randomIndex] = {
            ...updated[randomIndex],
            lastActive: "Just now",
            trustScore: Math.min(100, updated[randomIndex].trustScore + Math.floor(Math.random() * 5)),
          }
        }

        return updated
      })

      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "User data has been updated",
      })
    }, 1500)
  }

  // Handle user operation
  const handleUserOperation = (operation, userId) => {
    // Find the user
    const user = users.find((u) => u.id === userId)

    if (!user) return

    // Simulate API call
    toast({
      title: `${operation} user`,
      description: `${operation} operation started for ${user.name}`,
    })

    // Update UI based on operation
    setTimeout(() => {
      if (operation === "View") {
        setSelectedUser(user)
        setIsUserDialogOpen(true)
      } else if (operation === "Edit") {
        setSelectedUser(user)
        setEditedUser({ ...user })
        setIsEditMode(true)
        setIsUserDialogOpen(true)
      } else if (operation === "Verify") {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: true } : u)))
        toast({
          title: "User verified",
          description: `${user.name} has been verified`,
        })
      } else if (operation === "Activate") {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "Active" } : u)))
        toast({
          title: "User activated",
          description: `${user.name} has been activated`,
        })
      } else if (operation === "Delete") {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        toast({
          title: "User deleted",
          description: `${user.name} has been deleted`,
        })
      }
    }, 500)
  }

  // Handle user save
  const handleSaveUser = () => {
    if (!editedUser) return

    // Simulate API call
    toast({
      title: "Saving changes",
      description: "Updating user information...",
    })

    setTimeout(() => {
      setUsers((prev) => prev.map((u) => (u.id === editedUser.id ? editedUser : u)))

      setIsUserDialogOpen(false)
      setIsEditMode(false)
      setEditedUser(null)

      toast({
        title: "User updated",
        description: "User information has been updated successfully",
      })
    }, 1000)
  }

  // Handle edited user field change
  const handleEditedUserChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage and oversee all platform users</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
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

          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Standard Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
            </SelectContent>
          </Select>

          <Select value={userStatus} onValueChange={setUserStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedUsers.length})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkAction("Verify")}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Verify Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Activate")}>
                  <Unlock className="mr-2 h-4 w-4" />
                  Activate Selected
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete {selectedUsers.length} users and remove all their associated
                        data from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBulkAction("Delete")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Users
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
                <Button variant="ghost" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
              <CardDescription>
                {currentTab === "all" && "All registered users"}
                {currentTab === "verified" && "Users who have completed verification"}
                {currentTab === "unverified" && "Users who have not completed verification"}
                {currentTab === "premium" && "Users with premium subscription"}
                {currentTab === "suspended" && "Users who have been suspended"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[200px]" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                        User {getSortIcon("name")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                        Role {getSortIcon("role")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {getSortIcon("status")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("verified")} style={{ cursor: "pointer" }}>
                        Verified {getSortIcon("verified")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("registrationDate")} style={{ cursor: "pointer" }}>
                        Registration Date {getSortIcon("registrationDate")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("lastActive")} style={{ cursor: "pointer" }}>
                        Last Active {getSortIcon("lastActive")}
                      </TableHead>
                      <TableHead onClick={() => handleSort("trustScore")} style={{ cursor: "pointer" }}>
                        Trust Score {getSortIcon("trustScore")}
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(itemsPerPage)
                        .fill(0)
                        .map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-4" />
                            </TableCell>
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
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No users found matching the current filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="group transition-colors hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="border border-border">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                  {user.name.split(" ")[1]?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "Premium"
                                  ? "default"
                                  : user.role === "Moderator"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "Active"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : user.status === "Suspended"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : user.status === "Pending"
                                      ? "bg-orange-500 hover:bg-orange-600"
                                      : "bg-gray-500 hover:bg-gray-600"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.verified ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge className="bg-blue-500 hover:bg-blue-600">
                                      <Shield className="mr-1 h-3 w-3" />
                                      Verified
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>User identity has been verified</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <Badge variant="outline">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  user.trustScore >= 90
                                    ? "text-green-600"
                                    : user.trustScore >= 70
                                      ? "text-blue-600"
                                      : user.trustScore >= 50
                                        ? "text-amber-600"
                                        : "text-red-600"
                                }
                              >
                                {user.trustScore}%
                              </span>
                              <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className={
                                    user.trustScore >= 90
                                      ? "bg-green-500"
                                      : user.trustScore >= 70
                                        ? "bg-blue-500"
                                        : user.trustScore >= 50
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                  }
                                  style={{ width: `${user.trustScore}%`, height: "100%" }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
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
                                <DropdownMenuItem onClick={() => handleUserOperation("View", user.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserOperation("Edit", user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserOperation("Contact", user.id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Contact User
                                </DropdownMenuItem>
                                {!user.verified && (
                                  <DropdownMenuItem onClick={() => handleUserOperation("Verify", user.id)}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Verify User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleUserOperation("Activate", user.id)}
                                  className="text-green-600"
                                >
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                      <TrashIcon className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action will permanently delete {user.name}'s account and remove all their
                                        data from the system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUserOperation("Delete", user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "User Details"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modify user details and save changes" : "View detailed information about this user"}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              {isEditMode ? (
                // Edit mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editedUser.name}
                      onChange={(e) => handleEditedUserChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      value={editedUser.email}
                      onChange={(e) => handleEditedUserChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={editedUser.role} onValueChange={(value) => handleEditedUserChange("role", value)}>
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editedUser.status}
                      onValueChange={(value) => handleEditedUserChange("status", value)}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-verified"
                      checked={editedUser.verified}
                      onCheckedChange={(checked) => handleEditedUserChange("verified", checked)}
                    />
                    <Label htmlFor="edit-verified">Verified User</Label>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="text-lg">
                        {selectedUser.name.charAt(0)}
                        {selectedUser.name.split(" ")[1]?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-muted-foreground">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            selectedUser.role === "Premium"
                              ? "default"
                              : selectedUser.role === "Moderator"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {selectedUser.role}
                        </Badge>
                        <Badge
                          className={
                            selectedUser.status === "Active"
                              ? "bg-green-500 hover:bg-green-600"
                              : selectedUser.status === "Suspended"
                                ? "bg-red-500 hover:bg-red-600"
                                : selectedUser.status === "Pending"
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                          }
                        >
                          {selectedUser.status}
                        </Badge>
                        {selectedUser.verified && (
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            <Shield className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Registration Date</h4>
                      <p>{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Last Active</h4>
                      <p>{selectedUser.lastActive}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Listings</h4>
                      <p>{selectedUser.listings}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Swaps</h4>
                      <p>{selectedUser.swaps}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Trust Score</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            selectedUser.trustScore >= 90
                              ? "text-green-600"
                              : selectedUser.trustScore >= 70
                                ? "text-blue-600"
                                : selectedUser.trustScore >= 50
                                  ? "text-amber-600"
                                  : "text-red-600"
                          }
                        >
                          {selectedUser.trustScore}%
                        </span>
                        <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={
                              selectedUser.trustScore >= 90
                                ? "bg-green-500"
                                : selectedUser.trustScore >= 70
                                  ? "bg-blue-500"
                                  : selectedUser.trustScore >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                            }
                            style={{ width: `${selectedUser.trustScore}%`, height: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Recent Activity</h4>
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                      <p>No recent activity to display</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false)
                    setEditedUser(null)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditedUser({ ...selectedUser })
                    setIsEditMode(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

