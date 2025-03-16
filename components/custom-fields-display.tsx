"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/utils/api-client"
import { format } from "date-fns"

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

interface CustomFieldsDisplayProps {
  targetType: "item" | "template"
  fieldValues: Record<string, any>
}

export function CustomFieldsDisplay({ targetType, fieldValues }: CustomFieldsDisplayProps) {
  const [fields, setFields] = useState<CustomField[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch field definitions
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true)

        const response = await apiClient.fetch<{ fields: CustomField[] }>("/api/custom-fields", {
          cacheTime: 60000, // Cache for 1 minute
        })

        // Filter fields based on target type and active status
        const filteredFields = response.fields.filter(
          (field) => field.isActive && (field.target === targetType || field.target === "both"),
        )

        // Sort by order
        filteredFields.sort((a, b) => a.order - b.order)

        setFields(filteredFields)
      } catch (error) {
        console.error("Failed to fetch custom fields:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFields()
  }, [targetType])

  // Format field value based on type
  const formatFieldValue = (field: CustomField, value: any) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-muted-foreground italic">Not set</span>
    }

    switch (field.type) {
      case "checkbox":
        return value ? "Yes" : "No"

      case "date":
        try {
          return format(new Date(value), "PPP")
        } catch (error) {
          return value
        }

      case "multiselect":
        if (Array.isArray(value)) {
          return value.join(", ")
        }
        return value

      case "color":
        return (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: value }} />
            <span>{value}</span>
          </div>
        )

      default:
        return value
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

  // Filter out fields that don't have values
  const fieldsWithValues = fields.filter(
    (field) => fieldValues[field.key] !== undefined && fieldValues[field.key] !== null && fieldValues[field.key] !== "",
  )

  if (fieldsWithValues.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="py-6 text-center text-muted-foreground">
            <p>No custom fields data available.</p>
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
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {fieldsWithValues.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="text-sm font-medium">{field.name}</div>
              <div>{formatFieldValue(field, fieldValues[field.key])}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

