"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

// Mock data for user activity report
const userActivityData = [
  { date: "2023-11-10", activeUsers: 1245, newUsers: 78, itemsPosted: 342, swapsCompleted: 156 },
  { date: "2023-11-11", activeUsers: 1320, newUsers: 85, itemsPosted: 365, swapsCompleted: 172 },
  { date: "2023-11-12", activeUsers: 1180, newUsers: 62, itemsPosted: 310, swapsCompleted: 145 },
  { date: "2023-11-13", activeUsers: 1290, newUsers: 74, itemsPosted: 328, swapsCompleted: 163 },
  { date: "2023-11-14", activeUsers: 1350, newUsers: 92, itemsPosted: 375, swapsCompleted: 180 },
  { date: "2023-11-15", activeUsers: 1420, newUsers: 105, itemsPosted: 392, swapsCompleted: 195 },
  { date: "2023-11-16", activeUsers: 1380, newUsers: 88, itemsPosted: 358, swapsCompleted: 178 },
]

const topUsers = [
  { id: 1, username: "john_doe", itemsPosted: 24, swapsCompleted: 12, lastActive: "2023-11-16T14:30:00Z" },
  { id: 2, username: "jane_smith", itemsPosted: 18, swapsCompleted: 15, lastActive: "2023-11-16T15:45:00Z" },
  { id: 3, username: "robert_johnson", itemsPosted: 15, swapsCompleted: 8, lastActive: "2023-11-16T12:15:00Z" },
  { id: 4, username: "emily_wilson", itemsPosted: 12, swapsCompleted: 10, lastActive: "2023-11-16T16:20:00Z" },
  { id: 5, username: "michael_brown", itemsPosted: 10, swapsCompleted: 7, lastActive: "2023-11-16T13:10:00Z" },
]

const userSatisfactionData = [
  { rating: "5 Stars", count: 450 },
  { rating: "4 Stars", count: 320 },
  { rating: "3 Stars", count: 180 },
  { rating: "2 Stars", count: 80 },
  { rating: "1 Star", count: 45 },
]

export function UserActivityReport({ dateRange, reportType, region, category }) {
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "itemsPosted",
      header: "Items Posted",
    },
    {
      accessorKey: "swapsCompleted",
      header: "Swaps Completed",
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("lastActive")), "MMM dd, yyyy HH:mm")}</div>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>Active users and new registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
                <YAxis />
                <Tooltip labelFormatter={(date) => format(new Date(date), "MMMM dd, yyyy")} />
                <Legend />
                <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
            <CardDescription>Distribution of user ratings and feedback</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userSatisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="rating"
                  label={({ rating, percent }) => `${rating}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#4CAF50" />
                  <Cell fill="#8BC34A" />
                  <Cell fill="#FFC107" />
                  <Cell fill="#FF9800" />
                  <Cell fill="#F44336" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Engagement</CardTitle>
          <CardDescription>Items posted and swaps completed over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
              <YAxis />
              <Tooltip labelFormatter={(date) => format(new Date(date), "MMMM dd, yyyy")} />
              <Legend />
              <Area type="monotone" dataKey="itemsPosted" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="swapsCompleted" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Active Users</CardTitle>
          <CardDescription>Users with the highest activity levels</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={topUsers} pagination={true} />
        </CardContent>
      </Card>
    </div>
  )
}

