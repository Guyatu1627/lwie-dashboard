"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
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
} from "recharts"

export function ManagerOverview() {
  // Mock data for the overview charts
  const userActivityData = [
    { name: "Mon", users: 400 },
    { name: "Tue", users: 450 },
    { name: "Wed", users: 500 },
    { name: "Thu", users: 470 },
    { name: "Fri", users: 520 },
    { name: "Sat", users: 580 },
    { name: "Sun", users: 650 },
  ]

  const revenueData = [
    { name: "Jan", revenue: 1200 },
    { name: "Feb", revenue: 1400 },
    { name: "Mar", revenue: 1600 },
    { name: "Apr", revenue: 1500 },
    { name: "May", revenue: 1700 },
    { name: "Jun", revenue: 1800 },
    { name: "Jul", revenue: 2000 },
  ]

  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Vehicles", value: 25 },
    { name: "Furniture", value: 20 },
    { name: "Fashion", value: 15 },
    { name: "Other", value: 5 },
  ]

  return (
    <Tabs defaultValue="user-activity" className="space-y-4">
      <TabsList>
        <TabsTrigger value="user-activity">User Activity</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="user-activity" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>User activity over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="revenue" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue from premium listings and advertisements</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="categories" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Distribution of items by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

