"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function UserEngagementChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for user engagement data
    const fetchData = () => {
      setData([
        { name: "Jan", activeUsers: 4500, retentionRate: 85 },
        { name: "Feb", activeUsers: 4800, retentionRate: 82 },
        { name: "Mar", activeUsers: 5200, retentionRate: 78 },
        { name: "Apr", activeUsers: 5000, retentionRate: 75 },
        { name: "May", activeUsers: 5400, retentionRate: 79 },
        { name: "Jun", activeUsers: 5800, retentionRate: 80 },
        { name: "Jul", activeUsers: 6200, retentionRate: 78 },
      ])
    }

    fetchData()
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="retentionRate" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

