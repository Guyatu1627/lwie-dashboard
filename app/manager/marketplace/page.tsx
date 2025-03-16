"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  ShoppingCart,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  X,
} from "lucide-react"

// Mock marketplace item data
const mockItems = [
  {
    id: "item1",
    name: "Vintage Camera",
    category: "Electronics",
    condition: "Used - Good",
    status: "Active",
    featured: true,
    price: "$120",
    owner: "John Smith",
    listDate: "2024-01-10",
    viewCount: 345,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item2",
    name: "Mountain Bike",
    category: "Sports",
    condition: "Used - Like New",
    status: "Active",
    featured: false,
    price: "$350",
    owner: "Emily Johnson",
    listDate: "2024-01-15",
    viewCount: 278,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item3",
    name: "Antique Desk Lamp",
    category: "Home",
    condition: "Used - Fair",
    status: "Active",
    featured: false,
    price: "$65",
    owner: "Michael Brown",
    listDate: "2024-01-18",
    viewCount: 156,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item4",
    name: "Designer Watch",
    category: "Fashion",
    condition: "Used - Good",
    status: "Pending",
    featured: false,
    price: "$210",
    owner: "Sophia Garcia",
    listDate: "2024-01-20",
    viewCount: 0,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item5",
    name: "Comic Book Collection",
    category: "Collectibles",
    condition: "Used - Good",
    status: "Active",
    featured: true,
    price: "$90",
    owner: "William Lee",
    listDate: "2024-01-08",
    viewCount: 562,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item6",
    name: "Gaming Console",
    category: "Electronics",
    condition: "Used - Excellent",
    status: "Active",
    featured: false,
    price: "$280",
    owner: "Olivia Wilson",
    listDate: "2024-01-12",
    viewCount: 420,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item7",
    name: "Acoustic Guitar",
    category: "Music",
    condition: "Used - Good",
    status: "Active",
    featured: false,
    price: "$175",
    owner: "James Taylor",
    listDate: "2024-01-16",
    viewCount: 198,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item8",
    name: "Handcrafted Pottery Set",
    category: "Home",
    condition: "New",
    status: "Pending",
    featured: false,
    price: "$85",
    owner: "Isabella Martinez",
    listDate: "2024-01-22",
    viewCount: 0,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item9",
    name: "Science Fiction Book Collection",
    category: "Books",
    condition: "Used - Good",
    status: "Rejected",
    featured: false,
    price: "$55",
    owner: "Ethan Anderson",
    listDate: "2024-01-19",
    viewCount: 0,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "item10",
    name: "Professional Camera Lens",
    category: "Electronics",
    condition: "Used - Like New",
    status: "Active",
    featured: true,
    price: "$450",
    owner: "Charlotte Thompson",
    listDate: "2024-01-05",
    viewCount: 687,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedItem, setEditedItem] = useState(null)

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setItems(mockItems)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter items based on search and filter criteria
  const filteredItems = items.filter((item) => {
    // Search query filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (categoryFilter !== "all" && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    // Tab filter
    if (currentTab === "featured" && !item.featured) return false
    if (currentTab === "pending" && item.status !== "Pending") return false
    if (currentTab === "rejected" && item.status !== "Rejected") return false

    return true
  })

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      // Refresh data by updating view counts randomly
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          viewCount: item.status === "Active" ? item.viewCount + Math.floor(Math.random() * 10) : item.viewCount,
        })),
      )

      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Marketplace data has been updated",
      })
    }, 1500)
  }

  // Handle item operation
  const handleItemOperation = (operation, itemId) => {
    // Find the item
    const item = items.find((i) => i.id === itemId)

    if (!item) return

    // Simulate API call
    toast({
      title: `${operation} item`,
      description: `${operation} operation started for ${item.name}`,
    })

    // Update UI based on operation
    setTimeout(() => {
      if (operation === "View") {
        setSelectedItem(item)
        setIsItemDialogOpen(true)
      } else if (operation === "Edit") {
        setSelectedItem(item)
        setEditedItem({ ...item })
        setIsEditMode(true)
        setIsItemDialogOpen(true)
      } else if (operation === "Approve") {
        setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status: "Active" } : i)))
        toast({
          title: "Item approved",
          description: `${item.name} has been approved and published`,
        })
      } else if (operation === "Reject") {
        setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status: "Rejected" } : i)))
        toast({
          title: "Item rejected",
          description: `${item.name} has been rejected`,
        })
      } else if (operation === "Feature") {
        setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, featured: true } : i)))
        toast({
          title: "Item featured",
          description: `${item.name} has been featured`,
        })
      } else if (operation === "Unfeature") {
        setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, featured: false } : i)))
        toast({
          title: "Item unfeatured",
          description: `${item.name} has been removed from featured items`,
        })
      } else if (operation === "Delete") {
        setItems((prev) => prev.filter((i) => i.id !== itemId))
        toast({
          title: "Item deleted",
          description: `${item.name} has been deleted`,
        })
      }
    }, 500)
  }

  // Handle item save
  const handleSaveItem = () => {
    if (!editedItem) return

    // Simulate API call
    toast({
      title: "Saving changes",
      description: "Updating item information...",
    })

    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === editedItem.id ? editedItem : i)))

      setIsItemDialogOpen(false)
      setIsEditMode(false)
      setEditedItem(null)

      toast({
        title: "Item updated",
        description: "Item information has been updated successfully",
      })
    }, 1000)
  }

  // Handle edited item field change
  const handleEditedItemChange = (field, value) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace Management</h1>
          <p className="text-muted-foreground">Manage and oversee all items in the marketplace</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh data">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="w-full md:w-[240px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="collectibles">Collectibles</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="books">Books</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-[200px] rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between items-center mt-2">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-9 w-9 rounded-md" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center border rounded-lg p-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground text-center mt-1">
                No items match your current search and filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter("all")
                  setStatusFilter("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-[200px] object-cover"
                      />
                      {item.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                      )}
                      <Badge
                        className={`absolute top-2 right-2 ${
                          item.status === "Active"
                            ? "bg-green-500 hover:bg-green-600"
                            : item.status === "Pending"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="bg-muted">
                          {item.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.viewCount} views</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{item.price}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleItemOperation("View", item.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleItemOperation("Edit", item.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Item
                            </DropdownMenuItem>
                            {item.status === "Pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleItemOperation("Approve", item.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleItemOperation("Reject", item.id)}>
                                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {!item.featured && item.status === "Active" ? (
                              <DropdownMenuItem onClick={() => handleItemOperation("Feature", item.id)}>
                                <Tag className="mr-2 h-4 w-4 text-yellow-500" />
                                Feature Item
                              </DropdownMenuItem>
                            ) : (
                              item.featured && (
                                <DropdownMenuItem onClick={() => handleItemOperation("Unfeature", item.id)}>
                                  <Tag className="mr-2 h-4 w-4" />
                                  Remove Feature
                                </DropdownMenuItem>
                              )
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Item
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will permanently delete this item and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleItemOperation("Delete", item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Item Details Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Item" : "Item Details"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modify item details and save changes" : "View detailed information about this item"}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="grid gap-4 py-4">
              {isEditMode ? (
                // Edit mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Item Name</Label>
                    <Input
                      id="edit-name"
                      value={editedItem.name}
                      onChange={(e) => handleEditedItemChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editedItem.category}
                      onValueChange={(value) => handleEditedItemChange("category", value)}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Collectibles">Collectibles</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      value={editedItem.price.replace("$", "")}
                      onChange={(e) => handleEditedItemChange("price", `$${e.target.value}`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-condition">Condition</Label>
                    <Select
                      value={editedItem.condition}
                      onValueChange={(value) => handleEditedItemChange("condition", value)}
                    >
                      <SelectTrigger id="edit-condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                        <SelectItem value="Used - Good">Used - Good</SelectItem>
                        <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                        <SelectItem value="Used - Poor">Used - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editedItem.status}
                      onValueChange={(value) => handleEditedItemChange("status", value)}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-featured"
                      checked={editedItem.featured}
                      onCheckedChange={(checked) => handleEditedItemChange("featured", checked)}
                    />
                    <Label htmlFor="edit-featured">Featured Item</Label>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.name}
                      className="w-full sm:w-1/3 h-[200px] object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge
                          className={
                            selectedItem.status === "Active"
                              ? "bg-green-500 hover:bg-green-600"
                              : selectedItem.status === "Pending"
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {selectedItem.status}
                        </Badge>
                        <Badge variant="outline">{selectedItem.category}</Badge>
                        {selectedItem.featured && <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-medium">{selectedItem.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Condition</p>
                          <p>{selectedItem.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Owner</p>
                          <p>{selectedItem.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Listed On</p>
                          <p>{new Date(selectedItem.listDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Item Statistics</h4>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="font-medium">{selectedItem.viewCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                        <p className="font-medium">0</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Swap Offers</p>
                        <p className="font-medium">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false)
                    setEditedItem(null)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveItem}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditedItem({ ...selectedItem })
                    setIsEditMode(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

