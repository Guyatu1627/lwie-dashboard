"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function CategoryBreakdown() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for category data
    const fetchData = () => {
      setData([
        { name: "Electronics", value: 32 },
        { name: "Vehicles", value: 24 },
        { name: "Furniture", value: 18 },
        { name: "Fashion", value: 14 },
        { name: "Mobile Phones", value: 8 },
        { name: "Other", value: 4 },
      ])
    }

    fetchData()
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

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
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

