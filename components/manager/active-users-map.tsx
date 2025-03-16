"use client"

import { useState, useEffect } from "react"
import { MapChart } from "@/components/analytics/map-chart"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function ActiveUsersMap() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRegions, setActiveRegions] = useState([
    { name: "North America", users: 1245, change: "+12%" },
    { name: "Europe", users: 982, change: "+8%" },
    { name: "Asia", users: 754, change: "+15%" },
    { name: "South America", users: 421, change: "+5%" },
    { name: "Africa", users: 287, change: "+18%" },
    { name: "Oceania", users: 164, change: "+7%" },
  ])

  useEffect(() => {
    setMounted(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveRegions((prev) =>
        prev.map((region) => ({
          ...region,
          users: region.users + Math.floor(Math.random() * 10) - 3,
          change: `+${Math.floor(Math.random() * 20) + 1}%`,
        })),
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return <div className="h-[500px] flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      <div className="lg:col-span-3 h-[400px] lg:h-full">
        {isLoading ? <Skeleton className="h-full w-full rounded-lg" /> : <MapChart />}
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Regions</h3>
        <div className="space-y-2">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-[72px] w-full rounded-lg" />)
            : activeRegions.map((region) => (
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
  )
}

