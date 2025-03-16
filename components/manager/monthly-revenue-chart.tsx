"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { month: "Sep", adRevenue: 8200, premiumListings: 4500, subscriptions: 2800 },
  { month: "Oct", adRevenue: 9400, premiumListings: 5100, subscriptions: 3200 },
  { month: "Nov", adRevenue: 11200, premiumListings: 5800, subscriptions: 3600 },
  { month: "Dec", adRevenue: 12800, premiumListings: 6200, subscriptions: 4100 },
  { month: "Jan", adRevenue: 14500, premiumListings: 6800, subscriptions: 4500 },
  { month: "Feb", adRevenue: 16200, premiumListings: 7400, subscriptions: 5100 },
]

export function MonthlyRevenueChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, ""]} />
        <Legend />
        <Bar dataKey="adRevenue" name="Ad Revenue" fill="#006666" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="premiumListings" name="Premium Listings" fill="#0ea5e9" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="subscriptions" name="Subscriptions" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}

