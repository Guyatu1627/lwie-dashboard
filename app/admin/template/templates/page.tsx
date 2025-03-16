"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, RefreshCw } from "lucide-react"
import { TemplateForm } from "@/components/forms/template-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FieldAdder } from "@/components/field-adder"
import { Separator } from "@/components/ui/separator"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    // Simulate API call
    const fetchTemplates = () => {
      const mockTemplates = [
        {
          id: "1",
          name: "Basic Item",
          description: "A simple template for basic items",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
            { name: "condition", type: "select", required: true },
          ],
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
        },
        {
          id: "2",
          name: "Vehicle Listing",
          description: "Template for vehicle listings with detailed specifications",
          fields: [
            { name: "make", type: "text", required: true },
            { name: "model", type: "text", required: true },
            { name: "year", type: "number", required: true },
            { name: "mileage", type: "number", required: true },
            { name: "fuelType", type: "select", required: true },
            { name: "transmission", type: "select", required: true },
            { name: "condition", type: "select", required: true },
          ],
          createdAt: "2024-01-14",
          updatedAt: "2024-01-16",
        },
        {
          id: "3",
          name: "Electronics",
          description: "Template for electronics with technical specifications",
          fields: [
            { name: "brand", type: "text", required: true },
            { name: "model", type: "text", required: true },
            { name: "condition", type: "select", required: true },
            { name: "age", type: "number", required: false },
            { name: "technicalSpecs", type: "textarea", required: false },
          ],
          createdAt: "2024-01-13",
          updatedAt: "2024-01-13",
        },
      ]
      setTemplates(mockTemplates)
      setFilteredTemplates(mockTemplates)
    }

    fetchTemplates()
  }, [])

  useEffect(() => {
    // Filter templates based on search query
    if (searchQuery) {
      const filtered = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates(templates)
    }
  }, [searchQuery, templates])

  const handleNewTemplate = () => {
    setEditingTemplate(null)
    setShowForm(true)
  }

  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setShowForm(true)
  }

  const handleDeleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === editingTemplate.id
            ? {
                ...templateData,
                id: editingTemplate.id,
                createdAt: editingTemplate.createdAt,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : template,
        ),
      )
    } else {
      // Add new template
      const newTemplate = {
        ...templateData,
        id: String(templates.length + 1),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setTemplates((prev) => [...prev, newTemplate])
    }
    setShowForm(false)
    setEditingTemplate(null)
  }

  const handleAddField = (field) => {
    setCustomFields((prev) => [...prev, field])

    // In a real application, you would send this to your backend
    console.log("Added new custom field to templates:", field)

    // If editing a template, add the field to that template
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        fields: [...(editingTemplate.fields || []), field],
      })
    }
  }

  const columns = [
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
      accessorKey: "updatedAt",
      header: "Last Updated",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const template = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditTemplate(template)}>
              <Pencil className="h-4 w-4" />
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
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates</h1>
        <div className="flex gap-2">
          <Button onClick={handleNewTemplate}>
            <Plus className="mr-2 h-4 w-4" /> Add Template
          </Button>
          <FieldAdder onAddField={handleAddField} entityName="Templates" />
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
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

          <DataTable columns={columns} data={filteredTemplates} />
        </div>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
          </DialogHeader>
          <TemplateForm onClose={() => setShowForm(false)} initialData={editingTemplate} onSave={handleSaveTemplate} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

