"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

// Mock data for payment report
const paymentTrendsData = [
  { date: "2023-11-10", premiumListings: 1200, advertisements: 2500, total: 3700 },
  { date: "2023-11-11", premiumListings: 1350, advertisements: 2700, total: 4050 },
  { date: "2023-11-12", premiumListings: 1100, advertisements: 2300, total: 3400 },
  { date: "2023-11-13", premiumListings: 1250, advertisements: 2600, total: 3850 },
  { date: "2023-11-14", premiumListings: 1400, advertisements: 2900, total: 4300 },
  { date: "2023-11-15", premiumListings: 1500, advertisements: 3100, total: 4600 },
  { date: "2023-11-16", premiumListings: 1450, advertisements: 3000, total: 4450 },
]

const paymentMethodsData = [
  { method: "Credit Card", value: 65 },
  { method: "PayPal", value: 25 },
  { method: "Bank Transfer", value: 8 },
  { method: "Other", value: 2 },
]

const topPayingUsers = [
  { id: 1, username: "john_doe", totalSpent: 750, paymentCount: 5, lastPayment: "2023-11-16T14:30:00Z" },
  { id: 2, username: "auto_traders", totalSpent: 1200, paymentCount: 3, lastPayment: "2023-11-15T15:45:00Z" },
  { id: 3, username: "style_boutique", totalSpent: 650, paymentCount: 4, lastPayment: "2023-11-14T12:15:00Z" },
  { id: 4, username: "comfort_living", totalSpent: 900, paymentCount: 2, lastPayment: "2023-11-13T16:20:00Z" },
  { id: 5, username: "active_life", totalSpent: 550, paymentCount: 3, lastPayment: "2023-11-12T13:10:00Z" },
]

const recentPayments = [
  {
    id: "pay-001",
    user: "john_doe",
    amount: 250,
    type: "Premium Listing",
    status: "completed",
    date: "2023-11-16T14:30:00Z",
  },
  {
    id: "pay-002",
    user: "auto_traders",
    amount: 500,
    type: "Advertisement",
    status: "completed",
    date: "2023-11-15T15:45:00Z",
  },
  {
    id: "pay-003",
    user: "style_boutique",
    amount: 150,
    type: "Premium Listing",
    status: "completed",
    date: "2023-11-14T12:15:00Z",
  },
  {
    id: "pay-004",
    user: "comfort_living",
    amount: 300,
    type: "Advertisement",
    status: "completed",
    date: "2023-11-13T16:20:00Z",
  },
  {
    id: "pay-005",
    user: "active_life",
    amount: 200,
    type: "Premium Listing",
    status: "completed",
    date: "2023-11-12T13:10:00Z",
  },
]

export function PaymentReport({ dateRange, reportType, region, category }) {
  const topUserColumns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
      cell: ({ row }) => {
        return <div>${row.getValue("totalSpent")}</div>
      },
    },
    {
      accessorKey: "paymentCount",
      header: "Payment Count",
    },
    {
      accessorKey: "lastPayment",
      header: "Last Payment",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("lastPayment")), "MMM dd, yyyy")}</div>
      },
    },
  ]

  const recentPaymentColumns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "user",
      header: "User",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return <div>${row.getValue("amount")}</div>
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type")
        return <Badge variant={type === "Advertisement" ? "outline" : "secondary"}>{type}</Badge>
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("date")), "MMM dd, yyyy")}</div>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
            <CardDescription>Revenue from premium listings and advertisements</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), "MMMM dd, yyyy")}
                  formatter={(value) => [`$${value}`, ""]}
                />
                <Legend />
                <Bar dataKey="premiumListings" name="Premium Listings" fill="#8884d8" />
                <Bar dataKey="advertisements" name="Advertisements" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment methods used</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="method"
                  label={({ method, percent }) => `${method}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ffc658" />
                  <Cell fill="#ff8042" />
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
          <CardTitle>Top Paying Users</CardTitle>
          <CardDescription>Users with the highest spending</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={topUserColumns} data={topPayingUsers} pagination={true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest completed payments</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={recentPaymentColumns} data={recentPayments} pagination={true} />
        </CardContent>
      </Card>
    </div>
  )
}

