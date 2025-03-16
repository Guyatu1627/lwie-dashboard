"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash } from "@/components/ui/icons"

type TemplateFormProps = {
  onClose: () => void
}

type Field = {
  name: string
  type: string
  required: boolean
}

export function TemplateForm({ onClose }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [fields, setFields] = useState<Field[]>([])
  const [newField, setNewField] = useState<Field>({ name: "", type: "", required: false })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFields((prev) => [...prev, newField])
      setNewField({ name: "", type: "", required: false })
    }
  }

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ ...formData, fields })
    // Here you would typically send the data to your backend
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <div key={index} className="flex items-center gap-2">
            <Input defaultValue={field.name} readOnly />
            <Input defaultValue={field.type} readOnly />
            <Checkbox defaultChecked={field.required} disabled />
            <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveField(index)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={newField.name}
            onChange={(e) => setNewField((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="fieldType">Field Type</Label>
          <Input
            id="fieldType"
            value={newField.type}
            onChange={(e) => setNewField((prev) => ({ ...prev, type: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="fieldRequired"
            checked={newField.required}
            onCheckedChange={(checked) => setNewField((prev) => ({ ...prev, required: checked as boolean }))}
          />
          <Label htmlFor="fieldRequired">Required</Label>
        </div>
        <Button type="button" onClick={handleAddField}>
          Add Field
        </Button>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Template</Button>
      </div>
    </form>
  )
}

