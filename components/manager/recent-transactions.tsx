"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  user: string
  amount: string
  type: string
  status: string
  date: string
}

export function RecentTransactions() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          id: "tx-001",
          user: "John Smith",
          amount: "$120.00",
          type: "Ad Payment",
          status: "completed",
          date: "2024-01-15",
        },
        {
          id: "tx-002",
          user: "Emily Johnson",
          amount: "$85.50",
          type: "Premium Listing",
          status: "completed",
          date: "2024-01-14",
        },
        {
          id: "tx-003",
          user: "Michael Brown",
          amount: "$250.00",
          type: "Featured Ad",
          status: "processing",
          date: "2024-01-13",
        },
        {
          id: "tx-004",
          user: "Sarah Wilson",
          amount: "$45.00",
          type: "Subscription",
          status: "completed",
          date: "2024-01-12",
        },
      ]

      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleViewDetails = (id: string) => {
    router.push(`/manager/payments?id=${id}`)
  }

  const handleDownloadReceipt = (id: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Receipt for transaction ${id} is being downloaded.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center">Loading recent transactions...</div>
  }

  if (transactions.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No recent transactions</div>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.user}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View Details"
                    onClick={() => handleViewDetails(transaction.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download Receipt"
                    onClick={() => handleDownloadReceipt(transaction.id)}
                  >
                    <Download className="h-4 w-4" />
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

