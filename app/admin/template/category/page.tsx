"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, RefreshCw, Check, X } from "lucide-react"
import { CategoryForm } from "@/components/forms/category-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FieldAdder } from "@/components/field-adder"
import { Separator } from "@/components/ui/separator"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    // Simulate API call
    const fetchCategories = () => {
      const mockCategories = [
        {
          id: "vehicles",
          name: "Vehicles",
          description: "Cars, Motorcycles, Bicycles, Boats, Spare Parts, Accessories",
          icon: "🚗",
          isActive: true,
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
          isActive: true,
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
          isActive: true,
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
          isActive: true,
          fields: [
            { name: "type", label: "Item Type", type: "text", required: true },
            { name: "material", label: "Material", type: "text", required: false },
            { name: "dimensions", label: "Dimensions", type: "text", required: false },
          ],
        },
      ]
      setCategories(mockCategories)
      setFilteredCategories(mockCategories)
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    // Filter categories based on search query
    if (searchQuery) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery, categories])

  const handleNewCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) => prev.map((category) => (category.id === editingCategory.id ? categoryData : category)))
    } else {
      // Add new category
      setCategories((prev) => [...prev, categoryData])
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleAddField = (field) => {
    setCustomFields((prev) => [...prev, field])

    // In a real application, you would send this to your backend
    console.log("Added new custom field to categories:", field)

    // If editing a category, add the field to that category
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        fields: [...(editingCategory.fields || []), field],
      })
    }
  }

  const columns = [
    {
      accessorKey: "icon",
      header: "",
      cell: ({ row }) => <span className="text-xl">{row.getValue("icon")}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "fields",
      header: "Fields",
      cell: ({ row }) => {
        const fields = row.getValue("fields")
        return <Badge>{fields.length} fields</Badge>
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive")
        return isActive ? (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" /> Active
          </Badge>
        ) : (
          <Badge variant="outline">
            <X className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditCategory(category)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteCategory(category.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <FieldAdder onAddField={handleAddField} entityName="Categories" />
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
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

          <DataTable columns={columns} data={filteredCategories} />
        </div>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm initialData={editingCategory} onSave={handleSaveCategory} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

