"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SwapDetails } from "@/components/swaps/swap-details"
import { SwapTimeline } from "@/components/swaps/swap-timeline"
import { SwapStatistics } from "@/components/swaps/swap-statistics"
import { FieldAdder } from "@/components/field-adder"

export default function SwapsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [swaps, setSwaps] = useState([])
  const [filteredSwaps, setFilteredSwaps] = useState([])
  const [selectedSwap, setSelectedSwap] = useState(null)
  const [showSwapDetails, setShowSwapDetails] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Simulate API call for swaps
    const fetchSwaps = () => {
      const mockSwaps = [
        {
          id: "1",
          item1: "iPhone 14 Pro",
          item1Category: "Mobile Phones & Tablets",
          item1Owner: "john_doe",
          item2: "MacBook Air",
          item2Category: "Electronics",
          item2Owner: "jane_smith",
          status: "Pending",
          initiatedDate: "2024-01-14",
          completedDate: null,
          location: "New York, NY",
          value: "$1,200",
          messages: 5,
          hasDispute: false,
        },
        {
          id: "2",
          item1: "Leather Sofa",
          item1Category: "Home, Furniture & Appliances",
          item1Owner: "bob_johnson",
          item2: "Dining Table Set",
          item2Category: "Home, Furniture & Appliances",
          item2Owner: "alice_brown",
          status: "In Progress",
          initiatedDate: "2024-01-13",
          completedDate: null,
          location: "Los Angeles, CA",
          value: "$900",
          messages: 8,
          hasDispute: false,
        },
        {
          id: "3",
          item1: "Vintage Bicycle",
          item1Category: "Vehicles",
          item1Owner: "charlie_wilson",
          item2: "Gaming Console",
          item2Category: "Electronics",
          item2Owner: "david_miller",
          status: "Completed",
          initiatedDate: "2024-01-12",
          completedDate: "2024-01-14",
          location: "Chicago, IL",
          value: "$350",
          messages: 3,
          hasDispute: false,
        },
        {
          id: "4",
          item1: "Designer Handbag",
          item1Category: "Fashion",
          item1Owner: "eva_garcia",
          item2: "Smartphone",
          item2Category: "Mobile Phones & Tablets",
          item2Owner: "frank_lopez",
          status: "Disputed",
          initiatedDate: "2024-01-11",
          completedDate: null,
          location: "Miami, FL",
          value: "$500",
          messages: 12,
          hasDispute: true,
          disputeReason: "Item not as described",
        },
        {
          id: "5",
          item1: "Mountain Bike",
          item1Category: "Sports & Outdoors",
          item1Owner: "grace_kim",
          item2: "Laptop",
          item2Category: "Electronics",
          item2Owner: "henry_chen",
          status: "Cancelled",
          initiatedDate: "2024-01-10",
          completedDate: "2024-01-11",
          location: "Seattle, WA",
          value: "$600",
          messages: 4,
          hasDispute: false,
        },
        {
          id: "6",
          item1: "Professional Camera",
          item1Category: "Electronics",
          item1Owner: "isabel_rodriguez",
          item2: "Drone",
          item2Category: "Electronics",
          item2Owner: "jack_williams",
          status: "In Progress",
          initiatedDate: "2024-01-09",
          completedDate: null,
          location: "Austin, TX",
          value: "$800",
          messages: 7,
          hasDispute: false,
        },
        {
          id: "7",
          item1: "Electric Guitar",
          item1Category: "Musical Instruments",
          item1Owner: "karen_taylor",
          item2: "Amplifier",
          item2Category: "Musical Instruments",
          item2Owner: "leo_martinez",
          status: "Pending",
          initiatedDate: "2024-01-08",
          completedDate: null,
          location: "Nashville, TN",
          value: "$450",
          messages: 2,
          hasDispute: false,
        },
      ]
      setSwaps(mockSwaps)
      setFilteredSwaps(mockSwaps)
    }

    fetchSwaps()
  }, [])

  useEffect(() => {
    // Filter swaps based on search query, status filter, and active tab
    let filtered = swaps

    if (searchQuery) {
      filtered = filtered.filter((swap) =>
        Object.values(swap).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((swap) => swap.status === statusFilter)
    }

    // Filter based on active tab
    if (activeTab === "active") {
      filtered = filtered.filter((swap) => ["Pending", "In Progress"].includes(swap.status))
    } else if (activeTab === "completed") {
      filtered = filtered.filter((swap) => swap.status === "Completed")
    } else if (activeTab === "disputed") {
      filtered = filtered.filter((swap) => swap.hasDispute || swap.status === "Disputed")
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter((swap) => swap.status === "Cancelled")
    }

    setFilteredSwaps(filtered)
  }, [searchQuery, statusFilter, activeTab, swaps])

  if (!mounted) {
    return null
  }

  const handleViewSwap = (swap) => {
    setSelectedSwap(swap)
    setShowSwapDetails(true)
  }

  const handleApproveSwap = (swapId) => {
    setSwaps((prev) =>
      prev.map((swap) =>
        swap.id === swapId
          ? { ...swap, status: "Completed", completedDate: new Date().toISOString().split("T")[0] }
          : swap,
      ),
    )
  }

  const handleCancelSwap = (swapId) => {
    setSwaps((prev) =>
      prev.map((swap) =>
        swap.id === swapId
          ? { ...swap, status: "Cancelled", completedDate: new Date().toISOString().split("T")[0] }
          : swap,
      ),
    )
  }

  const swapColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue("id")}</span>,
    },
    {
      accessorKey: "item1",
      header: "Item 1",
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("item1")}</div>
          <div className="text-xs text-muted-foreground">{row.original.item1Owner}</div>
        </div>
      ),
    },
    {
      accessorKey: "item2",
      header: "Item 2",
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("item2")}</div>
          <div className="text-xs text-muted-foreground">{row.original.item2Owner}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Completed":
            badgeClass = "bg-green-500"
            break
          case "Cancelled":
            badgeClass = "bg-red-500"
            break
          case "Pending":
            badgeClass = "bg-yellow-500"
            break
          case "In Progress":
            badgeClass = "bg-blue-500"
            break
          case "Disputed":
            badgeClass = "bg-orange-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      accessorKey: "initiatedDate",
      header: "Initiated",
    },
    {
      accessorKey: "value",
      header: "Value",
    },
    {
      accessorKey: "hasDispute",
      header: "Dispute",
      cell: ({ row }) => {
        const hasDispute = row.getValue("hasDispute")
        return hasDispute ? (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-xs text-red-500">Yes</span>
          </div>
        ) : (
          <span>No</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const swap = row.original
        const isCompleted = swap.status === "Completed"
        const isCancelled = swap.status === "Cancelled"
        const isDisputed = swap.status === "Disputed"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewSwap(swap)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Message Users">
              <MessageSquare className="h-4 w-4" />
            </Button>
            {!isCompleted && !isCancelled && !isDisputed && (
              <>
                <Button variant="ghost" size="icon" title="Approve Swap" onClick={() => handleApproveSwap(swap.id)}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Cancel Swap" onClick={() => handleCancelSwap(swap.id)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Swap Management</h1>
          <p className="text-muted-foreground">Monitor and manage item swaps between users</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Swaps</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {swaps.filter((s) => ["Pending", "In Progress"].includes(s.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{swaps.filter((s) => s.status === "Completed").length}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputed Swaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {swaps.filter((s) => s.hasDispute || s.status === "Disputed").length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring intervention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((swaps.filter((s) => s.status === "Completed").length / swaps.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {showSwapDetails ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Swap Details: #{selectedSwap.id}</CardTitle>
              <CardDescription>
                {selectedSwap.item1} ↔️ {selectedSwap.item2}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowSwapDetails(false)}>
              Back to Swaps
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <SwapDetails
                  swap={selectedSwap}
                  onApprove={() => {
                    handleApproveSwap(selectedSwap.id)
                    setShowSwapDetails(false)
                  }}
                  onCancel={() => {
                    handleCancelSwap(selectedSwap.id)
                    setShowSwapDetails(false)
                  }}
                />
              </TabsContent>
              <TabsContent value="timeline" className="space-y-4 pt-4">
                <SwapTimeline swapId={selectedSwap.id} />
              </TabsContent>
              <TabsContent value="messages" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Swap Messages</CardTitle>
                    <CardDescription>Communication between swap participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Message History</h3>
                      <p className="text-muted-foreground mb-4">
                        This swap has {selectedSwap.messages} messages between participants.
                      </p>
                      <Button>View Message Thread</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="active">Active Swaps</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === "active"
                      ? "Active"
                      : activeTab === "completed"
                        ? "Completed"
                        : activeTab === "disputed"
                          ? "Disputed"
                          : "Cancelled"}{" "}
                    Swaps
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "active"
                      ? "Currently active swaps between users"
                      : activeTab === "completed"
                        ? "Successfully completed swaps"
                        : activeTab === "disputed"
                          ? "Swaps with disputes requiring intervention"
                          : "Swaps that were cancelled"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search swaps..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Status: {statusFilter === "all" ? "All" : statusFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("Disputed")}>Disputed</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setStatusFilter("Cancelled")}>Cancelled</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <DataTable columns={swapColumns} data={filteredSwaps} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest swap activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">New swap initiated</p>
                          <p className="text-sm text-muted-foreground">iPhone 14 Pro ↔️ MacBook Air</p>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="font-medium">Swap completed</p>
                          <p className="text-sm text-muted-foreground">Vintage Bicycle ↔️ Gaming Console</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-300" />
                        </div>
                        <div>
                          <p className="font-medium">Dispute reported</p>
                          <p className="text-sm text-muted-foreground">Designer Handbag ↔️ Smartphone</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Swap Statistics</CardTitle>
                    <CardDescription>Performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SwapStatistics />
                    <div className="mt-4">
                      <FieldAdder
                        entityName="Swaps"
                        onAddField={(field) => {
                          // In a real app, this would call an API to add the field
                          alert(`Added new field to swaps: ${field.label} (${field.type})`)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

