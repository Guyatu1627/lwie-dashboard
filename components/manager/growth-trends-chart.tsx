"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { month: "Jul", users: 1200, listings: 650, swaps: 180 },
  { month: "Aug", users: 1450, listings: 720, swaps: 210 },
  { month: "Sep", users: 1800, listings: 850, swaps: 260 },
  { month: "Oct", users: 2100, listings: 980, swaps: 320 },
  { month: "Nov", users: 2400, listings: 1150, swaps: 380 },
  { month: "Dec", users: 2650, listings: 1280, swaps: 420 },
  { month: "Jan", users: 2850, listings: 1420, swaps: 480 },
  { month: "Feb", users: 3150, listings: 1580, swaps: 520 },
]

export function GrowthTrendsChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="users" name="Active Users" stroke="#006666" fill="#00666633" strokeWidth={2} />
        <Area
          type="monotone"
          dataKey="listings"
          name="Total Listings"
          stroke="#0ea5e9"
          fill="#0ea5e933"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="swaps"
          name="Completed Swaps"
          stroke="#f59e0b"
          fill="#f59e0b33"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

