"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/forms/image-upload"

interface ItemFormProps {
  onClose: () => void
  initialData?: any
}

export function ItemForm({ onClose, initialData }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    condition: initialData?.condition || "",
    images: initialData?.images || [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Here you would typically send the data to your backend
      console.log(formData)
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="sports">Sports Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Images</Label>
          <ImageUpload value={formData.images} onChange={handleImageUpload} maxImages={5} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update Item" : "Create Item"}</Button>
      </div>
    </form>
  )
}

