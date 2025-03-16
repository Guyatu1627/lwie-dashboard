"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { date: "Jan 01", users: 2200, listings: 120, swaps: 28, sessionTime: 7.2 },
  { date: "Jan 05", users: 2400, listings: 135, swaps: 32, sessionTime: 7.5 },
  { date: "Jan 10", users: 2350, listings: 128, swaps: 30, sessionTime: 7.8 },
  { date: "Jan 15", users: 2500, listings: 142, swaps: 35, sessionTime: 8.0 },
  { date: "Jan 20", users: 2650, listings: 150, swaps: 38, sessionTime: 8.2 },
  { date: "Jan 25", users: 2750, listings: 155, swaps: 40, sessionTime: 8.4 },
  { date: "Jan 30", users: 2850, listings: 160, swaps: 42, sessionTime: 8.6 },
  { date: "Feb 05", users: 2950, listings: 165, swaps: 45, sessionTime: 8.7 },
  { date: "Feb 10", users: 3050, listings: 170, swaps: 48, sessionTime: 8.8 },
  { date: "Feb 15", users: 3150, listings: 175, swaps: 50, sessionTime: 8.9 },
]

export function PlatformMetricsChart() {
  const [mounted, setMounted] = useState(false)
  const [metrics, setMetrics] = useState<string[]>(["users", "listings"])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  const toggleMetric = (metric: string) => {
    setMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  const colors = {
    users: "#006666",
    listings: "#0ea5e9",
    swaps: "#f59e0b",
    sessionTime: "#a855f7",
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={metrics.includes("users") ? "default" : "outline"}
          onClick={() => toggleMetric("users")}
          className={metrics.includes("users") ? "bg-[#006666]" : ""}
        >
          Active Users
        </Button>
        <Button
          variant={metrics.includes("listings") ? "default" : "outline"}
          onClick={() => toggleMetric("listings")}
          className={metrics.includes("listings") ? "bg-[#0ea5e9]" : ""}
        >
          New Listings
        </Button>
        <Button
          variant={metrics.includes("swaps") ? "default" : "outline"}
          onClick={() => toggleMetric("swaps")}
          className={metrics.includes("swaps") ? "bg-[#f59e0b]" : ""}
        >
          Completed Swaps
        </Button>
        <Button
          variant={metrics.includes("sessionTime") ? "default" : "outline"}
          onClick={() => toggleMetric("sessionTime")}
          className={metrics.includes("sessionTime") ? "bg-[#a855f7]" : ""}
        >
          Avg. Session Time
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="left" />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} orientation="right" yAxisId="right" />
          <Tooltip />
          <Legend />

          {metrics.includes("users") && (
            <Line
              type="monotone"
              dataKey="users"
              stroke={colors.users}
              strokeWidth={2}
              yAxisId="left"
              name="Active Users"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}

          {metrics.includes("listings") && (
            <Line
              type="monotone"
              dataKey="listings"
              stroke={colors.listings}
              strokeWidth={2}
              yAxisId="left"
              name="New Listings"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}

          {metrics.includes("swaps") && (
            <Line
              type="monotone"
              dataKey="swaps"
              stroke={colors.swaps}
              strokeWidth={2}
              yAxisId="left"
              name="Completed Swaps"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
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
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

