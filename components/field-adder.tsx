"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/utils/api-client"

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

interface FieldAdderProps {
  targetType: "item" | "template"
  entityId?: string
  existingValues?: Record<string, any>
  onFieldsChange: (fields: Record<string, any>) => void
  readOnly?: boolean
}

export function FieldAdder({
  targetType,
  entityId,
  existingValues = {},
  onFieldsChange,
  readOnly = false,
}: FieldAdderProps) {
  const [availableFields, setAvailableFields] = useState<CustomField[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(existingValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()

  // Fetch available custom fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true)

        // Fetch fields that apply to this target type
        const response = await apiClient.fetch<{ fields: CustomField[] }>("/api/custom-fields", {
          cacheTime: 60000, // Cache for 1 minute
        })

        // Filter fields based on target type and active status
        const filteredFields = response.fields.filter(
          (field) => field.isActive && (field.target === targetType || field.target === "both"),
        )

        // Sort by order
        filteredFields.sort((a, b) => a.order - b.order)

        setAvailableFields(filteredFields)

        // Initialize field values with defaults for any fields that don't have values yet
        const initialValues = { ...fieldValues }
        filteredFields.forEach((field) => {
          if (initialValues[field.key] === undefined && field.defaultValue) {
            initialValues[field.key] = field.defaultValue
          }
        })

        setFieldValues(initialValues)
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
  }, [targetType, toast, fieldValues])

  // Update parent component when field values change
  useEffect(() => {
    onFieldsChange(fieldValues)
  }, [fieldValues, onFieldsChange])

  // Handle field value change
  const handleFieldChange = (key: string, value: any) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  // Validate fields
  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {}

    availableFields.forEach((field) => {
      // Check required fields
      if (field.required) {
        const value = fieldValues[field.key]

        if (value === undefined || value === null || value === "") {
          newErrors[field.key] = "This field is required"
        }
      }

      // Check validation pattern if provided
      if (field.validation && fieldValues[field.key]) {
        try {
          const regex = new RegExp(field.validation)
          if (!regex.test(String(fieldValues[field.key]))) {
            newErrors[field.key] = "Invalid format"
          }
        } catch (error) {
          console.error("Invalid regex pattern:", field.validation)
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Render field based on its type
  const renderField = (field: CustomField) => {
    const value = fieldValues[field.key]
    const error = errors[field.key]

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.key}
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.key}
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      case "number":
        return (
          <Input
            id={field.key}
            type="number"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={(val) => handleFieldChange(field.key, val)} disabled={readOnly}>
            <SelectTrigger id={field.key} className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : []

        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((val) => (
                <div key={val} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs">
                  <span>{val}</span>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        handleFieldChange(
                          field.key,
                          selectedValues.filter((v) => v !== val),
                        )
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {!readOnly && (
              <Select
                value=""
                onValueChange={(val) => {
                  if (!selectedValues.includes(val)) {
                    handleFieldChange(field.key, [...selectedValues, val])
                  }
                }}
              >
                <SelectTrigger id={field.key} className={error ? "border-red-500" : ""}>
                  <SelectValue placeholder={field.placeholder || "Add an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options
                    ?.filter((option) => !selectedValues.includes(option))
                    .map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
              disabled={readOnly}
            />
            <label
              htmlFor={field.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.placeholder || "Yes"}
            </label>
          </div>
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-red-500",
                )}
                disabled={readOnly}
              >
                {value ? format(new Date(value), "PPP") : field.placeholder || "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleFieldChange(field.key, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "file":
        // In a real implementation, this would handle file uploads
        return (
          <div className="space-y-2">
            <Input
              id={field.key}
              type="file"
              disabled={readOnly}
              className={error ? "border-red-500" : ""}
              onChange={(e) => {
                // In a real implementation, you would handle file upload here
                // For now, just store the file name
                const file = e.target.files?.[0]
                if (file) {
                  handleFieldChange(field.key, file.name)
                }
              }}
            />
            {value && <div className="text-sm text-muted-foreground">Current file: {value}</div>}
          </div>
        )

      case "color":
        return (
          <div className="flex gap-2">
            <Input
              id={field.key}
              type="color"
              value={value || "#000000"}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              disabled={readOnly}
              className={cn("w-12 p-1", error && "border-red-500")}
            />
            <Input
              value={value || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || "#000000"}
              disabled={readOnly}
              className={error ? "border-red-500" : ""}
            />
          </div>
        )

      case "url":
        return (
          <Input
            id={field.key}
            type="url"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || "https://example.com"}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      case "email":
        return (
          <Input
            id={field.key}
            type="email"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || "user@example.com"}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      case "phone":
        return (
          <Input
            id={field.key}
            type="tel"
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || "+1 (555) 123-4567"}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )

      default:
        return (
          <Input
            id={field.key}
            value={value || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={error ? "border-red-500" : ""}
          />
        )
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading custom fields...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availableFields.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="py-6 text-center text-muted-foreground">
            <p>No custom fields available for this {targetType}.</p>
            <Button variant="link" onClick={() => window.open(`/admin/items/fields`, "_blank")} className="mt-2">
              Manage Custom Fields
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <Label htmlFor={field.key} className="flex items-center">
                {field.name}
                {field.required && <span className="ml-1 text-sm text-red-500">*</span>}
              </Label>
              {field.description && <span className="text-xs text-muted-foreground">{field.description}</span>}
            </div>
            {renderField(field)}
            {errors[field.key] && <p className="text-xs text-red-500">{errors[field.key]}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

