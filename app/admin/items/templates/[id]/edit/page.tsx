"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FieldAdder } from "@/components/field-adder"
import { apiClient } from "@/utils/api-client"

interface Template {
  id: string
  name: string
  description: string
  isActive: boolean
  customFields?: Record<string, any>
}

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [customFields, setCustomFields] = useState<Record<string, any>>({})

  const router = useRouter()
  const { toast } = useToast()

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true)

        const response = await apiClient.fetch<{ template: Template }>(`/api/templates/${params.id}`)
        setTemplate(response.template)

        // Initialize custom fields
        if (response.template.customFields) {
          setCustomFields(response.template.customFields)
        }
      } catch (error) {
        console.error("Failed to fetch template:", error)
        toast({
          title: "Error",
          description: "Failed to load template data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [params.id, toast])

  // Handle form input change
  const handleInputChange = (field: keyof Template, value: any) => {
    if (template) {
      setTemplate({
        ...template,
        [field]: value,
      })
    }
  }

  // Handle custom fields change
  const handleCustomFieldsChange = (fields: Record<string, any>) => {
    setCustomFields(fields)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!template) return

    try {
      setIsSaving(true)

      // Update template with custom fields
      const updatedTemplate = {
        ...template,
        customFields,
      }

      await apiClient.fetch(`/api/templates/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTemplate),
      })

      toast({
        title: "Success",
        description: "Template updated successfully",
      })

      router.push("/admin/items/templates")
    } catch (error) {
      console.error("Failed to update template:", error)
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading template...</span>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Template not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
        <p className="text-muted-foreground">Update template details and properties</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic template details and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={template.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={template.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-fields" className="space-y-4">
            <FieldAdder
              targetType="template"
              entityId={params.id}
              existingValues={customFields}
              onFieldsChange={handleCustomFieldsChange}
            />
          </TabsContent>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/items/templates")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}

