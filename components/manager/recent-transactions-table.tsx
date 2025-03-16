"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const initialTransactions = [
  {
    id: "t1",
    type: "Swap Request",
    status: "Pending",
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    item: "Vintage Camera",
    requestedItem: "Mountain Bike",
    date: "10 minutes ago",
    value: "$120",
  },
  {
    id: "t2",
    type: "Swap Completed",
    status: "Completed",
    user: {
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    item: "Designer Watch",
    requestedItem: "Leather Jacket",
    date: "2 hours ago",
    value: "$350",
  },
  {
    id: "t3",
    type: "Swap Request",
    status: "Pending",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    item: "Gaming Console",
    requestedItem: "Smartphone",
    date: "3 hours ago",
    value: "$280",
  },
  {
    id: "t4",
    type: "Swap Cancelled",
    status: "Cancelled",
    user: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    item: "Fitness Equipment",
    requestedItem: "Tablet",
    date: "5 hours ago",
    value: "$150",
  },
  {
    id: "t5",
    type: "Swap Completed",
    status: "Completed",
    user: {
      name: "David Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    item: "Drone",
    requestedItem: "Digital Camera",
    date: "1 day ago",
    value: "$400",
  },
]

export function RecentTransactionsTable() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance to add a new transaction
      if (Math.random() < 0.2) {
        const newTransaction = {
          id: `t${Math.floor(Math.random() * 1000)}`,
          type: Math.random() > 0.7 ? "Swap Completed" : "Swap Request",
          status: Math.random() > 0.7 ? "Completed" : "Pending",
          user: {
            name: ["Alex Thompson", "Lisa Rodriguez", "Robert Martinez", "Jessica Taylor"][
              Math.floor(Math.random() * 4)
            ],
            avatar: "/placeholder.svg?height=40&width=40",
          },
          item: ["Laptop", "Bicycle", "Furniture", "Headphones", "Speakers"][Math.floor(Math.random() * 5)],
          requestedItem: ["Smartphone", "Tablet", "Camera", "TV", "Game Console"][Math.floor(Math.random() * 5)],
          date: "Just now",
          value: `$${Math.floor(Math.random() * 500) + 50}`,
        }

        setIsAnimating(true)
        setTransactions((prev) => [newTransaction, ...prev.slice(0, 4)])

        setTimeout(() => {
          setIsAnimating(false)
        }, 1000)

        toast({
          title: "New transaction",
          description: `${newTransaction.user.name} initiated a new ${newTransaction.type.toLowerCase()}`,
        })
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleAction = (action, transactionId) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              status: action === "approve" ? "Completed" : "Cancelled",
              type: action === "approve" ? "Swap Completed" : "Swap Cancelled",
            }
          : transaction,
      ),
    )

    toast({
      title: action === "approve" ? "Transaction approved" : "Transaction rejected",
      description: `Successfully ${action === "approve" ? "approved" : "rejected"} transaction ID: ${transactionId}`,
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 hover:bg-green-600"
      case "Pending":
        return "bg-amber-500 hover:bg-amber-600"
      case "Cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={transaction.id}
              className={`group transition-colors hover:bg-muted/50 ${index === 0 && isAnimating ? "animate-pulse bg-muted/30" : ""}`}
            >
              <TableCell className="font-medium">{transaction.type}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={transaction.user.avatar} alt={transaction.user.name} />
                    <AvatarFallback>{transaction.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{transaction.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{transaction.item}</div>
                  <div className="text-muted-foreground">↔️ {transaction.requestedItem}</div>
                </div>
              </TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.value}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      toast({
                        title: "Transaction details",
                        description: `Viewing details for transaction ID: ${transaction.id}`,
                      })
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>

                  {transaction.status === "Pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAction("approve", transaction.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAction("reject", transaction.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

