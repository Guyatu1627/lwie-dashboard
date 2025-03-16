"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Check, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loading } from "@/components/ui/loading"
import { apiClient } from "@/utils/api-client"

// Field type options
const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "multiselect", label: "Multi Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "file", label: "File Upload" },
  { value: "color", label: "Color Picker" },
  { value: "url", label: "URL" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Number" },
]

// Field target options
const fieldTargets = [
  { value: "item", label: "Items" },
  { value: "template", label: "Templates" },
  { value: "both", label: "Both" },
]

interface CustomField {
  id: string
  name: string
  key: string
  type: string
  target: string
  required: boolean
  description?: string
  placeholder?: string
  defaultValue?: string
  options?: string[]
  validation?: string
  isActive: boolean
  order: number
}

export default function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [formData, setFormData] = useState<Partial<CustomField>>({
    name: "",
    key: "",
    type: "text",
    target: "item",
    required: false,
    description: "",
    placeholder: "",
    defaultValue: "",
    options: [],
    validation: "",
    isActive: true,
  })
  const [optionInput, setOptionInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFields, setFilteredFields] = useState<CustomField[]>([])

  const router = useRouter()
  const { toast } = useToast()

  // Fetch custom fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.fetch<{ fields: CustomField[] }>("/api/custom-fields", {
          cacheTime: 60000, // Cache for 1 minute
        })

        setFields(response.fields)
        setFilteredFields(response.fields)
      } catch (error) {
        console.error("Failed to fetch custom fields:", error)
        toast({
          title: "Error",
          description: "Failed to load custom fields. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFields()
  }, [toast])

  // Filter fields based on search query and active tab
  useEffect(() => {
    let filtered = [...fields]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (field) =>
          field.name.toLowerCase().includes(query) ||
          field.key.toLowerCase().includes(query) ||
          field.description?.toLowerCase().includes(query),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((field) => {
        if (activeTab === "item") return field.target === "item" || field.target === "both"
        if (activeTab === "template") return field.target === "template" || field.target === "both"
        if (activeTab === "active") return field.isActive
        if (activeTab === "inactive") return !field.isActive
        return true
      })
    }

    setFilteredFields(filtered)
  }, [fields, searchQuery, activeTab])

  // Generate key from name
  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
  }

  // Handle name change and auto-generate key
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      key: !editingField ? generateKey(value) : prev.key,
    }))
  }

  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add option to options array
  const handleAddOption = () => {
    if (!optionInput.trim()) return

    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), optionInput.trim()],
    }))

    setOptionInput("")
  }

  // Remove option from options array
  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }))
  }

  // Move option up in the list
  const handleMoveOptionUp = (index: number) => {
    if (index === 0) return

    setFormData((prev) => {
      const newOptions = [...(prev.options || [])]
      const temp = newOptions[index]
      newOptions[index] = newOptions[index - 1]
      newOptions[index - 1] = temp
      return { ...prev, options: newOptions }
    })
  }

  // Move option down in the list
  const handleMoveOptionDown = (index: number) => {
    if (!formData.options || index === formData.options.length - 1) return

    setFormData((prev) => {
      const newOptions = [...(prev.options || [])]
      const temp = newOptions[index]
      newOptions[index] = newOptions[index + 1]
      newOptions[index + 1] = temp
      return { ...prev, options: newOptions }
    })
  }

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      key: "",
      type: "text",
      target: "item",
      required: false,
      description: "",
      placeholder: "",
      defaultValue: "",
      options: [],
      validation: "",
      isActive: true,
    })
    setEditingField(null)
  }

  // Open dialog for creating a new field
  const handleCreateField = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Open dialog for editing an existing field
  const handleEditField = (field: CustomField) => {
    setEditingField(field)
    setFormData({
      name: field.name,
      key: field.key,
      type: field.type,
      target: field.target,
      required: field.required,
      description: field.description || "",
      placeholder: field.placeholder || "",
      defaultValue: field.defaultValue || "",
      options: field.options || [],
      validation: field.validation || "",
      isActive: field.isActive,
    })
    setIsDialogOpen(true)
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name?.trim()) {
        toast({
          title: "Validation Error",
          description: "Field name is required",
          variant: "destructive",
        })
        return
      }

      if (!formData.key?.trim()) {
        toast({
          title: "Validation Error",
          description: "Field key is required",
          variant: "destructive",
        })
        return
      }

      // Validate that options are provided for select and multiselect
      if (
        (formData.type === "select" || formData.type === "multiselect") &&
        (!formData.options || formData.options.length < 2)
      ) {
        toast({
          title: "Validation Error",
          description: "Select fields require at least two options",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      if (editingField) {
        // Update existing field
        const response = await apiClient.fetch<{ field: CustomField }>(`/api/custom-fields/${editingField.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        })

        setFields((prev) => prev.map((field) => (field.id === editingField.id ? response.field : field)))

        toast({
          title: "Success",
          description: "Custom field updated successfully",
        })
      } else {
        // Create new field
        const response = await apiClient.fetch<{ field: CustomField }>("/api/custom-fields", {
          method: "POST",
          body: JSON.stringify(formData),
        })

        setFields((prev) => [...prev, response.field])

        toast({
          title: "Success",
          description: "Custom field created successfully",
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to save custom field:", error)
      toast({
        title: "Error",
        description: "Failed to save custom field. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle field active status
  const handleToggleStatus = async (field: CustomField) => {
    try {
      const response = await apiClient.fetch<{ field: CustomField }>(`/api/custom-fields/${field.id}/toggle-status`, {
        method: "PUT",
      })

      setFields((prev) => prev.map((f) => (f.id === field.id ? response.field : f)))

      toast({
        title: "Success",
        description: `Field ${response.field.isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Failed to toggle field status:", error)
      toast({
        title: "Error",
        description: "Failed to update field status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete field
  const handleDeleteField = async (field: CustomField) => {
    if (!confirm(`Are you sure you want to delete the field "${field.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.fetch(`/api/custom-fields/${field.id}`, {
        method: "DELETE",
      })

      setFields((prev) => prev.filter((f) => f.id !== field.id))

      toast({
        title: "Success",
        description: "Custom field deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete custom field:", error)
      toast({
        title: "Error",
        description: "Failed to delete custom field. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Reorder fields
  const handleReorderField = async (field: CustomField, direction: "up" | "down") => {
    const currentIndex = fields.findIndex((f) => f.id === field.id)
    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === fields.length - 1)) {
      return
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const targetField = fields[newIndex]

    try {
      await apiClient.fetch(`/api/custom-fields/reorder`, {
        method: "PUT",
        body: JSON.stringify({
          fieldId: field.id,
          targetId: targetField.id,
        }),
      })

      // Update local state
      const newFields = [...fields]
      newFields[currentIndex] = targetField
      newFields[newIndex] = field
      setFields(newFields)
    } catch (error) {
      console.error("Failed to reorder fields:", error)
      toast({
        title: "Error",
        description: "Failed to reorder fields. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Fields</h1>
          <p className="text-muted-foreground">Manage custom fields for items and templates</p>
        </div>
        <Button onClick={handleCreateField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Field
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:max-w-xs"
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="item">Items</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loading size="lg" text="Loading custom fields..." />
          </div>
        ) : filteredFields.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <p className="text-center text-muted-foreground">
                {searchQuery
                  ? "No custom fields match your search criteria"
                  : "No custom fields found. Click 'Add Custom Field' to create one."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFields.map((field) => (
              <Card key={field.id} className={!field.isActive ? "opacity-70" : undefined}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {field.name}
                        {field.required && <span className="ml-1 text-sm text-red-500">*</span>}
                      </CardTitle>
                      <CardDescription>Key: {field.key}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(field)}
                        title={field.isActive ? "Deactivate" : "Activate"}
                      >
                        {field.isActive ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditField(field)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteField(field)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Type:</div>
                      <div className="capitalize">
                        {fieldTypes.find((t) => t.value === field.type)?.label || field.type}
                      </div>

                      <div className="text-muted-foreground">Target:</div>
                      <div className="capitalize">
                        {fieldTargets.find((t) => t.value === field.target)?.label || field.target}
                      </div>

                      {field.description && (
                        <>
                          <div className="text-muted-foreground">Description:</div>
                          <div className="truncate">{field.description}</div>
                        </>
                      )}
                    </div>

                    {(field.type === "select" || field.type === "multiselect") &&
                      field.options &&
                      field.options.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-muted-foreground">Options:</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {field.options.slice(0, 3).map((option, index) => (
                              <div key={index} className="rounded-full bg-muted px-2 py-1 text-xs">
                                {option}
                              </div>
                            ))}
                            {field.options.length > 3 && (
                              <div className="rounded-full bg-muted px-2 py-1 text-xs">
                                +{field.options.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Custom Field" : "Create Custom Field"}</DialogTitle>
            <DialogDescription>
              {editingField
                ? "Update the custom field properties below"
                : "Configure a new custom field for items or templates"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Color"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Field Key</Label>
                <Input
                  id="key"
                  value={formData.key || ""}
                  onChange={(e) => handleInputChange("key", e.target.value)}
                  placeholder="e.g., color"
                  disabled={!!editingField}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Field Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Apply To</Label>
                <Select value={formData.target} onValueChange={(value) => handleInputChange("target", value)}>
                  <SelectTrigger id="target">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTargets.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        {target.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Field description for users"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={formData.placeholder || ""}
                  onChange={(e) => handleInputChange("placeholder", e.target.value)}
                  placeholder="Input placeholder text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultValue">Default Value</Label>
                <Input
                  id="defaultValue"
                  value={formData.defaultValue || ""}
                  onChange={(e) => handleInputChange("defaultValue", e.target.value)}
                  placeholder="Default value"
                />
              </div>
            </div>

            {(formData.type === "select" || formData.type === "multiselect") && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Add an option"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddOption()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddOption}>
                    Add
                  </Button>
                </div>

                {formData.options && formData.options.length > 0 ? (
                  <div className="mt-2 space-y-2 rounded-md border p-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <div className="flex-1 truncate">{option}</div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveOptionUp(index)}
                            disabled={index === 0}
                            className="h-7 w-7"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveOptionDown(index)}
                            disabled={index === (formData.options?.length || 0) - 1}
                            className="h-7 w-7"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                            className="h-7 w-7 text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No options added yet. Add at least two options for select fields.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="validation">Validation Pattern</Label>
              <Input
                id="validation"
                value={formData.validation || ""}
                onChange={(e) => handleInputChange("validation", e.target.value)}
                placeholder="Regular expression for validation"
              />
              <p className="text-xs text-muted-foreground">
                Optional. Enter a regular expression to validate input (e.g., ^[0-9]{5}$ for a 5-digit number)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.required || false}
                onCheckedChange={(checked) => handleInputChange("required", checked)}
              />
              <Label htmlFor="required">Required field</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loading size="sm" />
                  <span className="ml-2">{editingField ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>{editingField ? "Update" : "Create"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

