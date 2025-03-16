"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, RefreshCw, ShieldCheck, Flag, Eye, MessageSquare } from "lucide-react"

export function UserActivityLog({ userId }) {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user activities
    const fetchActivities = () => {
      setIsLoading(true)

      // Mock data
      const mockActivities = [
        {
          id: 1,
          type: "item_posted",
          description: "Posted a new item: MacBook Pro 16-inch",
          timestamp: "2024-01-14T15:30:00Z",
          icon: Package,
        },
        {
          id: 2,
          type: "swap_completed",
          description: "Completed swap with user jane_smith",
          timestamp: "2024-01-12T10:45:00Z",
          icon: RefreshCw,
        },
        {
          id: 3,
          type: "verification",
          description: "Completed identity verification",
          timestamp: "2024-01-10T14:20:00Z",
          icon: ShieldCheck,
        },
        {
          id: 4,
          type: "report",
          description: "Reported item: Fake Designer Handbag",
          timestamp: "2024-01-08T09:15:00Z",
          icon: Flag,
        },
        {
          id: 5,
          type: "view",
          description: "Viewed 15 items in Electronics category",
          timestamp: "2024-01-07T16:30:00Z",
          icon: Eye,
        },
        {
          id: 6,
          type: "message",
          description: "Sent 5 messages to user charlie_wilson",
          timestamp: "2024-01-05T11:20:00Z",
          icon: MessageSquare,
        },
      ]

      setActivities(mockActivities)
      setIsLoading(false)
    }

    fetchActivities()
  }, [userId])

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading activity log...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Activity Log</h3>
        <Badge variant="outline">{activities.length} activities</Badge>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id}>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <activity.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

