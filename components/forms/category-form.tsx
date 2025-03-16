"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryFormProps {
  initialData?: any
  onSave: (data: any) => void
  onCancel: () => void
}

// Field types for custom fields
const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Buttons" },
  { value: "date", label: "Date" },
  { value: "image", label: "Image Upload" },
  { value: "file", label: "File Upload" },
  { value: "location", label: "Location" },
  { value: "price", label: "Price" },
  { value: "condition", label: "Condition" },
]

// Predefined categories with their custom fields
const PREDEFINED_CATEGORIES = [
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
      { name: "vin", label: "VIN (Vehicle Identification Number)", type: "text", required: false },
    ],
  },
  {
    id: "property",
    name: "Property",
    description: "Houses, Apartments, Land, Commercial Properties",
    icon: "🏠",
    fields: [
      {
        name: "propertyType",
        label: "Property Type",
        type: "select",
        required: true,
        options: ["House", "Apartment", "Land", "Commercial", "Other"],
      },
      { name: "size", label: "Size (sq ft/m²)", type: "number", required: true },
      { name: "bedrooms", label: "Bedrooms", type: "number", required: false },
      { name: "bathrooms", label: "Bathrooms", type: "number", required: false },
      { name: "furnished", label: "Furnished", type: "select", required: true, options: ["Yes", "No", "Partially"] },
      { name: "location", label: "Location", type: "location", required: true },
      { name: "amenities", label: "Amenities", type: "textarea", required: false },
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
      { name: "battery", label: "Battery Capacity (mAh)", type: "number", required: false },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New", "Used", "Refurbished"],
      },
      { name: "accessories", label: "Includes Accessories", type: "checkbox", required: false },
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
      { name: "connectivity", label: "Connectivity", type: "text", required: false },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New", "Used", "Refurbished"],
      },
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
      {
        name: "energyRating",
        label: "Energy Rating",
        type: "select",
        required: false,
        options: ["A+++", "A++", "A+", "A", "B", "C", "D", "Not Applicable"],
      },
      { name: "assembly", label: "Assembly Required", type: "select", required: false, options: ["Yes", "No"] },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New", "Like New", "Good", "Fair", "Poor"],
      },
    ],
  },
  {
    id: "health",
    name: "Health & Beauty",
    description: "Makeup, Skincare, Fragrances, Supplements, Hair & Grooming",
    icon: "💄",
    fields: [
      { name: "brand", label: "Brand", type: "text", required: true },
      {
        name: "productType",
        label: "Product Type",
        type: "select",
        required: true,
        options: ["Skin Care", "Makeup", "Perfume", "Supplements", "Hair Care", "Other"],
      },
      {
        name: "organic",
        label: "Organic/Natural",
        type: "select",
        required: false,
        options: ["Yes", "No", "Partially"],
      },
      { name: "expirationDate", label: "Expiration Date", type: "date", required: false },
      { name: "condition", label: "Condition", type: "select", required: true, options: ["New", "Used", "Sealed"] },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Men's, Women's & Kids' Clothing, Shoes, Watches, Jewelry, Bags",
    icon: "👗",
    fields: [
      { name: "type", label: "Item Type", type: "text", required: true },
      { name: "brand", label: "Brand", type: "text", required: false },
      { name: "size", label: "Size & Measurements", type: "text", required: true },
      { name: "material", label: "Material", type: "text", required: false },
      { name: "gender", label: "Gender", type: "select", required: true, options: ["Men", "Women", "Kids", "Unisex"] },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New with tags", "New without tags", "Gently used", "Well worn"],
      },
    ],
  },
  {
    id: "sports",
    name: "Sports, Arts & Outdoors",
    description: "Gym Equipment, Sports Gear, Musical Instruments, Outdoor & Camping Gear",
    icon: "🏋️‍♂️",
    fields: [
      {
        name: "type",
        label: "Item Type",
        type: "select",
        required: true,
        options: ["Gym Equipment", "Camping Gear", "Musical Instrument", "Sportswear", "Other"],
      },
      { name: "brand", label: "Brand & Model", type: "text", required: false },
      { name: "size", label: "Size/Dimensions", type: "text", required: false },
      { name: "material", label: "Material", type: "text", required: false },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New", "Used", "Refurbished"],
      },
    ],
  },
  {
    id: "repair",
    name: "Repair & Construction",
    description: "Building Materials, Power Tools, Hand Tools, Plumbing & Electrical Items",
    icon: "🛠️",
    fields: [
      { name: "toolType", label: "Tool/Equipment Type", type: "text", required: true },
      { name: "brand", label: "Brand & Model", type: "text", required: false },
      {
        name: "powerSource",
        label: "Power Source",
        type: "select",
        required: false,
        options: ["Electric", "Gas", "Manual", "Battery", "Other"],
      },
      {
        name: "condition",
        label: "Usage Condition",
        type: "select",
        required: true,
        options: ["New", "Lightly Used", "Heavy Duty", "Refurbished"],
      },
    ],
  },
  {
    id: "services",
    name: "Services",
    description: "Home Cleaning, Car Repair, Fitness Training, Tutoring, Freelancing, Event Planning",
    icon: "💼",
    fields: [
      { name: "serviceType", label: "Service Type", type: "text", required: true },
      {
        name: "experience",
        label: "Experience Level",
        type: "select",
        required: true,
        options: ["Beginner", "Intermediate", "Expert", "Professional"],
      },
      {
        name: "availability",
        label: "Availability",
        type: "select",
        required: true,
        options: ["Full-time", "Part-time", "Contract", "Hourly", "Weekends"],
      },
      { name: "certifications", label: "Certifications", type: "textarea", required: false },
      { name: "rate", label: "Rate/Price", type: "price", required: true },
    ],
  },
  {
    id: "commercial",
    name: "Commercial Equipment & Tools",
    description: "Manufacturing, Industrial Machinery, Office Equipment, Medical Equipment",
    icon: "🏢",
    fields: [
      {
        name: "industryType",
        label: "Industry Type",
        type: "select",
        required: true,
        options: ["Medical", "Industrial", "Office", "Restaurant", "Manufacturing", "Other"],
      },
      { name: "equipmentType", label: "Equipment Type", type: "text", required: true },
      { name: "brand", label: "Brand & Model", type: "text", required: false },
      {
        name: "powerSource",
        label: "Power Source",
        type: "select",
        required: false,
        options: ["Electric", "Manual", "Gas", "Battery", "Other"],
      },
      { name: "capacity", label: "Capacity & Size", type: "text", required: false },
      {
        name: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: ["New", "Used", "Refurbished", "For parts"],
      },
    ],
  },
]

