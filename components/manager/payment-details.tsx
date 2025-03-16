"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, CreditCard, User, Tag, FileText, Check, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function PaymentDetails({ payment, onClose, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = () => {
    onApprove(payment.id)
    onClose()
  }

  const handleReject = () => {
    if (isRejecting) {
      onReject(payment.id)
      onClose()
    } else {
      setIsRejecting(true)
    }
  }

  return (
    <Dialog open={!!payment} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>Review payment details before approval or rejection.</DialogDescription>
        </DialogHeader>
        {payment && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">Payment #{payment.id}</h3>
                  <Badge variant={payment.type === "Advertisement" ? "outline" : "secondary"} className="mt-1">
                    {payment.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  {payment.user}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Amount: ${payment.amount}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Method: {payment.paymentMethod}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created: {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  {payment.type === "Advertisement" ? `Ad ID: ${payment.adId}` : `Item ID: ${payment.itemId}`}
                </div>
                {payment.type === "Advertisement" && payment.adTitle && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Ad Title: {payment.adTitle}
                  </div>
                )}
                {payment.type === "Premium Listing" && payment.itemTitle && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Item Title: {payment.itemTitle}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <div className="mt-1 p-3 border rounded-md text-sm">{payment.description}</div>
            </div>

            {isRejecting && (
              <div>
                <Label htmlFor="rejection-reason" className="text-sm font-medium">
                  Rejection Reason
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {payment && payment.status === "pending" && (
            <>
              <Button variant="destructive" onClick={handleReject}>
                <X className="mr-2 h-4 w-4" />
                {isRejecting ? "Confirm Rejection" : "Reject"}
              </Button>
              <Button onClick={handleApprove} disabled={isRejecting}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

