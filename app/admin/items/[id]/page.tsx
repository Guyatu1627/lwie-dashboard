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

interface Category {
  id: string
  name: string
}

interface Item {
  id: string
  name: string
  description: string
  categoryId: string
  status: string
  createdAt: string
  updatedAt: string
  customFields?: Record<string, any>
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Fetch item and category
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch item
        const itemResponse = await apiClient.fetch<{ item: Item }>(`/api/items/${params.id}`)
        setItem(itemResponse.item)

        // Fetch category
        if (itemResponse.item.categoryId) {
          const categoryResponse = await apiClient.fetch<{ category: Category }>(
            `/api/categories/${itemResponse.item.categoryId}`,
          )
          setCategory(categoryResponse.category)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load item data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  // Handle item deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(true)

      await apiClient.fetch(`/api/items/${params.id}`, {
        method: "DELETE",
      })

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })

      router.push("/admin/items")
    } catch (error) {
      console.error("Failed to delete item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-500"
      case "draft":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading item...</span>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Item not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/items")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="text-muted-foreground">Item details and properties</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/items/${params.id}/edit`)}>
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
              <CardDescription>Basic item details and properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Name</div>
                  <div>{item.name}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Category</div>
                  <div>{category ? category.name : "Uncategorized"}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Created</div>
                  <div>{new Date(item.createdAt).toLocaleString()}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Last Updated</div>
                  <div>{new Date(item.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Description</div>
                <div className="whitespace-pre-wrap">{item.description || "No description provided."}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-fields" className="space-y-4">
          <CustomFieldsDisplay targetType="item" fieldValues={item.customFields || {}} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

