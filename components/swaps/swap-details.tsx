"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Calendar, User, MapPin, DollarSign, MessageSquare, AlertTriangle } from "lucide-react"

export function SwapDetails({ swap, onApprove, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Item 1</h3>
              <Badge variant="outline">{swap.item1Category}</Badge>
            </div>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Item Image</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">{swap.item1}</h4>
                <p className="text-sm text-muted-foreground">Owner: {swap.item1Owner}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Item 2</h3>
              <Badge variant="outline">{swap.item2Category}</Badge>
            </div>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">Item Image</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium">{swap.item2}</h4>
                <p className="text-sm text-muted-foreground">Owner: {swap.item2Owner}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Swap Details</h3>
          <Badge
            className={
              swap.status === "Completed"
                ? "bg-green-500"
                : swap.status === "Cancelled"
                  ? "bg-red-500"
                  : swap.status === "Pending"
                    ? "bg-yellow-500"
                    : swap.status === "In Progress"
                      ? "bg-blue-500"
                      : swap.status === "Disputed"
                        ? "bg-orange-500"
                        : "bg-gray-500"
            }
          >
            {swap.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Initiated: {new Date(swap.initiatedDate).toLocaleDateString()}</span>
            </div>
            {swap.completedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Completed: {new Date(swap.completedDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location: {swap.location}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Estimated Value: {swap.value}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Messages: {swap.messages}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                Participants: {swap.item1Owner}, {swap.item2Owner}
              </span>
            </div>
          </div>
        </div>

        {swap.hasDispute && (
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-700">Dispute Reported</h4>
                <p className="text-sm text-orange-600 mt-1">
                  {swap.disputeReason || "This swap has an active dispute that requires attention."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        {(swap.status === "Pending" || swap.status === "In Progress") && (
          <>
            <Button variant="destructive" onClick={() => onCancel(swap.id)}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Swap
            </Button>
            <Button onClick={() => onApprove(swap.id)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Swap
            </Button>
          </>
        )}
        <Button variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message Participants
        </Button>
      </div>
    </div>
  )
}

