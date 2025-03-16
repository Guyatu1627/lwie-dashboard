"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DataTable } from "@/components/data-table"
import { format } from "date-fns"

// Mock data for advertisement report
const adPerformanceData = [
  { date: "2023-11-10", impressions: 12500, clicks: 450, conversions: 35 },
  { date: "2023-11-11", impressions: 13200, clicks: 480, conversions: 42 },
  { date: "2023-11-12", impressions: 11800, clicks: 420, conversions: 30 },
  { date: "2023-11-13", impressions: 12900, clicks: 460, conversions: 38 },
  { date: "2023-11-14", impressions: 13500, clicks: 490, conversions: 45 },
  { date: "2023-11-15", impressions: 14200, clicks: 520, conversions: 50 },
  { date: "2023-11-16", impressions: 13800, clicks: 500, conversions: 47 },
]

const adCategoryData = [
  { category: "Electronics", value: 35 },
  { category: "Vehicles", value: 25 },
  { category: "Furniture", value: 20 },
  { category: "Fashion", value: 15 },
  { category: "Other", value: 5 },
]

const topPerformingAds = [
  {
    id: "ad-001",
    title: "Premium Electronics Promotion",
    advertiser: "John Smith",
    impressions: 5200,
    clicks: 210,
    ctr: 4.04,
    budget: 250,
  },
  {
    id: "ad-002",
    title: "Vehicle Showcase",
    advertiser: "Auto Traders Inc.",
    impressions: 4800,
    clicks: 195,
    ctr: 4.06,
    budget: 500,
  },
  {
    id: "ad-003",
    title: "Fashion Collection Spotlight",
    advertiser: "Style Boutique",
    impressions: 3900,
    clicks: 150,
    ctr: 3.85,
    budget: 150,
  },
  {
    id: "ad-004",
    title: "Home Furniture Promotion",
    advertiser: "Comfort Living",
    impressions: 4200,
    clicks: 180,
    ctr: 4.29,
    budget: 300,
  },
  {
    id: "ad-005",
    title: "Sports Equipment Showcase",
    advertiser: "Active Life Co.",
    impressions: 3600,
    clicks: 140,
    ctr: 3.89,
    budget: 200,
  },
]

export function AdvertisementReport({ dateRange, reportType, region, category }) {
  const adColumns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "advertiser",
      header: "Advertiser",
    },
    {
      accessorKey: "impressions",
      header: "Impressions",
      cell: ({ row }) => {
        return <div>{row.getValue("impressions").toLocaleString()}</div>
      },
    },
    {
      accessorKey: "clicks",
      header: "Clicks",
      cell: ({ row }) => {
        return <div>{row.getValue("clicks").toLocaleString()}</div>
      },
    },
    {
      accessorKey: "ctr",
      header: "CTR",
      cell: ({ row }) => {
        return <div>{row.getValue("ctr")}%</div>
      },
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        return <div>${row.getValue("budget")}</div>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advertisement Performance</CardTitle>
            <CardDescription>Impressions, clicks, and conversions over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={(date) => format(new Date(date), "MMMM dd, yyyy")} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advertisement Categories</CardTitle>
            <CardDescription>Distribution of advertisements by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="category"
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ffc658" />
                  <Cell fill="#ff8042" />
                  <Cell fill="#0088fe" />
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
          <CardTitle>Click-Through Rate (CTR)</CardTitle>
          <CardDescription>CTR comparison across advertisement categories</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { category: "Electronics", ctr: 4.2 },
                { category: "Vehicles", ctr: 3.8 },
                { category: "Furniture", ctr: 3.5 },
                { category: "Fashion", ctr: 4.5 },
                { category: "Sports", ctr: 3.9 },
                { category: "Collectibles", ctr: 4.1 },
                { category: "Books", ctr: 3.2 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 5]} />
              <Tooltip formatter={(value) => [`${value}%`, "CTR"]} />
              <Legend />
              <Bar dataKey="ctr" name="Click-Through Rate" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Advertisements</CardTitle>
          <CardDescription>Advertisements with the highest engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={adColumns} data={topPerformingAds} pagination={true} />
        </CardContent>
      </Card>
    </div>
  )
}

