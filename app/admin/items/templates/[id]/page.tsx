"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CustomFieldsDisplay } from "@/components/custom-fields-display"
import { apiClient } from "@/utils/api-client"

interface Template {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  customFields?: Record<string, any>
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true)

        const response = await apiClient.fetch<{ template: Template }>(`/api/templates/${params.id}`)
        setTemplate(response.template)
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

  // Handle template deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)

      await apiClient.fetch(`/api/templates/${params.id}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Template deleted successfully",
      })

      router.push("/admin/items/templates")
    } catch (error) {
      console.error("Failed to delete template:", error)
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/items/templates")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
            <p className="text-muted-foreground">Template details and properties</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/items/templates/${params.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic template details and properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>{template.name}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>
                    <Badge className={template.isActive ? "bg-green-500" : "bg-gray-500"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Created</div>
                  <div>{new Date(template.createdAt).toLocaleString()}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Last Updated</div>
                  <div>{new Date(template.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Description</div>
                <div className="whitespace-pre-wrap">{template.description || "No description provided."}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-fields" className="space-y-4">
          <CustomFieldsDisplay targetType="template" fieldValues={template.customFields || {}} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

