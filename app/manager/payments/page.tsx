import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsList } from "@/components/manager/payments-list"
import { RevenueBreakdownChart } from "@/components/manager/revenue-breakdown-chart"
import { MonthlyRevenueChart } from "@/components/manager/monthly-revenue-chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, CreditCard, BadgePercent, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Total Revenue</p>
              </div>
              <Badge className="bg-green-500">+12%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">$48,562</h3>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$5,240</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Ad Revenue</p>
              </div>
              <Badge className="bg-green-500">+18%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">$32,845</h3>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$4,980</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Premium Listings</p>
              </div>
              <Badge className="bg-green-500">+8%</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">$15,717</h3>
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$1,260</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueBreakdownChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment processing options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Payment settings configuration will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

