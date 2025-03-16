"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, RefreshCw } from "lucide-react"

export function ReportGenerator() {
  const [reportType, setReportType] = useState("user-activity")
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })
  const [format, setFormat] = useState("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      alert(`Generated ${reportType} report in ${format} format`)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>Configure and generate detailed reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user-activity">User Activity</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="advertisements">Advertisements</SelectItem>
                <SelectItem value="platform-performance">Platform Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="include-charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
              <Label htmlFor="include-charts">Include Charts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="include-raw-data" checked={includeRawData} onCheckedChange={setIncludeRawData} />
              <Label htmlFor="include-raw-data">Include Raw Data</Label>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

