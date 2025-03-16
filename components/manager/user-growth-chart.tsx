"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { month: "Jan", newUsers: 850, activeUsers: 2200, churnedUsers: 120 },
  { month: "Feb", newUsers: 920, activeUsers: 2450, churnedUsers: 150 },
  { month: "Mar", newUsers: 980, activeUsers: 2700, churnedUsers: 180 },
  { month: "Apr", newUsers: 1050, activeUsers: 2950, churnedUsers: 200 },
  { month: "May", newUsers: 1120, activeUsers: 3200, churnedUsers: 220 },
  { month: "Jun", newUsers: 1200, activeUsers: 3450, churnedUsers: 240 },
  { month: "Jul", newUsers: 1280, activeUsers: 3700, churnedUsers: 260 },
  { month: "Aug", newUsers: 1350, activeUsers: 3950, churnedUsers: 280 },
  { month: "Sep", newUsers: 1420, activeUsers: 4200, churnedUsers: 300 },
  { month: "Oct", newUsers: 1500, activeUsers: 4450, churnedUsers: 320 },
  { month: "Nov", newUsers: 1580, activeUsers: 4700, churnedUsers: 340 },
  { month: "Dec", newUsers: 1650, activeUsers: 4950, churnedUsers: 360 },
]

export function UserGrowthChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend />
        <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#006666" fill="#00666633" strokeWidth={2} />
        <Area
          type="monotone"
          dataKey="activeUsers"
          name="Active Users"
          stroke="#0ea5e9"
          fill="#0ea5e933"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="churnedUsers"
          name="Churned Users"
          stroke="#ef4444"
          fill="#ef444433"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

