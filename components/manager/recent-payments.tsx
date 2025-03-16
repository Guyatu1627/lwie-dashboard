"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for recent payments
const recentPayments = [
  {
    id: "pay-001",
    user: "John Smith",
    amount: 250,
    type: "Premium Listing",
    createdAt: "2023-11-15T10:30:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pay-002",
    user: "Auto Traders Inc.",
    amount: 500,
    type: "Advertisement",
    createdAt: "2023-11-14T14:45:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pay-003",
    user: "Style Boutique",
    amount: 150,
    type: "Premium Listing",
    createdAt: "2023-11-16T09:15:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function ManagerRecentPayments() {
  const handleApprove = (paymentId) => {
    // In a real app, this would call an API to approve the payment
    alert(`Approving payment: ${paymentId}`)
  }

  const handleReject = (paymentId) => {
    // In a real app, this would call an API to reject the payment
    alert(`Rejecting payment: ${paymentId}`)
  }

  return (
    <div className="space-y-4">
      {recentPayments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={payment.image} alt={payment.user} />
                <AvatarFallback>{payment.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{payment.user}</p>
                  <Badge variant={payment.type === "Advertisement" ? "outline" : "secondary"}>{payment.type}</Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>${payment.amount}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex border-t">
              <Button
                variant="ghost"
                className="flex-1 rounded-none text-green-500 hover:text-green-700 hover:bg-green-100"
                onClick={() => handleApprove(payment.id)}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-none text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={() => handleReject(payment.id)}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

