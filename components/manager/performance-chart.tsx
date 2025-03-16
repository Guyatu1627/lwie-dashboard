"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for the performance chart
const performanceData = [
  { name: "Jan", users: 400, revenue: 1200, swaps: 240 },
  { name: "Feb", users: 450, revenue: 1400, swaps: 280 },
  { name: "Mar", users: 500, revenue: 1600, swaps: 320 },
  { name: "Apr", users: 470, revenue: 1500, swaps: 300 },
  { name: "May", users: 520, revenue: 1700, swaps: 350 },
  { name: "Jun", users: 580, revenue: 1800, swaps: 390 },
  { name: "Jul", users: 650, revenue: 2000, swaps: 420 },
]

export function ManagerPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={performanceData}
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
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
        <Line yAxisId="left" type="monotone" dataKey="swaps" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}

