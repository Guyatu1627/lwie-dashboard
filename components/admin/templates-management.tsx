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
import { Search, RefreshCw, Plus, Edit, Trash2, Eye, Copy, FileText } from "lucide-react"

// Mock data for templates
const mockTemplates = [
  {
    id: "template-001",
    name: "Electronics Listing",
    category: "Electronics",
    status: "Active",
    createdAt: "2024-01-15T10:30:00Z",
    fieldCount: 8,
    usageCount: 245,
  },
  {
    id: "template-002",
    name: "Furniture Listing",
    category: "Furniture",
    status: "Active",
    createdAt: "2024-01-14T14:45:00Z",
    fieldCount: 6,
    usageCount: 180,
  },
  {
    id: "template-003",
    name: "Vehicle Listing",
    category: "Vehicles",
    status: "Active",
    createdAt: "2024-01-16T09:15:00Z",
    fieldCount: 12,
    usageCount: 120,
  },
  {
    id: "template-004",
    name: "Fashion Listing",
    category: "Fashion",
    status: "Draft",
    createdAt: "2024-01-13T11:20:00Z",
    fieldCount: 7,
    usageCount: 0,
  },
  {
    id: "template-005",
    name: "Sports Equipment",
    category: "Sports",
    status: "Active",
    createdAt: "2024-01-12T16:30:00Z",
    fieldCount: 9,
    usageCount: 95,
  },
]

export function TemplatesManagement() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddingTemplate, setIsAddingTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    description: "",
  })

  // Filter templates based on search query, category filter, status filter, and active tab
  const filteredTemplates = templates.filter((template) => {
    // Search filter
    if (
      searchQuery &&
      !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (categoryFilter !== "all" && template.category !== categoryFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && template.status !== statusFilter) {
      return false
    }

    // Tab filter
    if (activeTab === "active" && template.status !== "Active") {
      return false
    } else if (activeTab === "draft" && template.status !== "Draft") {
      return false
    }

    return true
  })

  const handleAddTemplate = () => {
    const template = {
      id: `template-${Math.floor(Math.random() * 1000)}`,
      name: newTemplate.name,
      category: newTemplate.category,
      status: "Draft",
      createdAt: new Date().toISOString(),
      fieldCount: 0,
      usageCount: 0,
    }

    setTemplates([...templates, template])
    setNewTemplate({ name: "", category: "", description: "" })
    setIsAddingTemplate(false)
  }

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter((template) => template.id !== templateId))
  }

  const handleDuplicateTemplate = (templateId) => {
    const templateToDuplicate = templates.find((template) => template.id === templateId)
    if (templateToDuplicate) {
      const duplicatedTemplate = {
        ...templateToDuplicate,
        id: `template-${Math.floor(Math.random() * 1000)}`,
        name: `${templateToDuplicate.name} (Copy)`,
        status: "Draft",
        createdAt: new Date().toISOString(),
        usageCount: 0,
      }

      setTemplates([...templates, duplicatedTemplate])
    }
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Active":
            badgeClass = "bg-green-500"
            break
          case "Draft":
            badgeClass = "bg-yellow-500"
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
      accessorKey: "fieldCount",
      header: "Fields",
    },
    {
      accessorKey: "usageCount",
      header: "Usage",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const template = row.original

        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Duplicate" onClick={() => handleDuplicateTemplate(template.id)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteTemplate(template.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates Management</h1>
          <p className="text-muted-foreground">Create and manage item listing templates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={isAddingTemplate} onOpenChange={setIsAddingTemplate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Create a new template for item listings.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
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
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Enter template description"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTemplate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row md:items-center gap-4 my-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
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
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <DataTable columns={columns} data={filteredTemplates} pagination={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Template Fields</CardTitle>
          <CardDescription>Add custom fields to your template</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldAdder
            entityName="Template"
            onAddField={(field) => {
              // In a real app, this would call an API to add the field
              alert(`Added new field to template: ${field.label} (${field.type})`)
            }}
          />

          <div className="mt-4 border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Common Template Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Title</p>
                  <p className="text-xs text-muted-foreground">Text field (required)</p>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-xs text-muted-foreground">Textarea field (required)</p>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-xs text-muted-foreground">Select field (required)</p>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Condition</p>
                  <p className="text-xs text-muted-foreground">Select field (required)</p>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Images</p>
                  <p className="text-xs text-muted-foreground">Image upload field (required)</p>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded-md">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-xs text-muted-foreground">Text field (required)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

