import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformMetricsChart } from "@/components/manager/platform-metrics-chart"
import { GrowthTrendsChart } from "@/components/manager/growth-trends-chart"
import { MapChart } from "@/components/analytics/map-chart"
import { FraudTrendsChart } from "@/components/analytics/fraud-trends-chart"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, LineChart, Map, Calendar } from "lucide-react"
import { DateRangePicker } from "@/components/manager/date-range-picker"

export default function PlatformAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DateRangePicker />
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="growth">
            <LineChart className="h-4 w-4 mr-2" />
            Growth Trends
          </TabsTrigger>
          <TabsTrigger value="geographic">
            <Map className="h-4 w-4 mr-2" />
            Geographic Data
          </TabsTrigger>
          <TabsTrigger value="fraud">
            <Calendar className="h-4 w-4 mr-2" />
            Fraud Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Daily average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,853</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>New Listings</CardTitle>
                <CardDescription>Daily average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Listings to swaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+2.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Avg. Session</CardTitle>
                <CardDescription>Time on platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8:42</div>
                <p className="text-xs text-muted-foreground">+0:36 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <PlatformMetricsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>User and listing growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <GrowthTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User and listing distribution by region</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <MapChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Analysis</CardTitle>
              <CardDescription>Detected fraudulent activities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <FraudTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

