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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Clock, User, Building, Tag, Check, X, MessageSquare } from "lucide-react"

interface AdRequest {
  id: string
  title: string
  advertiser: {
    id: string
    name: string
    email: string
    company: string
  }
  type: string
  status: string
  submittedAt: string
  budget: string
  duration: number
  category: string
  description: string
  image?: string
}

interface AdRequestDetailProps {
  request: AdRequest
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  onMessage: (id: string) => void
}

export function AdRequestDetail({ request, onClose, onApprove, onReject, onMessage }: AdRequestDetailProps) {
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isMessaging, setIsMessaging] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  const handleApprove = () => {
    onApprove(request.id)
  }

  const handleReject = () => {
    if (isRejecting) {
      onReject(request.id, rejectionReason)
    } else {
      setIsRejecting(true)
    }
  }

  const handleMessage = () => {
    if (isMessaging) {
      if (message.trim()) {
        onMessage(request.id)
        onClose()
      }
    } else {
      setIsMessaging(true)
    }
  }

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advertisement Request Details</DialogTitle>
          <DialogDescription>Review the advertisement request details before taking action.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Request Details</TabsTrigger>
            <TabsTrigger value="preview">Ad Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold">{request.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {request.category}
                  </Badge>
                  <Badge variant="outline">{request.type}</Badge>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{request.advertiser.company}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{request.advertiser.name}</span>
                    <span className="text-muted-foreground ml-2">({request.advertiser.email})</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Budget: {request.budget}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Duration: {request.duration} days</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Submitted: {new Date(request.submittedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>ID: {request.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 p-3 border rounded-md text-sm bg-muted/30">{request.description}</div>
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

                {isMessaging && (
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message to Advertiser
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message to the advertiser..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
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
                {request.image ? (
                  <img
                    src={request.image || "/placeholder.svg"}
                    alt={request.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No preview image available
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{request.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {request.category}
                  </Badge>
                  <Badge variant="outline">{request.type}</Badge>
                </div>
                <div className="text-sm mt-2">
                  <span className="text-muted-foreground">By </span>
                  <span className="font-medium">{request.advertiser.company}</span>
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
              {isMessaging ? "Send Message" : "Message Advertiser"}
            </Button>
          </div>

          {request.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="destructive" onClick={handleReject} className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                {isRejecting ? "Confirm Rejection" : "Reject"}
              </Button>
              <Button onClick={handleApprove} disabled={isRejecting || isMessaging} className="flex items-center">
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

