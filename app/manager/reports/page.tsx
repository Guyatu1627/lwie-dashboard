"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePickerWithRange } from "@/components/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { FileText, Download, RefreshCw, Users, DollarSign, X, Layers, Activity } from "lucide-react"

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTab, setCurrentTab] = useState("user-activity")
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportConfig, setReportConfig] = useState({
    title: "User Activity Report",
    description: "Detailed analysis of user activity and engagement",
    sections: {
      userGrowth: true,
      userEngagement: true,
      userRetention: true,
      geographicDistribution: true,
    },
    format: "pdf",
    schedule: "once",
    recipients: "",
  })
  const [recentReports, setRecentReports] = useState([])

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setRecentReports([
        {
          id: "rep-001",
          title: "Monthly User Activity Report",
          type: "User Activity",
          date: "2024-01-15",
          format: "PDF",
          size: "2.4 MB",
          status: "completed",
        },
        {
          id: "rep-002",
          title: "Q4 Revenue Analysis",
          type: "Revenue",
          date: "2024-01-10",
          format: "Excel",
          size: "3.8 MB",
          status: "completed",
        },
        {
          id: "rep-003",
          title: "Content Performance Report",
          type: "Content",
          date: "2024-01-05",
          format: "PDF",
          size: "1.7 MB",
          status: "completed",
        },
        {
          id: "rep-004",
          title: "Platform Performance Analysis",
          type: "Performance",
          date: "2024-01-01",
          format: "PDF",
          size: "4.2 MB",
          status: "completed",
        },
        {
          id: "rep-005",
          title: "Weekly User Growth Report",
          type: "User Activity",
          date: "2023-12-25",
          format: "Excel",
          size: "1.5 MB",
          status: "completed",
        },
      ])
      setIsLoading(false)
    }, 1500)
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)

      toast({
        title: "Data refreshed",
        description: "Report data has been updated",
      })
    }, 1500)
  }

  // Handle report generation
  const handleGenerateReport = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      // Add new report to the list
      const newReport = {
        id: `rep-00${recentReports.length + 1}`,
        title: reportConfig.title,
        type:
          currentTab === "user-activity"
            ? "User Activity"
            : currentTab === "revenue"
              ? "Revenue"
              : currentTab === "content"
                ? "Content"
                : "Performance",
        date: new Date().toISOString().split("T")[0],
        format: reportConfig.format.toUpperCase(),
        size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        status: "completed",
      }

      setRecentReports((prev) => [newReport, ...prev])
      setIsGenerating(false)
      setIsReportModalOpen(false)

      toast({
        title: "Report generated",
        description: `${reportConfig.title} has been generated successfully`,
      })
    }, 3000)
  }

  // Handle download report
  const handleDownloadReport = (reportId) => {
    const report = recentReports.find((r) => r.id === reportId)

    if (!report) return

    toast({
      title: "Downloading report",
      description: `${report.title} is being downloaded`,
    })
  }

  // Handle delete report
  const handleDeleteReport = (reportId) => {
    setRecentReports((prev) => prev.filter((report) => report.id !== reportId))

    toast({
      title: "Report deleted",
      description: "The report has been deleted successfully",
    })
  }

  // Update report config
  const updateReportConfig = (field, value) => {
    setReportConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Update report section config
  const updateReportSection = (section, value) => {
    setReportConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: value,
      },
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage detailed reports for your platform
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          
          <Button onClick={() => setIsReportModalOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="user-activity" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">User Activity</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
        </TabsList>
        
        {/* User Activity Tab */}
        <TabsContent value="user-activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Report</CardTitle>
              <CardDescription>
                Analyze user engagement, growth, and behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Active Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">24,892</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+12.5%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">New Registrations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">1,824</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+8.2%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Avg. Session Duration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">8m 42s</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+1m 12s</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h3 className="text-lg font-medium mb-4">Report Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      This report provides comprehensive insights into user activity, engagement metrics, and behavior patterns.
                      Generate the full report to access detailed analytics and visualizations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Report Highlights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>User growth and retention analysis</li>
                          <li>Engagement metrics by user segment</li>
                          <li>Session duration and frequency trends</li>
                          <li>Feature usage and popularity</li>
                          <li>Geographic distribution of users</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Insights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>12.5% increase in active users</li>
                          <li>8.2% growth in new registrations</li>
                          <li>16% improvement in user retention</li>
                          <li>Mobile usage increased by 22%</li>
                          <li>Most active time: 6-9 PM weekdays</li>
                        </ul>
                      </div>
                    </div>
                    <Button onClick={() => setIsReportModalOpen(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Full Report
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated user activity reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports
                    .filter(report => report.type === "User Activity")
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.date).toLocaleDateString()} • {report.format} • {report.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReport(report.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {recentReports.filter(report => report.type === "User Activity").length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        You haven't generated any user activity reports yet
                      </p>
                      <Button onClick={() => setIsReportModalOpen(true)}>
                        Generate Report
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Report</CardTitle>
              <CardDescription>
                Analyze revenue streams, trends, and financial performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$385,742</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+15.3%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Avg. Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">$87.50</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+5.2%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">3.8%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+0.5%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h3 className="text-lg font-medium mb-4">Report Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      This report provides comprehensive insights into revenue streams, financial performance, and monetization metrics.
                      Generate the full report to access detailed analytics and visualizations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Report Highlights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Revenue breakdown by source</li>
                          <li>Monthly and quarterly trends</li>
                          <li>Transaction volume analysis</li>
                          <li>Customer lifetime value</li>
                          <li>Pricing strategy effectiveness</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Insights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>15.3% increase in total revenue</li>
                          <li>Premium subscriptions up by 22%</li>
                          <li>Ad revenue increased by 18%</li>
                          <li>Transaction fees generated $42,850</li>
                          <li>Featured listings revenue up 12%</li>
                        </ul>
                      </div>
                    </div>
                    <Button onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        title: "Revenue Analysis Report",
                        description: "Detailed analysis of revenue streams and financial performance"
                      });
                      setIsReportModalOpen(true);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Full Report
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated revenue reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports
                    .filter(report => report.type === "Revenue")
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.date).toLocaleDateString()} • {report.format} • {report.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReport(report.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {recentReports.filter(report => report.type === "Revenue").length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        You haven't generated any revenue reports yet
                      </p>
                      <Button onClick={() => {
                        setReportConfig({
                          ...reportConfig,
                          title: "Revenue Analysis Report",
                          description: "Detailed analysis of revenue streams and financial performance"
                        });
                        setIsReportModalOpen(true);
                      }}>
                        Generate Report
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Report</CardTitle>
              <CardDescription>
                Analyze content performance, engagement, and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Total Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">45,872</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+8.7%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Avg. Views per Item</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+12.4%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Engagement Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">4.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+0.8%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h3 className="text-lg font-medium mb-4">Report Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      This report provides comprehensive insights into content performance, user engagement with items, and category trends.
                      Generate the full report to access detailed analytics and visualizations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Report Highlights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Content growth and distribution</li>
                          <li>Category performance analysis</li>
                          <li>Most viewed and engaged items</li>
                          <li>Content quality metrics</li>
                          <li>Listing completion rates</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Insights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Electronics category grew by 24%</li>
                          <li>Average item quality score: 8.7/10</li>
                          <li>Featured items get 3.5x more views</li>
                          <li>85% of listings include high-quality images</li>
                          <li>Item descriptions average 120 words</li>
                        </ul>
                      </div>
                    </div>
                    <Button onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        title: "Content Performance Report",
                        description: "Detailed analysis of content engagement and performance"
                      });
                      setIsReportModalOpen(true);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Full Report
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated content reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports
                    .filter(report => report.type === "Content")
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.date).toLocaleDateString()} • {report.format} • {report.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReport(report.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {recentReports.filter(report => report.type === "Content").length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        You haven't generated any content reports yet
                      </p>
                      <Button onClick={() => {
                        setReportConfig({
                          ...reportConfig,
                          title: "Content Performance Report",
                          description: "Detailed analysis of content engagement and performance"
                        });
                        setIsReportModalOpen(true);
                      }}>
                        Generate Report
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Report</CardTitle>
              <CardDescription>
                Analyze platform performance, speed, and reliability metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                    <Skeleton className="h-[150px]" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Avg. Page Load Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">1.8s</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">-0.3s</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">API Response Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">245ms</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">-35ms</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Uptime</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">99.98%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-green-500 font-medium">+0.05%</span> from previous period
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h3 className="text-lg font-medium mb-4">Report Preview</h3>
                    <p className="text-muted-foreground mb-6">
                      This report provides comprehensive insights into platform performance, speed metrics, and reliability indicators.
                      Generate the full report to access detailed analytics and visualizations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Report Highlights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Page load time analysis</li>
                          <li>API performance metrics</li>
                          <li>Error rate and types</li>
                          <li>Server resource utilization</li>
                          <li>Uptime and reliability stats</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Insights:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>14% improvement in page load time</li>
                          <li>API response time reduced by 12%</li>
                          <li>Error rate decreased to 0.8%</li>
                          <li>99.98% platform uptime</li>
                          <li>Mobile performance improved by 18%</li>
                        </ul>
                      </div>
                    </div>
                    <Button onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        title: "Platform Performance Report",
                        description: "Detailed analysis of platform speed and reliability"
                      });
                      setIsReportModalOpen(true);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Full Report
                    </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated performance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports
                    .filter(report => report.type === "Performance")
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(report.date).toLocaleDateString()} • {report.format} • {report.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReport(report.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {recentReports.filter(report => report.type === "Performance").length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        You haven't generated any performance reports yet
                      </p>
                      <Button onClick={() => {
                        setReportConfig({
                          ...reportConfig,
                          title: "Platform Performance Report",
                          description: "Detailed analysis of platform speed and reliability"
                        });
                        setIsReportModalOpen(true);
                      }}>
                        Generate Report
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Generation Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Configure and generate a detailed report
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input 
                id="report-title" 
                value={reportConfig.title} 
                onChange={(e) => updateReportConfig("title", e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea 
                id="report-description" 
                value={reportConfig.description} 
                onChange={(e) => updateReportConfig("description", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Report Sections</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="section-user-growth" 
                    checked={reportConfig.sections.userGrowth}
                    onCheckedChange={(checked) => updateReportSection("userGrowth", checked)}
                  />
                  <Label htmlFor="section-user-growth">User Growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="section-user-engagement" 
                    checked={reportConfig.sections.userEngagement}
                    onCheckedChange={(checked) => updateReportSection("userEngagement", checked)}
                  />
                  <Label htmlFor="section-user-engagement">User Engagement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="section-user-retention" 
                    checked={reportConfig.sections.userRetention}
                    onCheckedChange={(checked) => updateReportSection("userRetention", checked)}
                  />
                  <Label htmlFor="section-user-retention">User Retention</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="section-geo-distribution" 
                    checked={reportConfig.sections.geographicDistribution}
                    onCheckedChange={(checked) => updateReportSection("geographicDistribution", checked)}
                  />
                  <Label htmlFor="section-geo-distribution">Geographic Distribution</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-format">Format</Label>
                <Select 
                  value={reportConfig.format} 
                  onValueChange={(value) => updateReportConfig("format", value)}
                >
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-schedule">Schedule</Label>
                <Select 
                  value={reportConfig.schedule} 
                  onValueChange={(value) => updateReportConfig("schedule", value)}
                >
                  <SelectTrigger id="report-schedule">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Generate Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-recipients">Email Recipients (Optional)</Label>
              <Input 
                id="report-recipients" 
                placeholder="email@example.com, another@example.com" 
                value={reportConfig.recipients} 
                onChange={(e) => updateReportConfig("recipients", e.target.value)} 
              />
              <p className="text-xs text-muted-foreground">
                Enter email addresses separated by commas to automatically send the report
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

