"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, Calendar, MessageSquare, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function DisputeDetails({ dispute, onResolve }) {
  const [resolution, setResolution] = useState("")
  const [isResolving, setIsResolving] = useState(false)

  const handleResolve = () => {
    if (isResolving && resolution) {
      onResolve(dispute.id, resolution)
    } else {
      setIsResolving(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Dispute: {dispute.itemName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{dispute.disputeType}</Badge>
              <Badge
                className={
                  dispute.status === "Resolved"
                    ? "bg-green-500"
                    : dispute.status === "Under Review"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                }
              >
                {dispute.status}
              </Badge>
              <Badge
                className={
                  dispute.severity === "High"
                    ? "bg-red-500"
                    : dispute.severity === "Medium"
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                }
              >
                {dispute.severity} Severity
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Reported by: {dispute.reportedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Reported against: {dispute.reportedAgainst}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Reported on: {new Date(dispute.reportDate).toLocaleDateString()}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm">{dispute.description}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Reporter
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Reported User
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Evidence</h3>

          {dispute.evidence && dispute.evidence.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {dispute.evidence.map((evidence, index) => (
                <div key={index} className="aspect-video relative rounded-lg overflow-hidden border">
                  <img
                    src={evidence || "/placeholder.svg"}
                    alt={`Evidence ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No evidence provided</p>
            </div>
          )}

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-700 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Dispute Information
            </h3>
            <p className="text-sm text-yellow-600 mt-1">
              This dispute requires moderation to determine if action needs to be taken. Review all evidence and
              communicate with both parties before resolving.
            </p>
          </div>
        </div>
      </div>

      {isResolving ? (
        <div className="space-y-4">
          <Label htmlFor="resolution">Resolution Details</Label>
          <Textarea
            id="resolution"
            placeholder="Please provide details on how this dispute was resolved..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsResolving(false)} disabled={!isResolving}>
          Cancel
        </Button>
        <Button onClick={handleResolve} disabled={isResolving && !resolution}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {isResolving ? "Confirm Resolution" : "Resolve Dispute"}
        </Button>
      </div>
    </div>
  )
}

