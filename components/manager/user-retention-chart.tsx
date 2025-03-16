"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const generateData = () => {
  const baseData = [
    { cohort: "Jan 2023", week1: 100, week2: 85, week3: 72, week4: 65, week8: 58, week12: 52 },
    { cohort: "Feb 2023", week1: 100, week2: 82, week3: 70, week4: 62, week8: 55, week12: 48 },
    { cohort: "Mar 2023", week1: 100, week2: 88, week3: 75, week4: 68, week8: 60, week12: 54 },
    { cohort: "Apr 2023", week1: 100, week2: 86, week3: 74, week4: 67, week8: 59, week12: 53 },
    { cohort: "May 2023", week1: 100, week2: 90, week3: 78, week4: 70, week8: 63, week12: 57 },
    { cohort: "Jun 2023", week1: 100, week2: 87, week3: 76, week4: 69, week8: 62, week12: 56 },
    { cohort: "Jul 2023", week1: 100, week2: 89, week3: 77, week4: 71, week8: 64, week12: 58 },
    { cohort: "Aug 2023", week1: 100, week2: 91, week3: 80, week4: 73, week8: 66, week12: 60 },
    { cohort: "Sep 2023", week1: 100, week2: 92, week3: 82, week4: 75, week8: 68, week12: 62 },
    { cohort: "Oct 2023", week1: 100, week2: 93, week3: 84, week4: 78, week8: 71, week12: 65 },
    { cohort: "Nov 2023", week1: 100, week2: 94, week3: 86, week4: 80, week8: 73, week12: 67 },
    { cohort: "Dec 2023", week1: 100, week2: 95, week3: 88, week4: 82, week8: 75, week12: 69 },
  ]

  // Add some randomness to the data
  return baseData.map((item) => ({
    ...item,
    week2: Math.min(100, Math.max(70, item.week2 + Math.floor(Math.random() * 6) - 3)),
    week3: Math.min(100, Math.max(60, item.week3 + Math.floor(Math.random() * 6) - 3)),
    week4: Math.min(100, Math.max(50, item.week4 + Math.floor(Math.random() * 6) - 3)),
    week8: Math.min(100, Math.max(40, item.week8 + Math.floor(Math.random() * 6) - 3)),
    week12: Math.min(100, Math.max(30, item.week12 + Math.floor(Math.random() * 6) - 3)),
  }))
}

export function UserRetentionChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [visibleCohorts, setVisibleCohorts] = useState(6) // Show last 6 months by default

  useEffect(() => {
    setMounted(true)
    setData(generateData())
    setIsLoading(false)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setData(generateData())
      setIsRefreshing(false)
    }, 1000)
  }

  const toggleCohorts = () => {
    setVisibleCohorts(visibleCohorts === 6 ? 12 : 6)
  }

  const filteredData = data.slice(-visibleCohorts)

  if (!mounted || isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" onClick={toggleCohorts}>
          {visibleCohorts === 6 ? "Show All Cohorts" : "Show Recent Cohorts"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-9">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={filteredData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="cohort"
            type="category"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Retention Rate"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "6px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            animationDuration={300}
          />
          <Legend />
          <Bar dataKey="week1" name="Week 1" fill="#006666" radius={[0, 4, 4, 0]} animationDuration={1000} />
          <Bar dataKey="week2" name="Week 2" fill="#0ea5e9" radius={[0, 4, 4, 0]} animationDuration={1000} />
          <Bar dataKey="week4" name="Week 4" fill="#f59e0b" radius={[0, 4, 4, 0]} animationDuration={1000} />
          <Bar dataKey="week8" name="Week 8" fill="#a855f7" radius={[0, 4, 4, 0]} animationDuration={1000} />
          <Bar dataKey="week12" name="Week 12" fill="#ef4444" radius={[0, 4, 4, 0]} animationDuration={1000} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

