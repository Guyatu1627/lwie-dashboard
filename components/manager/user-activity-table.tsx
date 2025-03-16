"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  ExternalLink,
  UserCheck,
  UserX,
  Mail,
  Flag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Shield,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

// Initial user data
const initialUsers = [
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
  },
]

interface UserActivityTableProps {
  searchQuery?: string
  userType?: string
  filters?: {
    hasListings?: boolean
    hasSwaps?: boolean
    isVerified?: boolean
    joinedRecently?: boolean
    highActivity?: boolean
  }
}

export function UserActivityTable({ searchQuery = "", userType = "all", filters = {} }: UserActivityTableProps) {
  const [userList, setUserList] = useState(initialUsers)
  const [sortField, setSortField] = useState("actions")
  const [sortDirection, setSortDirection] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update a user's status or activity
      setUserList((prev) => {
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
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Filter users based on search query, user type, and filters
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
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
        if (userType === "new" && new Date(user.joinDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          return false
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
  }, [userList, searchQuery, userType, filters])

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortField === "name" || sortField === "email" || sortField === "lastActive" || sortField === "sessionTime") {
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField])
      } else {
        return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
      }
    })
  }, [filteredUsers, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, userType, filters])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleAction = (action, userId) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Update UI based on action
      if (action === "Suspend") {
        setUserList((prev) =>
          prev.map((user) => (user.id === userId ? { ...user, status: "offline", lastActive: "Suspended" } : user)),
        )
      } else if (action === "Verify") {
        setUserList((prev) => prev.map((user) => (user.id === userId ? { ...user, isVerified: true } : user)))
      }

      toast({
        title: `${action} action completed`,
        description: `Successfully performed ${action.toLowerCase()} action on user ID: ${userId}`,
      })
    }, 1000)
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  return (
    <div className="space-y-4">
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
                        user.status === "online" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
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
                        <DropdownMenuItem onClick={() => handleAction("View profile for", user.id)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Contact", user.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact User
                        </DropdownMenuItem>
                        {!user.isVerified && (
                          <DropdownMenuItem onClick={() => handleAction("Verify", user.id)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Verify User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction("Flag", user.id)} className="text-amber-600">
                          <Flag className="mr-2 h-4 w-4" />
                          Flag Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Suspend", user.id)} className="text-red-600">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
    </div>
  )
}

