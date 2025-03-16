"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { RefreshCw, Plus, ChevronRight, Pencil, Trash } from "lucide-react"
import { TemplateForm } from "@/components/template-form"

type Template = {
  id: string
  name: string
  description: string
  fields: string
  date: string
  status: string
}

const columns: ColumnDef<Template>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "fields",
    header: "Fields",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

const data: Template[] = [
  {
    id: "1",
    name: "Electronics Template",
    description: "Template for electronic items",
    fields: "Name, Brand, Model, Condition",
    date: "2023-12-14",
    status: "Active",
  },
  // Add more templates as needed
]

export default function TemplatePage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Template
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <TemplateForm onClose={() => setShowForm(false)} />
        </Card>
      )}

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Input placeholder="Search templates..." className="max-w-sm" />
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </Card>
    </div>
  )
}

