"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  MessageSquare,
  Flag,
  ShieldAlert,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ItemDetails } from "@/components/moderation/item-details"
import { DisputeDetails } from "@/components/moderation/dispute-details"
import { ModerationSettings } from "@/components/moderation/moderation-settings"
import { FieldAdder } from "@/components/field-adder"

export default function ModerationPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [flagTypeFilter, setFlagTypeFilter] = useState("all")
  const [items, setItems] = useState([])
  const [disputes, setDisputes] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [filteredDisputes, setFilteredDisputes] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [showDisputeDetails, setShowDisputeDetails] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Simulate API call for items
    const fetchItems = () => {
      const mockItems = [
        {
          id: "1",
          name: "iPhone 14 Pro",
          description: "Mint condition iPhone 14 Pro with 256GB storage",
          category: "Mobile Phones & Tablets",
          categoryIcon: "📱",
          status: "Pending",
          submittedBy: "john_doe",
          submittedDate: "2024-01-14",
          flagged: false,
          flagReason: null,
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$900",
          location: "New York, NY",
        },
        {
          id: "2",
          name: "Leather Sofa",
          description: "Genuine leather sofa in excellent condition",
          category: "Home, Furniture & Appliances",
          categoryIcon: "🛋️",
          status: "Pending",
          submittedBy: "jane_smith",
          submittedDate: "2024-01-13",
          flagged: false,
          flagReason: null,
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$800",
          location: "Los Angeles, CA",
        },
        {
          id: "3",
          name: "Fake Designer Handbag",
          description: "Designer handbag, great quality",
          category: "Fashion",
          categoryIcon: "👗",
          status: "Flagged",
          submittedBy: "bob_johnson",
          submittedDate: "2024-01-12",
          flagged: true,
          flagReason: "Counterfeit goods",
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$150",
          location: "Miami, FL",
        },
        {
          id: "4",
          name: "Prohibited Item",
          description: "This item violates platform policies",
          category: "Other",
          categoryIcon: "📦",
          status: "Rejected",
          submittedBy: "alice_brown",
          submittedDate: "2024-01-11",
          flagged: true,
          flagReason: "Prohibited item",
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$50",
          location: "Chicago, IL",
        },
        {
          id: "5",
          name: "Toyota Camry 2020",
          description: "Excellent condition Toyota Camry with low mileage",
          category: "Vehicles",
          categoryIcon: "🚗",
          status: "Approved",
          submittedBy: "charlie_wilson",
          submittedDate: "2024-01-10",
          flagged: false,
          flagReason: null,
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$15,000",
          location: "Houston, TX",
        },
        {
          id: "6",
          name: "Suspicious Electronics",
          description: "Brand new electronics at very low prices",
          category: "Electronics",
          categoryIcon: "💻",
          status: "Flagged",
          submittedBy: "david_miller",
          submittedDate: "2024-01-09",
          flagged: true,
          flagReason: "Suspicious pricing",
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$100",
          location: "Phoenix, AZ",
        },
        {
          id: "7",
          name: "Gaming Console",
          description: "Latest gaming console with controllers",
          category: "Electronics",
          categoryIcon: "💻",
          status: "Pending",
          submittedBy: "eva_garcia",
          submittedDate: "2024-01-08",
          flagged: false,
          flagReason: null,
          images: ["/placeholder.svg?height=300&width=400"],
          price: "$450",
          location: "Seattle, WA",
        },
      ]
      setItems(mockItems)
      setFilteredItems(mockItems)
    }

    // Simulate API call for disputes
    const fetchDisputes = () => {
      const mockDisputes = [
        {
          id: "1",
          itemName: "MacBook Pro 2023",
          disputeType: "Item Not As Described",
          status: "Open",
          reportedBy: "john_doe",
          reportedAgainst: "jane_smith",
          reportDate: "2024-01-14",
          description: "The laptop has significant scratches not shown in the photos",
          evidence: ["/placeholder.svg?height=300&width=400"],
          severity: "Medium",
        },
        {
          id: "2",
          itemName: "Vintage Bicycle",
          disputeType: "Swap Agreement Violation",
          status: "Open",
          reportedBy: "bob_johnson",
          reportedAgainst: "alice_brown",
          reportDate: "2024-01-13",
          description: "Seller backed out after we agreed to swap",
          evidence: [],
          severity: "Low",
        },
        {
          id: "3",
          itemName: "iPhone 12",
          disputeType: "Counterfeit Item",
          status: "Under Review",
          reportedBy: "charlie_wilson",
          reportedAgainst: "david_miller",
          reportDate: "2024-01-12",
          description: "The iPhone is a fake, not an authentic Apple product",
          evidence: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
          severity: "High",
        },
        {
          id: "4",
          itemName: "Designer Handbag",
          disputeType: "Scam Attempt",
          status: "Resolved",
          reportedBy: "eva_garcia",
          reportedAgainst: "frank_lopez",
          reportDate: "2024-01-11",
          description: "Seller tried to get payment outside the platform",
          evidence: ["/placeholder.svg?height=300&width=400"],
          severity: "High",
        },
        {
          id: "5",
          itemName: "Gaming Console",
          disputeType: "Item Not Received",
          status: "Open",
          reportedBy: "grace_kim",
          reportedAgainst: "henry_chen",
          reportDate: "2024-01-10",
          description: "Never received the item after completing the swap",
          evidence: [],
          severity: "Medium",
        },
      ]
      setDisputes(mockDisputes)
      setFilteredDisputes(mockDisputes)
    }

    fetchItems()
    fetchDisputes()
  }, [])

  useEffect(() => {
    // Filter items based on search query, category filter, and active tab
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Filter based on active tab
    if (activeTab === "pending") {
      filtered = filtered.filter((item) => item.status === "Pending")
    } else if (activeTab === "flagged") {
      filtered = filtered.filter((item) => item.flagged)
    } else if (activeTab === "approved") {
      filtered = filtered.filter((item) => item.status === "Approved")
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((item) => item.status === "Rejected")
    }

    setFilteredItems(filtered)

    // Filter disputes based on search query and flag type filter
    let filteredDisp = disputes

    if (searchQuery) {
      filteredDisp = filteredDisp.filter((dispute) =>
        Object.values(dispute).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }

    if (flagTypeFilter !== "all") {
      filteredDisp = filteredDisp.filter((dispute) => dispute.disputeType === flagTypeFilter)
    }

    // Filter based on active tab
    if (activeTab === "disputes") {
      filteredDisp = filteredDisp.filter((dispute) => dispute.status !== "Resolved")
    }

    setFilteredDisputes(filteredDisp)
  }, [searchQuery, categoryFilter, flagTypeFilter, activeTab, items, disputes])

  if (!mounted) {
    return null
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setShowItemDetails(true)
  }

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute)
    setShowDisputeDetails(true)
  }

  const handleApproveItem = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: "Approved", flagged: false, flagReason: null } : item,
      ),
    )
  }

  const handleRejectItem = (itemId) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Rejected" } : item)))
  }

  const handleResolveDispute = (disputeId) => {
    setDisputes((prev) =>
      prev.map((dispute) => (dispute.id === disputeId ? { ...dispute, status: "Resolved" } : dispute)),
    )
  }

  const itemColumns = [
    {
      accessorKey: "categoryIcon",
      header: "",
      cell: ({ row }) => <span className="text-xl">{row.getValue("categoryIcon")}</span>,
    },
    {
      accessorKey: "name",
      header: "Item Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "submittedBy",
      header: "Submitted By",
    },
    {
      accessorKey: "submittedDate",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Approved":
            badgeClass = "bg-green-500"
            break
          case "Rejected":
            badgeClass = "bg-red-500"
            break
          case "Pending":
            badgeClass = "bg-yellow-500"
            break
          case "Flagged":
            badgeClass = "bg-orange-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      accessorKey: "flagged",
      header: "Flagged",
      cell: ({ row }) => {
        const flagged = row.getValue("flagged")
        const flagReason = row.original.flagReason

        return flagged ? (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-xs text-red-500">{flagReason}</span>
          </div>
        ) : (
          <span>No</span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const isApproved = item.status === "Approved"
        const isRejected = item.status === "Rejected"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewItem(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isApproved ? "Approved" : "Approve"}
              onClick={() => handleApproveItem(item.id)}
              disabled={isApproved}
            >
              <CheckCircle className={`h-4 w-4 ${isApproved ? "text-green-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isRejected ? "Rejected" : "Reject"}
              onClick={() => handleRejectItem(item.id)}
              disabled={isRejected}
            >
              <XCircle className={`h-4 w-4 ${isRejected ? "text-red-500" : ""}`} />
            </Button>
          </div>
        )
      },
    },
  ]

  const disputeColumns = [
    {
      accessorKey: "itemName",
      header: "Item",
    },
    {
      accessorKey: "disputeType",
      header: "Dispute Type",
    },
    {
      accessorKey: "reportedBy",
      header: "Reported By",
    },
    {
      accessorKey: "reportedAgainst",
      header: "Reported Against",
    },
    {
      accessorKey: "reportDate",
      header: "Date",
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity")
        let badgeClass = ""

        switch (severity) {
          case "High":
            badgeClass = "bg-red-500"
            break
          case "Medium":
            badgeClass = "bg-orange-500"
            break
          case "Low":
            badgeClass = "bg-yellow-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{severity}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Open":
            badgeClass = "bg-yellow-500"
            break
          case "Under Review":
            badgeClass = "bg-blue-500"
            break
          case "Resolved":
            badgeClass = "bg-green-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const dispute = row.original
        const isResolved = dispute.status === "Resolved"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewDispute(dispute)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Message Users">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={isResolved ? "Resolved" : "Resolve"}
              onClick={() => handleResolveDispute(dispute.id)}
              disabled={isResolved}
            >
              <CheckCircle className={`h-4 w-4 ${isResolved ? "text-green-500" : ""}`} />
            </Button>
          </div>
        )
      },
    },
  ]

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Vehicles", name: "Vehicles", icon: "🚗" },
    { id: "Electronics", name: "Electronics", icon: "💻" },
    { id: "Mobile Phones & Tablets", name: "Mobile Phones & Tablets", icon: "📱" },
    { id: "Home, Furniture & Appliances", name: "Home, Furniture & Appliances", icon: "🛋️" },
    { id: "Fashion", name: "Fashion", icon: "👗" },
    { id: "Other", name: "Other", icon: "📦" },
  ]

  const disputeTypes = [
    { id: "all", name: "All Types" },
    { id: "Item Not As Described", name: "Item Not As Described" },
    { id: "Swap Agreement Violation", name: "Swap Agreement Violation" },
    { id: "Counterfeit Item", name: "Counterfeit Item" },
    { id: "Scam Attempt", name: "Scam Attempt" },
    { id: "Item Not Received", name: "Item Not Received" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">Review and moderate items, disputes, and user content</p>
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
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter((i) => i.status === "Pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter((i) => i.flagged).length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disputes.filter((d) => d.status !== "Resolved").length}</div>
            <p className="text-xs text-muted-foreground">Unresolved disputes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Flagged</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Flagged by AI system</p>
          </CardContent>
        </Card>
      </div>

      {showItemDetails ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Item Details: {selectedItem.name}</CardTitle>
              <CardDescription>Item ID: {selectedItem.id}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowItemDetails(false)}>
              Back to Items
            </Button>
          </CardHeader>
          <CardContent>
            <ItemDetails
              item={selectedItem}
              onApprove={() => {
                handleApproveItem(selectedItem.id)
                setShowItemDetails(false)
              }}
              onReject={() => {
                handleRejectItem(selectedItem.id)
                setShowItemDetails(false)
              }}
            />
          </CardContent>
        </Card>
      ) : showDisputeDetails ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dispute Details: {selectedDispute.itemName}</CardTitle>
              <CardDescription>Dispute ID: {selectedDispute.id}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowDisputeDetails(false)}>
              Back to Disputes
            </Button>
          </CardHeader>
          <CardContent>
            <DisputeDetails
              dispute={selectedDispute}
              onResolve={() => {
                handleResolveDispute(selectedDispute.id)
                setShowDisputeDetails(false)
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="pending">Pending Items</TabsTrigger>
              <TabsTrigger value="flagged">Flagged Items</TabsTrigger>
              <TabsTrigger value="approved">Approved Items</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Items</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 pt-4">
              {activeTab !== "disputes" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {activeTab === "pending"
                        ? "Pending"
                        : activeTab === "flagged"
                          ? "Flagged"
                          : activeTab === "approved"
                            ? "Approved"
                            : "Rejected"}{" "}
                      Items
                    </CardTitle>
                    <CardDescription>
                      {activeTab === "pending"
                        ? "Items awaiting moderation"
                        : activeTab === "flagged"
                          ? "Items flagged for review"
                          : activeTab === "approved"
                            ? "Items that have been approved"
                            : "Items that have been rejected"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search items..."
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
                              Category: {categoryFilter === "all" ? "All" : categoryFilter}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {categories.map((category) => (
                              <DropdownMenuItem key={category.id} onClick={() => setCategoryFilter(category.id)}>
                                {category.icon && <span className="mr-2">{category.icon}</span>}
                                {category.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <DataTable columns={itemColumns} data={filteredItems} />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Disputes</CardTitle>
                    <CardDescription>User reported disputes requiring moderation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search disputes..."
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
                              Type: {flagTypeFilter === "all" ? "All" : flagTypeFilter}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {disputeTypes.map((type) => (
                              <DropdownMenuItem key={type.id} onClick={() => setFlagTypeFilter(type.id)}>
                                {type.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <DataTable columns={disputeColumns} data={filteredDisputes} />
                  </CardContent>
                </Card>
              )}

              {activeTab !== "disputes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bulk Actions</CardTitle>
                      <CardDescription>Perform actions on multiple items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Selected
                          </Button>
                          <Button variant="outline" className="w-full">
                            <XCircle className="mr-2 h-4 w-4" /> Reject Selected
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Flag className="mr-2 h-4 w-4" /> Flag Selected
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Moderation Settings</CardTitle>
                      <CardDescription>Configure content moderation rules</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ModerationSettings />
                      <div className="mt-4">
                        <FieldAdder
                          entityName="Items"
                          onAddField={(field) => {
                            // In a real app, this would call an API to add the field
                            alert(`Added new field: ${field.label} (${field.type})`)
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

