"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Payment {
  id: string
  user: string
  email: string
  amount: string
  type: string
  status: string
  date: string
  paymentMethod: string
}

export function PaymentsList() {
  const [mounted, setMounted] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call
    const mockPayments: Payment[] = [
      {
        id: "tx-001",
        user: "John Smith",
        email: "john.smith@example.com",
        amount: "$120.00",
        type: "Ad Payment",
        status: "completed",
        date: "2024-01-15",
        paymentMethod: "Credit Card",
      },
      {
        id: "tx-002",
        user: "Emily Johnson",
        email: "emily.johnson@example.com",
        amount: "$85.50",
        type: "Premium Listing",
        status: "completed",
        date: "2024-01-14",
        paymentMethod: "PayPal",
      },
      {
        id: "tx-003",
        user: "Michael Brown",
        email: "michael.brown@example.com",
        amount: "$250.00",
        type: "Featured Ad",
        status: "processing",
        date: "2024-01-13",
        paymentMethod: "Credit Card",
      },
      {
        id: "tx-004",
        user: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        amount: "$45.00",
        type: "Subscription",
        status: "completed",
        date: "2024-01-12",
        paymentMethod: "Bank Transfer",
      },
      {
        id: "tx-005",
        user: "David Lee",
        email: "david.lee@example.com",
        amount: "$180.00",
        type: "Ad Campaign",
        status: "completed",
        date: "2024-01-11",
        paymentMethod: "Credit Card",
      },
      {
        id: "tx-006",
        user: "Jennifer Garcia",
        email: "jennifer.garcia@example.com",
        amount: "$75.00",
        type: "Premium Listing",
        status: "failed",
        date: "2024-01-10",
        paymentMethod: "Credit Card",
      },
      {
        id: "tx-007",
        user: "Robert Martinez",
        email: "robert.martinez@example.com",
        amount: "$320.00",
        type: "Ad Campaign",
        status: "completed",
        date: "2024-01-09",
        paymentMethod: "PayPal",
      },
    ]

    setPayments(mockPayments)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-amber-500">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "refunded":
        return <Badge className="bg-blue-500">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>
                  <div>
                    {payment.user}
                    <div className="text-xs text-muted-foreground">{payment.email}</div>
                  </div>
                </TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download Receipt">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Issue Refund</DropdownMenuItem>
                        <DropdownMenuItem>Contact User</DropdownMenuItem>
                        <DropdownMenuItem>Flag Transaction</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

