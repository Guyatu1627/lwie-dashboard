"use client"

import { useState } from "react"
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
import { Calendar, DollarSign, Clock, User, Tag, Check, X, MessageSquare, BarChart2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Advertisement {
  id: string
  title: string
  advertiser: string
  advertiserId: string
  type: string
  status: string
  startDate: string
  endDate: string
  budget: string
  impressions: number
  clicks: number
  description: string
  image?: string
}

export function AdvertisementDetails({
  ad,
  onClose,
  onApprove,
  onReject,
  onMessage,
}: {
  ad: Advertisement
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onMessage: (id: string) => void
}) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const handleApprove = () => {
    onApprove(ad.id)
    onClose()
  }

  const handleReject = () => {
    if (isRejecting) {
      onReject(ad.id)
      onClose()
    } else {
      setIsRejecting(true)
    }
  }

  const handleMessage = () => {
    onMessage(ad.advertiserId)
    onClose()
  }

  return (
    <Dialog open={!!ad} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advertisement Details</DialogTitle>
          <DialogDescription>Review advertisement details before approval or rejection.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold">{ad.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{ad.type}</Badge>
                  {getStatusBadge(ad.status)}
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {ad.advertiser}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    Budget: {ad.budget}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Duration: {ad.status !== "rejected" ? `${ad.startDate} to ${ad.endDate}` : "N/A"}
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {ad.status === "active" ? "Started" : ad.status === "completed" ? "Ran" : "Scheduled"}:{" "}
                    {ad.startDate}
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    ID: {ad.id}
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <div className="mt-1 p-3 border rounded-md text-sm">{ad.description}</div>
                </div>

                {ad.status === "active" || ad.status === "completed" ? (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Performance</Label>
                    <div className="mt-1 p-3 border rounded-md">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Impressions</div>
                          <div className="font-medium">{ad.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Clicks</div>
                          <div className="font-medium">{ad.clicks.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">CTR</div>
                          <div className="font-medium">{((ad.clicks / ad.impressions) * 100).toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Cost per Click</div>
                          <div className="font-medium">
                            ${(Number.parseInt(ad.budget.replace(/[^0-9]/g, "")) / ad.clicks).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {isRejecting && (
                  <div className="mt-4">
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
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 py-4">
            <div className="border rounded-md p-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                {ad.image ? (
                  <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No preview image available
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{ad.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{ad.type}</Badge>
                </div>
                <div className="text-sm mt-2">
                  <span className="text-muted-foreground">By </span>
                  <span className="font-medium">{ad.advertiser}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                This is a preview of how the advertisement might appear on the platform. The actual appearance may vary
                based on placement and device.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-2" />

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleMessage} className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Advertiser
            </Button>
            {(ad.status === "active" || ad.status === "completed") && (
              <Button variant="outline" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            )}
          </div>

          {ad.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="destructive" onClick={handleReject} className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                {isRejecting ? "Confirm Rejection" : "Reject"}
              </Button>
              <Button onClick={handleApprove} disabled={isRejecting} className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>
    case "pending":
      return <Badge className="bg-amber-500">Pending</Badge>
    case "completed":
      return <Badge className="bg-blue-500">Completed</Badge>
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

