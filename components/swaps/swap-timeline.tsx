"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MessageSquare, Package } from "lucide-react"

export function SwapTimeline({ swapId }) {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch swap timeline events
    const fetchEvents = () => {
      setIsLoading(true)

      // Mock data
      const mockEvents = [
        {
          id: 1,
          type: "swap_initiated",
          description: "Swap initiated between john_doe and jane_smith",
          timestamp: "2024-01-10T10:00:00Z",
          icon: Package,
        },
        {
          id: 2,
          type: "message",
          description: "5 messages exchanged between participants",
          timestamp: "2024-01-11T14:30:00Z",
          icon: MessageSquare,
        },
        {
          id: 3,
          type: "status_update",
          description: "Swap status updated to In Progress",
          timestamp: "2024-01-12T09:15:00Z",
          icon: Clock,
        },
        {
          id: 4,
          type: "message",
          description: "3 more messages exchanged between participants",
          timestamp: "2024-01-13T16:45:00Z",
          icon: MessageSquare,
        },
        {
          id: 5,
          type: "swap_completed",
          description: "Swap completed successfully",
          timestamp: "2024-01-14T11:20:00Z",
          icon: CheckCircle,
        },
      ]

      setEvents(mockEvents)
      setIsLoading(false)
    }

    fetchEvents()
  }, [swapId])

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading timeline...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Swap Timeline</h3>
        <Badge variant="outline">{events.length} events</Badge>
      </div>

      <div className="relative pl-6 space-y-0">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-2.5 w-px bg-border" />

        {events.map((event, index) => (
          <div key={event.id} className="relative pb-6">
            {/* Timeline dot */}
            <div className="absolute left-[-24px] p-1 rounded-full bg-background border">
              <event.icon className="h-4 w-4 text-primary" />
            </div>

            <div>
              <p className="font-medium">{event.description}</p>
              <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

