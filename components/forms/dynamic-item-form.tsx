"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, MapPin, DollarSign, Info, AlertCircle } from "lucide-react"
import { ImageUpload } from "@/components/forms/image-upload"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DynamicItemFormProps {
  categories: any[]
  initialData?: any
  onSave: (data: any) => void
  onCancel: () => void
}

// Common fields that apply to all items
const COMMON_FIELDS = [
  { name: "name", label: "Item Name", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "status", label: "Status", type: "select", required: true, options: ["New", "Used", "Refurbished"] },
  { name: "swapConditions", label: "Swap Conditions", type: "textarea", required: true },
  { name: "images", label: "Images", type: "image", required: true },
]

export function DynamicItemForm({ categories, initialData, onSave, onCancel }: DynamicItemFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || {
      name: "",
      description: "",
      category: "",
      status: "",
      swapConditions: "",
      images: [],
      location: "",
      price: "",
    },
  )

  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load category fields when category changes
  useEffect(() => {
    if (formData.category) {
      const category = categories.find((c) => c.id === formData.category)
      setSelectedCategory(category || null)
    }
  }, [formData.category, categories])

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle image upload
  const handleImageUpload = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }))

    // Clear error when field is changed
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.images
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate common fields
    COMMON_FIELDS.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    // Validate category
    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    // Validate category-specific fields
    if (selectedCategory?.fields) {
      selectedCategory.fields.forEach((field) => {
        if (field.required && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onSave(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render a field based on its type
  const renderField = (field) => {
    const { name, label, type, required, options } = field
    const value = formData[name] || ""
    const error = errors[name]

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className={cn(error && "border-red-500")}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className={cn(error && "border-red-500")}
              rows={4}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "number":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              name={name}
              type="number"
              value={value}
              onChange={handleChange}
              className={cn(error && "border-red-500")}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(value) => handleSelectChange(name, value)}>
              <SelectTrigger className={cn(error && "border-red-500")}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2" key={name}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                name={name}
                checked={!!value}
                onCheckedChange={(checked) => handleSelectChange(name, checked)}
              />
              <Label htmlFor={name} className="flex items-center">
                {label} {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-2" key={name}>
            <Label className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(value) => handleSelectChange(name, value)}
              className="flex flex-col space-y-1"
            >
              {options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${name}-${option}`} />
                  <Label htmlFor={`${name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "date":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground",
                    error && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : `Select ${label.toLowerCase()}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => handleDateChange(name, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "image":
        return (
          <div className="space-y-2" key={name}>
            <Label className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <ImageUpload value={formData.images || []} onChange={handleImageUpload} maxImages={10} />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "location":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                className={cn("pl-10", error && "border-red-500")}
                placeholder="Enter location"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "price":
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={name} className="flex items-center">
              {label} {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={name}
                name={name}
                type="number"
                value={value}
                onChange={handleChange}
                className={cn("pl-10", error && "border-red-500")}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">
            Details
            {Object.keys(errors).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {Object.keys(errors).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="space-y-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center">
                Category <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className={cn(errors.category && "border-red-500")}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            </div>
            {/* Basic Fields */}
            {renderField(COMMON_FIELDS[0])} {/* Name */}
            {renderField(COMMON_FIELDS[1])} {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(COMMON_FIELDS[2])} {/* Status */}
              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center">
                  Location <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className={cn("pl-10", errors.location && "border-red-500")}
                    placeholder="Enter location"
                  />
                </div>
                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
              </div>
            </div>
            {/* Price Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                Price (Optional)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            {/* Swap Conditions */}
            {renderField(COMMON_FIELDS[3])} {/* Swap Conditions */}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6 pt-4">
          {/* Category-specific fields */}
          {selectedCategory ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCategory.icon}</span>
                <div>
                  <h3 className="font-medium">{selectedCategory.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>
              <Separator />
              {selectedCategory.fields?.length > 0 ? (
                <div className="space-y-4">{selectedCategory.fields.map((field) => renderField(field))}</div>
              ) : (
                <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                  <div className="text-center">
                    <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No additional fields for this category.</p>
                  </div>
                </div>
              )}
              <Separator />
              {/* Images Upload */}
              {renderField(COMMON_FIELDS[4])} {/* Images */}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border border-dashed rounded-md">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-1">No Category Selected</h3>
                <p className="text-muted-foreground">Please select a category in the Basic Information tab.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">Please fix the following errors:</p>
          </div>
          <ul className="text-sm text-red-600 list-disc pl-5">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </div>
    </form>
  )
}

