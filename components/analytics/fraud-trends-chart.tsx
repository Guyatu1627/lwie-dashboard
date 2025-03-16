"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for fraud trends
const fraudTrendsData = [
  { name: "Jan", attempts: 32, blocked: 28 },
  { name: "Feb", attempts: 40, blocked: 35 },
  { name: "Mar", attempts: 35, blocked: 30 },
  { name: "Apr", attempts: 42, blocked: 38 },
  { name: "May", attempts: 38, blocked: 34 },
  { name: "Jun", attempts: 45, blocked: 40 },
  { name: "Jul", attempts: 50, blocked: 45 },
]

export function FraudTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={fraudTrendsData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="attempts" stroke="#ff0000" fill="#ff0000" fillOpacity={0.3} />
        <Area type="monotone" dataKey="blocked" stroke="#00c49f" fill="#00c49f" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