export function CategoryForm({ initialData, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "📦",
    parent: initialData?.parent || "",
    isActive: initialData?.isActive !== false,
  })

  const [customFields, setCustomFields] = useState<any[]>(initialData?.fields || [])
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "",
    required: false,
    options: [] as string[],
    newOption: "",
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [showPredefined, setShowPredefined] = useState(false)
  const [selectedPredefined, setSelectedPredefined] = useState<string | null>(null)

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle new field changes
  const handleNewFieldChange = (name: string, value: any) => {
    setNewField((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add a new option to the select/radio field
  const handleAddOption = () => {
    if (newField.newOption.trim()) {
      setNewField((prev) => ({
        ...prev,
        options: [...prev.options, prev.newOption.trim()],
        newOption: "",
      }))
    }
  }

  // Remove an option from the select/radio field
  const handleRemoveOption = (index: number) => {
    setNewField((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  // Add a new custom field
  const handleAddField = () => {
    if (newField.name && newField.label && newField.type) {
      const fieldToAdd = {
        name: newField.name.toLowerCase().replace(/\s+/g, ""),
        label: newField.label,
        type: newField.type,
        required: newField.required,
        options: ["select", "radio", "checkbox"].includes(newField.type) ? [...newField.options] : undefined,
      }

      setCustomFields((prev) => [...prev, fieldToAdd])
      setNewField({
        name: "",
        label: "",
        type: "",
        required: false,
        options: [],
        newOption: "",
      })
    }
  }

  // Remove a custom field
  const handleRemoveField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index))
  }

  // Move a field up in the list
  const handleMoveFieldUp = (index: number) => {
    if (index > 0) {
      const updatedFields = [...customFields]
      const temp = updatedFields[index]
      updatedFields[index] = updatedFields[index - 1]
      updatedFields[index - 1] = temp
      setCustomFields(updatedFields)
    }
  }

  // Move a field down in the list
  const handleMoveFieldDown = (index: number) => {
    if (index < customFields.length - 1) {
      const updatedFields = [...customFields]
      const temp = updatedFields[index]
      updatedFields[index] = updatedFields[index + 1]
      updatedFields[index + 1] = temp
      setCustomFields(updatedFields)
    }
  }

  // Load a predefined category
  const handleLoadPredefined = (categoryId: string) => {
    const category = PREDEFINED_CATEGORIES.find((c) => c.id === categoryId)
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        parent: "",
        isActive: true,
      })
      setCustomFields(category.fields)
      setSelectedPredefined(categoryId)
      setShowPredefined(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      fields: customFields,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Category Details</h2>
            <Button type="button" variant="outline" onClick={() => setShowPredefined(!showPredefined)}>
              Load Predefined Category
            </Button>
          </div>

          {showPredefined && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select a Predefined Category</CardTitle>
                <CardDescription>
                  Choose a category template to quickly set up your category with predefined fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PREDEFINED_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        className={cn(
                          "border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
                          selectedPredefined === category.id && "border-primary bg-primary/5",
                        )}
                        onClick={() => handleLoadPredefined(category.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => setShowPredefined(false)}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} className="w-full" required />
            </div>

            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input id="icon" name="icon" value={formData.icon} onChange={handleChange} className="w-full" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="parent">Parent Category (Optional)</Label>
            <Input id="parent" name="parent" value={formData.parent} onChange={handleChange} className="w-full" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleSelectChange("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6 pt-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Custom Fields</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Define the fields that will be shown when users create items in this category.
            </p>

            {customFields.length > 0 ? (
              <div className="space-y-3 mb-6">
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 border rounded-md bg-muted/40">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.label}</span>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {field.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Field name: {field.name}</p>
                      {field.options && field.options.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-muted-foreground">Options:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {field.options.map((option, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveFieldUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveFieldDown(index)}
                        disabled={index === customFields.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveField(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-md mb-6">
                <p className="text-muted-foreground">No custom fields defined yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add fields below or load a predefined category template.
                </p>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Add New Field</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fieldLabel">Field Label</Label>
                    <Input
                      id="fieldLabel"
                      value={newField.label}
                      onChange={(e) => handleNewFieldChange("label", e.target.value)}
                      placeholder="e.g. Brand & Model"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldName">Field Name (System)</Label>
                    <Input
                      id="fieldName"
                      value={newField.name}
                      onChange={(e) => handleNewFieldChange("name", e.target.value)}
                      placeholder="e.g. brandModel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select value={newField.type} onValueChange={(value) => handleNewFieldChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 h-full">
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="fieldRequired"
                        checked={newField.required}
                        onCheckedChange={(checked) => handleNewFieldChange("required", checked)}
                      />
                      <Label htmlFor="fieldRequired">Required Field</Label>
                    </div>
                  </div>
                </div>

                {["select", "radio", "checkbox"].includes(newField.type) && (
                  <div className="mt-4 border rounded-md p-4">
                    <Label className="mb-2 block">Options</Label>

                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newField.newOption}
                        onChange={(e) => handleNewFieldChange("newOption", e.target.value)}
                        placeholder="Add an option"
                      />
                      <Button type="button" onClick={handleAddOption} disabled={!newField.newOption.trim()}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>

                    {newField.options.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {newField.options.map((option, index) => (
                          <Badge key={index} className="flex items-center gap-1 py-1 px-3">
                            {option}
                            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveOption(index)} />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No options added yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  onClick={handleAddField}
                  disabled={!newField.name || !newField.label || !newField.type}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" /> Save Category
        </Button>
      </div>
    </form>
  )
}

