"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, CheckCircle, XCircle } from "lucide-react"

export function RecentItems() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for recent items
    const fetchItems = () => {
      setItems([
        {
          id: "1",
          name: "Living Room Set",
          category: "Furniture",
          date: "2024-01-14",
          status: "Pending",
        },
        {
          id: "2",
          name: "MacBook Pro 2023",
          category: "Electronics",
          date: "2024-01-13",
          status: "Approved",
        },
        {
          id: "3",
          name: "Vintage Bicycle",
          category: "Sports",
          date: "2024-01-12",
          status: "Rejected",
        },
        {
          id: "4",
          name: "Designer Handbag",
          category: "Fashion",
          date: "2024-01-11",
          status: "Pending",
        },
      ])
    }

    fetchItems()
  }, [])

  if (!mounted) {
    return <div className="h-[200px] flex items-center justify-center">Loading...</div>
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "Rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>
    }
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {item.status === "Pending" && (
                    <>
                      <Button variant="ghost" size="icon" title="Approve">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Reject">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" title="View Details">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

