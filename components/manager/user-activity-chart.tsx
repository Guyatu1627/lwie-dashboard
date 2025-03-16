"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan 01", users: 1200 },
  { date: "Jan 05", users: 1800 },
  { date: "Jan 10", users: 1600 },
  { date: "Jan 15", users: 2200 },
  { date: "Jan 20", users: 2400 },
  { date: "Jan 25", users: 2100 },
  { date: "Jan 30", users: 2800 },
  { date: "Feb 05", users: 3000 },
  { date: "Feb 10", users: 2700 },
  { date: "Feb 15", users: 3200 },
  { date: "Feb 20", users: 3500 },
  { date: "Feb 25", users: 3700 },
]

export function UserActivityChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#006666" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

