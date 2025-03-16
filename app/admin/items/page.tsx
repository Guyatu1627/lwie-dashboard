"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Plus, ChevronRight, Pencil, Trash2, CheckCircle, XCircle, Filter } from "lucide-react"
import { DynamicItemForm } from "@/components/forms/dynamic-item-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FieldAdder } from "@/components/field-adder"
import { Separator } from "@/components/ui/separator"

export default function ItemsPage() {
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for categories
    const fetchCategories = () => {
      const mockCategories = [
        {
          id: "vehicles",
          name: "Vehicles",
          description: "Cars, Motorcycles, Bicycles, Boats, Spare Parts, Accessories",
          icon: "🚗",
          fields: [
            { name: "make", label: "Make & Model", type: "text", required: true },
            { name: "year", label: "Year of Manufacture", type: "number", required: true },
            { name: "mileage", label: "Mileage", type: "number", required: true },
            {
              name: "fuelType",
              label: "Fuel Type",
              type: "select",
              required: true,
              options: ["Petrol", "Diesel", "Hybrid", "Electric"],
            },
            {
              name: "transmission",
              label: "Transmission Type",
              type: "select",
              required: true,
              options: ["Manual", "Automatic"],
            },
            {
              name: "condition",
              label: "Condition",
              type: "select",
              required: true,
              options: ["New", "Used", "Accident-Free", "Salvaged"],
            },
          ],
        },
        {
          id: "electronics",
          name: "Electronics",
          description: "Laptops, Desktops, TVs, Cameras, Gaming Consoles, Audio Devices",
          icon: "💻",
          fields: [
            {
              name: "type",
              label: "Device Type",
              type: "select",
              required: true,
              options: ["Laptop", "Desktop", "TV", "Camera", "Gaming Console", "Audio Device", "Other"],
            },
            { name: "brand", label: "Brand & Model", type: "text", required: true },
            { name: "processor", label: "Processor & RAM", type: "text", required: false },
            { name: "storage", label: "Storage Type & Capacity", type: "text", required: false },
            { name: "screenSize", label: "Screen Size (inches)", type: "number", required: false },
          ],
        },
        {
          id: "mobile",
          name: "Mobile Phones & Tablets",
          description: "Smartphones, Feature Phones, Tablets, Accessories",
          icon: "📱",
          fields: [
            { name: "brand", label: "Brand & Model", type: "text", required: true },
            {
              name: "os",
              label: "Operating System",
              type: "select",
              required: true,
              options: ["iOS", "Android", "Windows", "Other"],
            },
            { name: "storage", label: "Storage Capacity (GB)", type: "number", required: true },
            { name: "ram", label: "RAM (GB)", type: "number", required: true },
          ],
        },
        {
          id: "furniture",
          name: "Home, Furniture & Appliances",
          description: "Kitchen, Living Room, Bedroom, Office Furniture, Home Appliances",
          icon: "🛋️",
          fields: [
            { name: "type", label: "Item Type", type: "text", required: true },
            { name: "material", label: "Material", type: "text", required: false },
            { name: "dimensions", label: "Dimensions", type: "text", required: false },
          ],
        },
      ]
      setCategories(mockCategories)
    }

    // Simulate API call for items
    const fetchItems = () => {
      const mockItems = [
        {
          id: "1",
          name: "Toyota Camry 2020",
          description: "Excellent condition Toyota Camry with low mileage",
          category: "vehicles",
          categoryName: "Vehicles",
          categoryIcon: "🚗",
          make: "Toyota Camry",
          year: "2020",
          mileage: "25000",
          fuelType: "Petrol",
          transmission: "Automatic",
          condition: "Used",
          location: "New York, NY",
          price: "15000",
          images: ["/placeholder.svg?height=300&width=400"],
          swapConditions: "Looking for a smaller car or electronics of similar value",
          status: "Pending",
          date: "2024-01-14",
        },
        {
          id: "2",
          name: "MacBook Pro 2023",
          description: "Mint condition MacBook Pro with M2 chip",
          category: "electronics",
          categoryName: "Electronics",
          categoryIcon: "💻",
          type: "Laptop",
          brand: "Apple MacBook Pro",
          processor: "M2 Pro, 16GB RAM",
          storage: "512GB SSD",
          screenSize: "14",
          condition: "Like New",
          location: "San Francisco, CA",
          price: "1800",
          images: ["/placeholder.svg?height=300&width=400"],
          swapConditions: "Looking for a gaming laptop or high-end camera",
          status: "Approved",
          date: "2024-01-13",
        },
        {
          id: "3",
          name: "Vintage Bicycle",
          description: "Classic road bike from the 80s in great condition",
          category: "vehicles",
          categoryName: "Vehicles",
          categoryIcon: "🚗",
          make: "Schwinn",
          year: "1985",
          mileage: "Unknown",
          condition: "Good",
          location: "Portland, OR",
          price: "350",
          images: ["/placeholder.svg?height=300&width=400"],
          swapConditions: "Looking for musical instruments or audio equipment",
          status: "Rejected",
          date: "2024-01-12",
        },
        {
          id: "4",
          name: "iPhone 14 Pro",
          description: "iPhone 14 Pro with 256GB storage, barely used",
          category: "mobile",
          categoryName: "Mobile Phones & Tablets",
          categoryIcon: "📱",
          brand: "Apple iPhone 14 Pro",
          os: "iOS",
          storage: "256",
          ram: "6",
          condition: "Like New",
          location: "Chicago, IL",
          price: "900",
          images: ["/placeholder.svg?height=300&width=400"],
          swapConditions: "Looking for Android flagship phone or laptop",
          status: "Approved",
          date: "2024-01-11",
        },
        {
          id: "5",
          name: "Leather Sofa",
          description: "Genuine leather sofa in excellent condition",
          category: "furniture",
          categoryName: "Home, Furniture & Appliances",
          categoryIcon: "🛋️",
          type: "Sofa",
          material: "Genuine Leather",
          dimensions: '84" x 36" x 32"',
          condition: "Good",
          location: "Austin, TX",
          price: "800",
          images: ["/placeholder.svg?height=300&width=400"],
          swapConditions: "Looking for dining table set or bedroom furniture",
          status: "Pending",
          date: "2024-01-10",
        },
      ]
      setItems(mockItems)
      setFilteredItems(mockItems)
    }

    fetchCategories()
    fetchItems()
  }, [])

  useEffect(() => {
    // Filter items based on search query, status filter, and category filter
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [searchQuery, statusFilter, categoryFilter, items])

  if (!mounted) {
    return null
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleNewItem = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...itemData,
                id: editingItem.id,
                date: editingItem.date,
                categoryName: categories.find((c) => c.id === itemData.category)?.name || "",
                categoryIcon: categories.find((c) => c.id === itemData.category)?.icon || "📦",
              }
            : item,
        ),
      )
    } else {
      // Add new item
      const newItem = {
        ...itemData,
        id: String(items.length + 1),
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        categoryName: categories.find((c) => c.id === itemData.category)?.name || "",
        categoryIcon: categories.find((c) => c.id === itemData.category)?.icon || "📦",
      }
      setItems((prev) => [...prev, newItem])
    }
    setShowForm(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleApproveItem = (itemId) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Approved" } : item)))
  }

  const handleRejectItem = (itemId) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Rejected" } : item)))
  }

  const handleAddField = (field) => {
    setCustomFields((prev) => [...prev, field])

    // In a real application, you would send this to your backend
    console.log("Added new custom field:", field)

    // Update categories with the new field
    if (categoryFilter !== "all") {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryFilter ? { ...category, fields: [...(category.fields || []), field] } : category,
        ),
      )
    }
  }

  const columns = [
    {
      accessorKey: "categoryIcon",
      header: "",
      cell: ({ row }) => <span className="text-xl">{row.getValue("categoryIcon")}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "categoryName",
      header: "Category",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price")
        return price ? `$${price}` : "N/A"
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        switch (status) {
          case "Approved":
            return <Badge className="bg-green-500">Approved</Badge>
          case "Rejected":
            return <Badge className="bg-red-500">Rejected</Badge>
          default:
            return <Badge className="bg-yellow-500">Pending</Badge>
        }
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-2">
            {item.status === "Pending" && (
              <>
                <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApproveItem(item.id)}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" title="Reject" onClick={() => handleRejectItem(item.id)}>
                  <XCircle className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditItem(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="View Details" onClick={() => handleEditItem(item)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Items</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewItem}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
          <FieldAdder onAddField={handleAddField} entityName="Items" />
        </div>
      </div>

      {showForm ? (
        <Card className="p-6">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <DynamicItemForm
              categories={categories}
              initialData={editingItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setShowForm(false)
                setEditingItem(null)
              }}
            />
          </ScrollArea>
        </Card>
      ) : (
        <Card>
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2 ml-auto">
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
                    <DropdownMenuItem onClick={() => setStatusFilter("Approved")}>Approved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("Rejected")}>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Category:{" "}
                      {categoryFilter === "all"
                        ? "All"
                        : categories.find((c) => c.id === categoryFilter)?.name || categoryFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} onClick={() => setCategoryFilter(category.id)}>
                        <span className="mr-2">{category.icon}</span> {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {customFields.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Custom Fields</Badge>
                  <span className="text-sm text-muted-foreground">
                    {customFields.length} custom {customFields.length === 1 ? "field" : "fields"} added
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customFields.map((field, index) => (
                    <Badge key={index} variant="secondary" className="py-1">
                      {field.label} ({field.type})
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            <DataTable columns={columns} data={filteredItems} />
          </div>
        </Card>
      )}
    </div>
  )
}

