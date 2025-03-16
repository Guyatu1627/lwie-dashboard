"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { month: "Jan", featuredAds: 4200, premiumListings: 2800, subscriptions: 1500 },
  { month: "Feb", featuredAds: 4500, premiumListings: 3100, subscriptions: 1600 },
  { month: "Mar", featuredAds: 5100, premiumListings: 3400, subscriptions: 1700 },
  { month: "Apr", featuredAds: 5400, premiumListings: 3700, subscriptions: 1800 },
  { month: "May", featuredAds: 5800, premiumListings: 4000, subscriptions: 1900 },
  { month: "Jun", featuredAds: 6200, premiumListings: 4300, subscriptions: 2000 },
  { month: "Jul", featuredAds: 6500, premiumListings: 4500, subscriptions: 2100 },
  { month: "Aug", featuredAds: 6800, premiumListings: 4700, subscriptions: 2200 },
  { month: "Sep", featuredAds: 7100, premiumListings: 4900, subscriptions: 2300 },
  { month: "Oct", featuredAds: 7400, premiumListings: 5100, subscriptions: 2400 },
  { month: "Nov", featuredAds: 7700, premiumListings: 5300, subscriptions: 2500 },
  { month: "Dec", featuredAds: 8000, premiumListings: 5500, subscriptions: 2600 },
]

export function RevenueAnalyticsChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
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
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend />
        <Bar dataKey="featuredAds" name="Featured Ads" fill="#006666" radius={[4, 4, 0, 0]} />
        <Bar dataKey="premiumListings" name="Premium Listings" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="subscriptions" name="Subscriptions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

