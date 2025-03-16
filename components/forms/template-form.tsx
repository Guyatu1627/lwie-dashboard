"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface TemplateFormProps {
  onClose: () => void
  initialData?: any
}

interface Field {
  name: string
  type: string
  required: boolean
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "file", label: "File Upload" },
]

export function TemplateForm({ onClose, initialData }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  })
  const [fields, setFields] = useState<Field[]>(initialData?.fields || [])
  const [newField, setNewField] = useState<Field>({
    name: "",
    type: "",
    required: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFields((prev) => [...prev, { ...newField }])
      setNewField({ name: "", type: "", required: false })
    }
  }

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Here you would typically send the data to your backend
      console.log({ ...formData, fields })
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Fields</Label>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
              <div className="flex-1">
                <p className="text-sm font-medium">{field.name}</p>
                <p className="text-sm text-muted-foreground">
                  Type: {field.type} • {field.required ? "Required" : "Optional"}
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="fieldName">Field Name</Label>
            <Input
              id="fieldName"
              value={newField.name}
              onChange={(e) => setNewField((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter field name"
            />
          </div>
          <div>
            <Label htmlFor="fieldType">Field Type</Label>
            <Select value={newField.type} onValueChange={(value) => setNewField((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fieldRequired"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField((prev) => ({ ...prev, required: checked as boolean }))}
              />
              <Label htmlFor="fieldRequired">Required</Label>
            </div>
            <Button type="button" onClick={handleAddField} disabled={!newField.name || !newField.type}>
              Add Field
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update Template" : "Create Template"}</Button>
      </div>
    </form>
  )
}

