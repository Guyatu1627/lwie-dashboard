"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FieldAdder } from "@/components/field-adder"
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
  customFields?: Record<string, any>
}

export default function EditItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [customFields, setCustomFields] = useState<Record<string, any>>({})

  const router = useRouter()
  const { toast } = useToast()

  // Fetch item and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch item
        const itemResponse = await apiClient.fetch<{ item: Item }>(`/api/items/${params.id}`)
        setItem(itemResponse.item)

        // Initialize custom fields
        if (itemResponse.item.customFields) {
          setCustomFields(itemResponse.item.customFields)
        }

        // Fetch categories
        const categoriesResponse = await apiClient.fetch<{ categories: Category[] }>("/api/categories")
        setCategories(categoriesResponse.categories)
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

  // Handle form input change
  const handleInputChange = (field: keyof Item, value: any) => {
    if (item) {
      setItem({
        ...item,
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

    if (!item) return

    try {
      setIsSaving(true)

      // Update item with custom fields
      const updatedItem = {
        ...item,
        customFields,
      }

      await apiClient.fetch(`/api/items/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedItem),
      })

      toast({
        title: "Success",
        description: "Item updated successfully",
      })

      router.push("/admin/items")
    } catch (error) {
      console.error("Failed to update item:", error)
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
        <p className="text-muted-foreground">Update item details and properties</p>
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
                <CardDescription>Basic item details and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={item.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={item.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={item.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={item.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-fields" className="space-y-4">
            <FieldAdder
              targetType="item"
              entityId={params.id}
              existingValues={customFields}
              onFieldsChange={handleCustomFieldsChange}
            />
          </TabsContent>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/items")}>
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

