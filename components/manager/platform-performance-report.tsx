"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Mock data for platform performance report
const platformGrowthData = [
  { date: "2023-05", users: 8500, items: 22000, swaps: 5400 },
  { date: "2023-06", users: 9200, items: 24000, swaps: 5900 },
  { date: "2023-07", users: 9800, items: 25500, swaps: 6300 },
  { date: "2023-08", users: 10500, items: 27000, swaps: 6800 },
  { date: "2023-09", users: 11200, items: 28500, swaps: 7200 },
  { date: "2023-10", users: 11900, items: 30000, swaps: 7600 },
  { date: "2023-11", users: 12500, items: 31500, swaps: 8000 },
]

const categoryGrowthData = [
  { category: "Electronics", growth: 28 },
  { category: "Vehicles", growth: 15 },
  { category: "Furniture", growth: 22 },
  { category: "Fashion", growth: 18 },
  { category: "Sports", growth: 25 },
  { category: "Collectibles", growth: 12 },
  { category: "Books", growth: 10 },
]

const reportedItemsData = [
  { date: "2023-11-10", count: 12 },
  { date: "2023-11-11", count: 15 },
  { date: "2023-11-12", count: 8 },
  { date: "2023-11-13", count: 10 },
  { date: "2023-11-14", count: 14 },
  { date: "2023-11-15", count: 18 },
  { date: "2023-11-16", count: 13 },
]

const regionPerformanceData = [
  { region: "North America", users: 5200, items: 14500, swaps: 3600 },
  { region: "Europe", users: 3800, items: 10200, swaps: 2500 },
  { region: "Asia", users: 2100, items: 5800, swaps: 1400 },
  { region: "South America", users: 850, items: 2300, swaps: 580 },
  { region: "Africa", users: 420, items: 1100, swaps: 280 },
  { region: "Oceania", users: 380, items: 950, swaps: 240 },
]

export function PlatformPerformanceReport({ dateRange, reportType, region, category }) {
  const regionColumns = [
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "users",
      header: "Users",
      cell: ({ row }) => {
        return <div>{row.getValue("users").toLocaleString()}</div>
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        return <div>{row.getValue("items").toLocaleString()}</div>
      },
    },
    {
      accessorKey: "swaps",
      header: "Swaps",
      cell: ({ row }) => {
        return <div>{row.getValue("swaps").toLocaleString()}</div>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Growth in users, items, and swaps over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const [year, month] = date.split("-")
                    return format(new Date(Number.parseInt(year), Number.parseInt(month) - 1), "MMM yyyy")
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => {
                    const [year, month] = date.split("-")
                    return format(new Date(Number.parseInt(year), Number.parseInt(month) - 1), "MMMM yyyy")
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="items" stroke="#82ca9d" />
                <Line type="monotone" dataKey="swaps" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Growth</CardTitle>
            <CardDescription>Growth rate by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryGrowthData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 30]} />
                <YAxis dataKey="category" type="category" />
                <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                <Legend />
                <Bar dataKey="growth" name="Growth Rate (%)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reported Items</CardTitle>
            <CardDescription>Number of reported items over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportedItemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
                <YAxis />
                <Tooltip labelFormatter={(date) => format(new Date(date), "MMMM dd, yyyy")} />
                <Legend />
                <Area type="monotone" dataKey="count" name="Reported Items" stroke="#ff8042" fill="#ff8042" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>User retention rate over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Jun", retention: 85 },
                  { month: "Jul", retention: 82 },
                  { month: "Aug", retention: 78 },
                  { month: "Sep", retention: 75 },
                  { month: "Oct", retention: 79 },
                  { month: "Nov", retention: 80 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Retention Rate"]} />
                <Legend />
                <Line type="monotone" dataKey="retention" name="Retention Rate" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
          <CardDescription>Platform performance by geographical region</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={regionColumns} data={regionPerformanceData} pagination={true} />
        </CardContent>
      </Card>
    </div>
  )
}

