"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "ad_request" | "message" | "system" | "payment"
  title: string
  description: string
  time: string
  read: boolean
  actionUrl?: string
  relatedId?: string
}

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Load notifications
  useEffect(() => {
    // Simulate API call
    const mockNotifications: Notification[] = [
      {
        id: "notif-001",
        type: "ad_request",
        title: "New Advertisement Request",
        description: "TechGadgets Inc. submitted a new advertisement request",
        time: "10 minutes ago",
        read: false,
        actionUrl: "/manager/ad-requests",
        relatedId: "ad-001",
      },
      {
        id: "notif-002",
        type: "message",
        title: "New Message",
        description: "GreenEats sent you a message about their advertisement",
        time: "30 minutes ago",
        read: false,
        actionUrl: "/manager/messages",
        relatedId: "adv-004",
      },
      {
        id: "notif-003",
        type: "payment",
        title: "Payment Received",
        description: "Payment of $350 received for premium listing",
        time: "1 hour ago",
        read: false,
        actionUrl: "/manager/payments",
      },
      {
        id: "notif-004",
        type: "ad_request",
        title: "Advertisement Approved",
        description: "You approved FitLife Pro's advertisement request",
        time: "2 hours ago",
        read: true,
        actionUrl: "/manager/advertisements",
      },
      {
        id: "notif-005",
        type: "system",
        title: "System Update",
        description: "The platform will undergo maintenance tonight at 2 AM",
        time: "3 hours ago",
        read: true,
      },
      {
        id: "notif-006",
        type: "message",
        title: "New Message",
        description: "ArtisanCrafts sent you a message",
        time: "5 hours ago",
        read: true,
        actionUrl: "/manager/messages",
        relatedId: "adv-008",
      },
      {
        id: "notif-007",
        type: "payment",
        title: "Payment Failed",
        description: "Payment for advertisement ID #A12345 failed",
        time: "Yesterday",
        read: true,
        actionUrl: "/manager/payments",
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  // Add real-time notification (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of new notification every 30 seconds
      if (Math.random() < 0.1) {
        const types = ["ad_request", "message", "payment", "system"] as const
        const type = types[Math.floor(Math.random() * types.length)]

        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type,
          title:
            type === "ad_request"
              ? "New Advertisement Request"
              : type === "message"
                ? "New Message"
                : type === "payment"
                  ? "Payment Received"
                  : "System Notification",
          description:
            type === "ad_request"
              ? "A new advertisement request needs your review"
              : type === "message"
                ? "You received a new message from an advertiser"
                : type === "payment"
                  ? "A new payment has been processed"
                  : "System update notification",
          time: "Just now",
          read: false,
          actionUrl:
            type === "ad_request"
              ? "/manager/ad-requests"
              : type === "message"
                ? "/manager/messages"
                : type === "payment"
                  ? "/manager/payments"
                  : undefined,
        }

        setNotifications((prev) => [newNotification, ...prev])
        setUnreadCount((prev) => prev + 1)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))

    // Update unread count
    if (!notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      setIsOpen(false)

      // Add related ID as query parameter if available
      const url = notification.relatedId
        ? `${notification.actionUrl}?id=${notification.relatedId}`
        : notification.actionUrl

      router.push(url)
    }
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "ad_request":
        return <div className="w-2 h-2 rounded-full bg-amber-500" />
      case "message":
        return <div className="w-2 h-2 rounded-full bg-blue-500" />
      case "payment":
        return <div className="w-2 h-2 rounded-full bg-green-500" />
      case "system":
        return <div className="w-2 h-2 rounded-full bg-purple-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-xs bg-red-500 hover:bg-red-600">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h4 className="font-medium">Notifications</h4>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "No new notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5 h-10 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
            </TabsTrigger>
            <TabsTrigger value="ad_request" className="text-xs">
              Ads
            </TabsTrigger>
            <TabsTrigger value="message" className="text-xs">
              Messages
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs">
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="p-0">
            <ScrollArea className="max-h-[300px]">
              {filteredNotifications.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">No notifications found</div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-muted/30",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>

            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <a href="/manager/notifications">View all notifications</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

