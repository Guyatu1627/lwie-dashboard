"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Flag, User, Calendar, MapPin, DollarSign } from "lucide-react"

export function ItemDetails({ item, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = () => {
    onApprove(item.id)
  }

  const handleReject = () => {
    if (isRejecting) {
      onReject(item.id, rejectionReason)
    } else {
      setIsRejecting(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="aspect-video relative rounded-lg overflow-hidden border">
            <img
              src={item.images[0] || "/placeholder.svg?height=300&width=400"}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {item.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative rounded-lg overflow-hidden border">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.name} ${index + 2}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{item.category}</Badge>
              <Badge
                className={
                  item.status === "Approved"
                    ? "bg-green-500"
                    : item.status === "Rejected"
                      ? "bg-red-500"
                      : item.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                }
              >
                {item.status}
              </Badge>
              {item.flagged && (
                <Badge variant="outline" className="text-red-500 border-red-500">
                  <Flag className="h-3 w-3 mr-1" /> Flagged
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Submitted by: {item.submittedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Submitted on: {new Date(item.submittedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location: {item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Price: {item.price}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm">{item.description}</p>
          </div>

          {item.flagged && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-medium text-red-700 flex items-center gap-1">
                <Flag className="h-4 w-4" /> Flag Reason
              </h3>
              <p className="text-sm text-red-600 mt-1">{item.flagReason}</p>
            </div>
          )}
        </div>
      </div>

      {isRejecting ? (
        <div className="space-y-4">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            placeholder="Please provide a reason for rejecting this item..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={!isRejecting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleReject} disabled={isRejecting && !rejectionReason}>
          <XCircle className="mr-2 h-4 w-4" />
          {isRejecting ? "Confirm Rejection" : "Reject"}
        </Button>
        <Button onClick={handleApprove} disabled={isRejecting}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </div>
    </div>
  )
}

