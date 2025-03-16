"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { date: "Jan 01", impressions: 5200, clicks: 182 },
  { date: "Jan 05", impressions: 6800, clicks: 238 },
  { date: "Jan 10", impressions: 7400, clicks: 259 },
  { date: "Jan 15", impressions: 9200, clicks: 322 },
  { date: "Jan 20", impressions: 10400, clicks: 364 },
  { date: "Jan 25", impressions: 11200, clicks: 392 },
  { date: "Jan 30", impressions: 12800, clicks: 448 },
  { date: "Feb 05", impressions: 14000, clicks: 490 },
  { date: "Feb 10", impressions: 13200, clicks: 462 },
  { date: "Feb 15", impressions: 15600, clicks: 546 },
]

export function AdPerformanceChart() {
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="left" />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} orientation="right" yAxisId="right" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="impressions"
          stroke="#006666"
          strokeWidth={2}
          yAxisId="left"
          name="Impressions"
        />
        <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} yAxisId="right" name="Clicks" />
      </LineChart>
    </ResponsiveContainer>
  )
}

