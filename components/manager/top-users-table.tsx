"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const topUsers = [
  {
    id: "u4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    engagementScore: 98,
    totalSwaps: 42,
    totalListings: 67,
    memberSince: "Jan 2023",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "Power User",
    isVerified: true,
  },
  {
    id: "u2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    engagementScore: 92,
    totalSwaps: 38,
    totalListings: 54,
    memberSince: "Mar 2023",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "Top Trader",
    isVerified: true,
  },
  {
    id: "u8",
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    engagementScore: 87,
    totalSwaps: 31,
    totalListings: 48,
    memberSince: "Feb 2023",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "Active",
    isVerified: false,
  },
  {
    id: "u12",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@example.com",
    engagementScore: 85,
    totalSwaps: 29,
    totalListings: 42,
    memberSince: "Apr 2023",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "Active",
    isVerified: true,
  },
  {
    id: "u7",
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    engagementScore: 82,
    totalSwaps: 27,
    totalListings: 39,
    memberSince: "May 2023",
    avatar: "/placeholder.svg?height=40&width=40",
    badge: "Active",
    isVerified: true,
  },
]

export function TopUsersTable() {
  const [sortField, setSortField] = useState("engagementScore")
  const [sortDirection, setSortDirection] = useState("desc")

  // Sort users
  const sortedUsers = [...topUsers].sort((a, b) => {
    if (sortField === "name" || sortField === "email" || sortField === "memberSince" || sortField === "badge") {
      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField])
    } else {
      return sortDirection === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const handleViewProfile = (userId) => {
    toast({
      title: "Profile viewed",
      description: `Viewing detailed profile for user ID: ${userId}`,
    })
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Power User":
        return "bg-purple-500 hover:bg-purple-600"
      case "Top Trader":
        return "bg-amber-500 hover:bg-amber-600"
      case "Active":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              User {getSortIcon("name")}
            </TableHead>
            <TableHead onClick={() => handleSort("engagementScore")} style={{ cursor: "pointer" }}>
              Engagement {getSortIcon("engagementScore")}
            </TableHead>
            <TableHead onClick={() => handleSort("totalSwaps")} style={{ cursor: "pointer" }}>
              Swaps {getSortIcon("totalSwaps")}
            </TableHead>
            <TableHead onClick={() => handleSort("totalListings")} style={{ cursor: "pointer" }}>
              Listings {getSortIcon("totalListings")}
            </TableHead>
            <TableHead onClick={() => handleSort("badge")} style={{ cursor: "pointer" }}>
              Status {getSortIcon("badge")}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
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
                    <div className="font-medium flex items-center gap-1">
                      {user.name}
                      {user.engagementScore > 90 && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    </div>
                    <div className="text-xs text-muted-foreground">Since {user.memberSince}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{user.engagementScore}%</span>
                  </div>
                  <Progress value={user.engagementScore} className="h-2" />
                </div>
              </TableCell>
              <TableCell>{user.totalSwaps}</TableCell>
              <TableCell>{user.totalListings}</TableCell>
              <TableCell>
                <Badge className={getBadgeColor(user.badge)}>{user.badge}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleViewProfile(user.id)}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:inline-block">View</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

