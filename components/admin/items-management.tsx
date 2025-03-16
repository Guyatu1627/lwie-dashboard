"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FieldAdder } from "@/components/field-adder"
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"

// Mock data for items
const mockItems = [
  {
    id: "item-001",
    name: "iPhone 14 Pro",
    category: "Electronics",
    status: "Active",
    owner: "john_doe",
    createdAt: "2024-01-15T10:30:00Z",
    views: 245,
    swapRequests: 12,
  },
  {
    id: "item-002",
    name: "Leather Sofa",
    category: "Furniture",
    status: "Active",
    owner: "jane_smith",
    createdAt: "2024-01-14T14:45:00Z",
    views: 180,
    swapRequests: 8,
  },
  {
    id: "item-003",
    name: "Mountain Bike",
    category: "Sports",
    status: "Pending",
    owner: "bob_johnson",
    createdAt: "2024-01-16T09:15:00Z",
    views: 120,
    swapRequests: 5,
  },
  {
    id: "item-004",
    name: "Designer Handbag",
    category: "Fashion",
    status: "Inactive",
    owner: "alice_brown",
    createdAt: "2024-01-13T11:20:00Z",
    views: 90,
    swapRequests: 3,
  },
  {
    id: "item-005",
    name: "Gaming Console",
    category: "Electronics",
    status: "Active",
    owner: "charlie_wilson",
    createdAt: "2024-01-12T16:30:00Z",
    views: 210,
    swapRequests: 10,
  },
]

export function ItemsManagement() {
  const [items, setItems] = useState(mockItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    description: "",
  })

  // Filter items based on search query, category filter, status filter, and active tab
  const filteredItems = items.filter((item) => {
    // Search filter
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.owner.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (categoryFilter !== "all" && item.category !== categoryFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false
    }

    // Tab filter
    if (activeTab === "active" && item.status !== "Active") {
      return false
    } else if (activeTab === "pending" && item.status !== "Pending") {
      return false
    } else if (activeTab === "inactive" && item.status !== "Inactive") {
      return false
    }

    return true
  })

  const handleAddItem = () => {
    const item = {
      id: `item-${Math.floor(Math.random() * 1000)}`,
      name: newItem.name,
      category: newItem.category,
      status: "Pending",
      owner: "admin_user",
      createdAt: new Date().toISOString(),
      views: 0,
      swapRequests: 0,
    }

    setItems([...items, item])
    setNewItem({ name: "", category: "", description: "" })
    setIsAddingItem(false)
  }

  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleApproveItem = (itemId) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, status: "Active" } : item)))
  }

  const handleRejectItem = (itemId) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, status: "Inactive" } : item)))
  }

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "owner",
      header: "Owner",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Active":
            badgeClass = "bg-green-500"
            break
          case "Pending":
            badgeClass = "bg-yellow-500"
            break
          case "Inactive":
            badgeClass = "bg-gray-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "swapRequests",
      header: "Swap Requests",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const isPending = item.status === "Pending"

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Approve"
                  onClick={() => handleApproveItem(item.id)}
                  className="text-green-500 hover:text-green-700 hover:bg-green-100"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Reject"
                  onClick={() => handleRejectItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Items Management</h1>
          <p className="text-muted-foreground">Manage and moderate items on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>Create a new item to be listed on the platform.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Vehicles">Vehicles</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Enter item description"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row md:items-center gap-4 my-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <DataTable columns={columns} data={filteredItems} pagination={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>Add custom fields to collect additional information for items</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldAdder
            entityName="Items"
            onAddField={(field) => {
              // In a real app, this would call an API to add the field
              alert(`Added new field to items: ${field.label} (${field.type})`)
            }}
          />

          <div className="mt-4 border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Current Custom Fields</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Condition</p>
                  <p className="text-xs text-muted-foreground">Select field (New, Like New, Good, Fair, Poor)</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Brand</p>
                  <p className="text-xs text-muted-foreground">Text field</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Year of Manufacture</p>
                  <p className="text-xs text-muted-foreground">Number field</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

