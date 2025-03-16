"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const generateData = () => {
  const baseData = [
    { date: "Jan 01", activeUsers: 1200, sessionTime: 7.2, pageViews: 5800, interactions: 3200 },
    { date: "Jan 05", activeUsers: 1800, sessionTime: 7.5, pageViews: 7200, interactions: 4100 },
    { date: "Jan 10", activeUsers: 1600, sessionTime: 7.8, pageViews: 6800, interactions: 3800 },
    { date: "Jan 15", activeUsers: 2200, sessionTime: 8.0, pageViews: 9500, interactions: 5200 },
    { date: "Jan 20", activeUsers: 2400, sessionTime: 8.2, pageViews: 10200, interactions: 5800 },
    { date: "Jan 25", activeUsers: 2100, sessionTime: 8.4, pageViews: 9200, interactions: 5100 },
    { date: "Jan 30", activeUsers: 2800, sessionTime: 8.6, pageViews: 12000, interactions: 6500 },
    { date: "Feb 05", activeUsers: 3000, sessionTime: 8.7, pageViews: 13500, interactions: 7200 },
    { date: "Feb 10", activeUsers: 2700, sessionTime: 8.8, pageViews: 12200, interactions: 6800 },
    { date: "Feb 15", activeUsers: 3200, sessionTime: 8.9, pageViews: 14500, interactions: 7800 },
    { date: "Feb 20", activeUsers: 3500, sessionTime: 9.0, pageViews: 15800, interactions: 8500 },
    { date: "Feb 25", activeUsers: 3700, sessionTime: 9.1, pageViews: 16500, interactions: 9000 },
  ]

  // Add some randomness to the data
  return baseData.map((item) => ({
    ...item,
    activeUsers: item.activeUsers + Math.floor(Math.random() * 200) - 100,
    sessionTime: Number.parseFloat((item.sessionTime + (Math.random() * 0.4 - 0.2)).toFixed(1)),
    pageViews: item.pageViews + Math.floor(Math.random() * 500) - 250,
    interactions: item.interactions + Math.floor(Math.random() * 300) - 150,
  }))
}

export function UserEngagementChart() {
  const [mounted, setMounted] = useState(false)
  const [metrics, setMetrics] = useState<string[]>(["activeUsers", "interactions"])
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setMounted(true)
    setData(generateData())
    setIsLoading(false)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(generateData())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setData(generateData())
      setIsRefreshing(false)
    }, 1000)
  }

  const toggleMetric = (metric: string) => {
    setMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  const colors = {
    activeUsers: "#006666",
    sessionTime: "#0ea5e9",
    pageViews: "#f59e0b",
    interactions: "#a855f7",
  }

  if (!mounted || isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {["Active Users", "Session Time", "Page Views", "Interactions"].map((label, i) => (
            <Skeleton key={i} className="h-9 w-28" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={metrics.includes("activeUsers") ? "default" : "outline"}
            onClick={() => toggleMetric("activeUsers")}
            className={metrics.includes("activeUsers") ? "bg-[#006666] hover:bg-[#005555]" : ""}
          >
            Active Users
          </Button>
          <Button
            variant={metrics.includes("sessionTime") ? "default" : "outline"}
            onClick={() => toggleMetric("sessionTime")}
            className={metrics.includes("sessionTime") ? "bg-[#0ea5e9] hover:bg-[#0d96d4]" : ""}
          >
            Session Time
          </Button>
          <Button
            variant={metrics.includes("pageViews") ? "default" : "outline"}
            onClick={() => toggleMetric("pageViews")}
            className={metrics.includes("pageViews") ? "bg-[#f59e0b] hover:bg-[#e08e0a]" : ""}
          >
            Page Views
          </Button>
          <Button
            variant={metrics.includes("interactions") ? "default" : "outline"}
            onClick={() => toggleMetric("interactions")}
            className={metrics.includes("interactions") ? "bg-[#a855f7] hover:bg-[#9941e3]" : ""}
          >
            Interactions
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9">
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="left" />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} orientation="right" yAxisId="right" />
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

          {metrics.includes("activeUsers") && (
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke={colors.activeUsers}
              strokeWidth={2}
              yAxisId="left"
              name="Active Users"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: colors.activeUsers, strokeWidth: 2 }}
              animationDuration={1000}
            />
          )}

          {metrics.includes("sessionTime") && (
            <Line
              type="monotone"
              dataKey="sessionTime"
              stroke={colors.sessionTime}
              strokeWidth={2}
              yAxisId="right"
              name="Avg. Session Time (min)"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: colors.sessionTime, strokeWidth: 2 }}
              animationDuration={1000}
            />
          )}

          {metrics.includes("pageViews") && (
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke={colors.pageViews}
              strokeWidth={2}
              yAxisId="left"
              name="Page Views"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: colors.pageViews, strokeWidth: 2 }}
              animationDuration={1000}
            />
          )}

          {metrics.includes("interactions") && (
            <Line
              type="monotone"
              dataKey="interactions"
              stroke={colors.interactions}
              strokeWidth={2}
              yAxisId="left"
              name="Interactions"
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: colors.interactions, strokeWidth: 2 }}
              animationDuration={1000}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

