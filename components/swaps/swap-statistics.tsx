"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"

export function SwapStatistics() {
  // Mock statistics
  const [stats] = useState({
    successRate: 75.3,
    averageCompletionTime: 3.2, // days
    disputeRate: 2.4,
    categoryDistribution: [
      { category: "Electronics", percentage: 32 },
      { category: "Vehicles", percentage: 24 },
      { category: "Furniture", percentage: 18 },
      { category: "Fashion", percentage: 14 },
      { category: "Other", percentage: 12 },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Success Rate</span>
          <span className="text-sm font-medium text-green-500">{stats.successRate}%</span>
        </div>
        <Progress value={stats.successRate} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Average Completion Time</span>
          <span className="text-sm font-medium">{stats.averageCompletionTime} days</span>
        </div>
        <Progress value={stats.averageCompletionTime * 10} max={50} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dispute Rate</span>
          <span className="text-sm font-medium text-orange-500">{stats.disputeRate}%</span>
        </div>
        <Progress value={stats.disputeRate} max={10} className="h-2" />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Category Distribution</span>
        {stats.categoryDistribution.map((item) => (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs">{item.category}</span>
              <span className="text-xs">{item.percentage}%</span>
            </div>
            <Progress value={item.percentage} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  )
}

