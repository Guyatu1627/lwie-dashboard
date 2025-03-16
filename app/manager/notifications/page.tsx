"use client"

import { cn } from "@/lib/utils"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  Bell,
  MoreHorizontal,
  Plus,
  Trash,
  SendHorizontal,
  X,
  RefreshCw,
  MessageSquare,
  Save,
  Calendar,
} from "lucide-react"

// Mock notification data
const mockNotifications = [
  {
    id: "n1",
    title: "System Maintenance",
    message: "The platform will undergo scheduled maintenance on Saturday at 2 AM UTC. Expected downtime is 2 hours.",
    type: "system",
    priority: "high",
    status: "scheduled",
    audience: "all_users",
    createdAt: "2024-01-25T10:00:00Z",
    scheduledFor: "2024-01-27T02:00:00Z",
    sentBy: "System Admin",
  },
  {
    id: "n2",
    title: "New Feature Release",
    message: "We've just released our new swap matching algorithm! Find better matches faster.",
    type: "feature",
    priority: "medium",
    status: "sent",
    audience: "all_users",
    createdAt: "2024-01-20T14:30:00Z",
    sentAt: "2024-01-20T15:00:00Z",
    sentBy: "Product Team",
  },
  {
    id: "n3",
    title: "Premium Subscription Offer",
    message: "For a limited time, get 20% off our Premium tier subscription. Upgrade now!",
    type: "promotion",
    priority: "medium",
    status: "sent",
    audience: "standard_users",
    createdAt: "2024-01-18T09:15:00Z",
    sentAt: "2024-01-18T10:00:00Z",
    sentBy: "Marketing Team",
  },
  {
    id: "n4",
    title: "Account Verification Reminder",
    message: "Please verify your account to unlock all platform features. Check your email for instructions.",
    type: "account",
    priority: "high",
    status: "draft",
    audience: "unverified_users",
    createdAt: "2024-01-26T11:20:00Z",
    sentBy: "User Support",
  },
  {
    id: "n5",
    title: "Community Guidelines Update",
    message: "We've updated our community guidelines to better protect our users. Please review the changes.",
    type: "policy",
    priority: "high",
    status: "scheduled",
    audience: "all_users",
    createdAt: "2024-01-24T16:45:00Z",
    scheduledFor: "2024-01-29T09:00:00Z",
    sentBy: "Trust & Safety Team",
  },
  {
    id: "n6",
    title: "Holiday Schedule",
    message: "Our support team will have limited availability during the upcoming holiday season. See details inside.",
    type: "system",
    priority: "medium",
    status: "draft",
    audience: "all_users",
    createdAt: "2024-01-26T13:10:00Z",
    sentBy: "Operations Team",
  },
  {
    id: "n7",
    title: "New Category Added",
    message: "We've added a new 'Outdoor Equipment' category to the marketplace. Check it out!",
    type: "feature",
    priority: "low",
    status: "sent",
    audience: "active_users",
    createdAt: "2024-01-15T11:30:00Z",
    sentAt: "2024-01-15T12:00:00Z",
    sentBy: "Product Team",
  },
]

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [isCreatingNotification, setIsCreatingNotification] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "system",
    priority: "medium",
    status: "draft",
    audience: "all_users",
  })

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter notifications based on search and tab
  const filteredNotifications = notifications.filter((notification) => {
    // Search query filter
    if (
      searchQuery &&
      !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Tab filter
    if (currentTab === "drafts" && notification.status !== "draft") return false
    if (currentTab === "scheduled" && notification.status !== "scheduled") return false
    if (currentTab === "sent" && notification.status !== "sent") return false

    return true
  })

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    setTimeout(() => {
      // Just refresh timestamps for this demo
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          createdAt: notification.status === "draft" ? new Date().toISOString() : notification.createdAt,
        })),
      )

      setIsRefreshing(false)
      toast({
        title: "Notifications refreshed",
        description: "Notification data has been updated",
      })
    }, 1000)
  }

  // Handle notification operation
  const handleNotificationOperation = (operation, notificationId) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === notificationId)

    if (!notification) return

    // Simulate API call
    toast({
      title: `${operation} notification`,
      description: `${operation} operation started for "${notification.title}"`,
    })

    // Update UI based on operation
    setTimeout(() => {
      if (operation === "View") {
        setSelectedNotification(notification)
        setIsNotificationDialogOpen(true)
      } else if (operation === "Send") {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, status: "sent", sentAt: new Date().toISOString() } : n)),
        )
        toast({
          title: "Notification sent",
          description: `"${notification.title}" has been sent to users`,
        })
      } else if (operation === "Schedule") {
        // This would open a scheduling dialog in a real app
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, status: "scheduled", scheduledFor: new Date(Date.now() + 86400000).toISOString() }
              : n,
          ),
        )
        toast({
          title: "Notification scheduled",
          description: `"${notification.title}" has been scheduled for delivery`,
        })
      } else if (operation === "Delete") {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        toast({
          title: "Notification deleted",
          description: `"${notification.title}" has been deleted`,
        })
      }
    }, 500)
  }

  // Handle create notification
  const handleCreateNotification = () => {
    // Validate fields
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Missing information",
        description: "Please provide both title and message for the notification",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    toast({
      title: "Creating notification",
      description: "Processing your notification...",
    })

    setTimeout(() => {
      // Create new notification
      const createdNotification = {
        id: `n${notifications.length + 1}`,
        ...newNotification,
        createdAt: new Date().toISOString(),
        sentBy: "Manager",
      }

      setNotifications((prev) => [createdNotification, ...prev])

      // Reset form
      setNewNotification({
        title: "",
        message: "",
        type: "system",
        priority: "medium",
        status: "draft",
        audience: "all_users",
      })

      setIsCreatingNotification(false)

      toast({
        title: "Notification created",
        description: "New notification has been saved as a draft",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Management</h1>
          <p className="text-muted-foreground">Create and send notifications to platform users</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          <Button onClick={() => setIsCreatingNotification(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Notification
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {currentTab === "all" && "All system notifications"}
                {currentTab === "drafts" && "Draft notifications ready to send"}
                {currentTab === "scheduled" && "Notifications scheduled for future delivery"}
                {currentTab === "sent" && "Notifications that have been sent to users"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-[250px]" />
                            <Skeleton className="h-4 w-[350px]" />
                            <div className="flex gap-2 mt-2">
                              <Skeleton className="h-6 w-16 rounded-full" />
                              <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center border rounded-lg p-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications found</h3>
                  <p className="text-muted-foreground text-center mt-1 mb-4">
                    No notifications match your current search and filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setCurrentTab("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge
                                className={
                                  notification.type === "system"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : notification.type === "feature"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : notification.type === "promotion"
                                        ? "bg-purple-500 hover:bg-purple-600"
                                        : notification.type === "account"
                                          ? "bg-orange-500 hover:bg-orange-600"
                                          : "bg-gray-500 hover:bg-gray-600"
                                }
                              >
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </Badge>
                              <Badge
                                className={
                                  notification.priority === "high"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : notification.priority === "medium"
                                      ? "bg-amber-500 hover:bg-amber-600"
                                      : "bg-green-500 hover:bg-green-600"
                                }
                              >
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}{" "}
                                Priority
                              </Badge>
                              <Badge
                                className={
                                  notification.status === "draft"
                                    ? "bg-gray-500 hover:bg-gray-600"
                                    : notification.status === "scheduled"
                                      ? "bg-amber-500 hover:bg-amber-600"
                                      : "bg-green-500 hover:bg-green-600"
                                }
                              >
                                {notification.status === "draft"
                                  ? "Draft"
                                  : notification.status === "scheduled"
                                    ? "Scheduled"
                                    : "Sent"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                              <span>
                                {notification.status === "draft"
                                  ? "Created"
                                  : notification.status === "scheduled"
                                    ? "Scheduled for"
                                    : "Sent"}
                                :{" "}
                                {notification.status === "draft"
                                  ? new Date(notification.createdAt).toLocaleString()
                                  : notification.status === "scheduled"
                                    ? new Date(notification.scheduledFor).toLocaleString()
                                    : new Date(notification.sentAt).toLocaleString()}
                              </span>
                              <span>•</span>
                              <span>By: {notification.sentBy}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleNotificationOperation("View", notification.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {notification.status === "draft" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleNotificationOperation("Send", notification.id)}
                                  >
                                    <SendHorizontal className="mr-2 h-4 w-4" />
                                    Send Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleNotificationOperation("Schedule", notification.id)}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleNotificationOperation("Delete", notification.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Notification Dialog */}
      <Dialog open={isCreatingNotification} onOpenChange={setIsCreatingNotification}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
            <DialogDescription>Create a notification to send to platform users</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear, concise title"
                value={newNotification.title}
                onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter the notification message"
                className="min-h-[100px]"
                value={newNotification.message}
                onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newNotification.priority}
                  onValueChange={(value) => setNewNotification((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={newNotification.audience}
                  onValueChange={(value) => setNewNotification((prev) => ({ ...prev, audience: value }))}
                >
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All Users</SelectItem>
                    <SelectItem value="active_users">Active Users</SelectItem>
                    <SelectItem value="standard_users">Standard Users</SelectItem>
                    <SelectItem value="premium_users">Premium Users</SelectItem>
                    <SelectItem value="unverified_users">Unverified Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingNotification(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCreateNotification}>
              <Save className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Details Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>View detailed information about this notification</DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    className={
                      selectedNotification.type === "system"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : selectedNotification.type === "feature"
                          ? "bg-green-500 hover:bg-green-600"
                          : selectedNotification.type === "promotion"
                            ? "bg-purple-500 hover:bg-purple-600"
                            : selectedNotification.type === "account"
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                  </Badge>
                  <Badge
                    className={
                      selectedNotification.priority === "high"
                        ? "bg-red-500 hover:bg-red-600"
                        : selectedNotification.priority === "medium"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-500 hover:bg-green-600"
                    }
                  >
                    {selectedNotification.priority.charAt(0).toUpperCase() + selectedNotification.priority.slice(1)}{" "}
                    Priority
                  </Badge>
                  <Badge
                    className={
                      selectedNotification.status === "draft"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : selectedNotification.status === "scheduled"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-500 hover:bg-green-600"
                    }
                  >
                    {selectedNotification.status === "draft"
                      ? "Draft"
                      : selectedNotification.status === "scheduled"
                        ? "Scheduled"
                        : "Sent"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <p className="whitespace-pre-line">{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Target Audience</h4>
                  <p className="capitalize">{selectedNotification.audience.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                  <p>{selectedNotification.sentBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                  <p>{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                </div>
                {selectedNotification.status === "scheduled" && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Scheduled For</h4>
                    <p>{new Date(selectedNotification.scheduledFor).toLocaleString()}</p>
                  </div>
                )}
                {selectedNotification.status === "sent" && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Sent At</h4>
                    <p>{new Date(selectedNotification.sentAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            {selectedNotification && selectedNotification.status === "draft" && (
              <Button
                onClick={() => {
                  handleNotificationOperation("Send", selectedNotification.id)
                  setIsNotificationDialogOpen(false)
                }}
              >
                <SendHorizontal className="mr-2 h-4 w-4" />
                Send Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

