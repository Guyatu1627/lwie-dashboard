"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Electronics", value: 35 },
  { name: "Vehicles", value: 25 },
  { name: "Furniture", value: 15 },
  { name: "Fashion", value: 12 },
  { name: "Sports", value: 8 },
  { name: "Books", value: 5 },
]

const COLORS = ["#006666", "#0ea5e9", "#f59e0b", "#a855f7", "#ef4444", "#10b981"]

export function CategoryBreakdownChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}%`, "Percentage"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

