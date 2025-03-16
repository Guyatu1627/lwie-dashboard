"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdvertisementList } from "@/components/manager/advertisement-list"
import { AdPerformanceChart } from "@/components/manager/ad-performance-chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Plus } from "lucide-react"
import Link from "next/link"

export default function AdvertisementsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Advertisement Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/manager/ad-requests">
              <Plus className="mr-2 h-4 w-4" />
              View Ad Requests
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search advertisements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Ads</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Total Ads</CardTitle>
                <CardDescription>All advertisements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Currently running</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42</div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Revenue</CardTitle>
                <CardDescription>From all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$24,568</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ad Performance</CardTitle>
              <CardDescription>Click-through rates and impressions</CardDescription>
            </CardHeader>
            <CardContent>
              <AdPerformanceChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advertisement List</CardTitle>
              <CardDescription>Manage all advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertisementList searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Advertisements</CardTitle>
              <CardDescription>Ads waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertisementList filterStatus="pending" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Advertisements</CardTitle>
              <CardDescription>Currently running campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertisementList filterStatus="active" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Advertisements</CardTitle>
              <CardDescription>Past campaigns that have ended</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertisementList filterStatus="completed" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Advertisements</CardTitle>
              <CardDescription>Ads that did not meet guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvertisementList filterStatus="rejected" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

