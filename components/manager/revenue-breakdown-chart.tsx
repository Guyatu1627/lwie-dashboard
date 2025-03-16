"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Ad Revenue", value: 32845, color: "#006666" },
  { name: "Premium Listings", value: 15717, color: "#0ea5e9" },
  { name: "Subscriptions", value: 8500, color: "#f59e0b" },
  { name: "Other", value: 1500, color: "#a3a3a3" },
]

export function RevenueBreakdownChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

