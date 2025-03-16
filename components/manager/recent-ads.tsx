"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for recent advertisements
const recentAds = [
  {
    id: "ad-001",
    title: "Premium Electronics Promotion",
    advertiser: "John Smith",
    category: "Electronics",
    budget: 250,
    submittedAt: "2023-11-15T10:30:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ad-002",
    title: "Vehicle Showcase",
    advertiser: "Auto Traders Inc.",
    category: "Vehicles",
    budget: 500,
    submittedAt: "2023-11-14T14:45:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ad-003",
    title: "Fashion Collection Spotlight",
    advertiser: "Style Boutique",
    category: "Fashion",
    budget: 150,
    submittedAt: "2023-11-16T09:15:00Z",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export function ManagerRecentAds() {
  const handleApprove = (adId) => {
    // In a real app, this would call an API to approve the ad
    alert(`Approving advertisement: ${adId}`)
  }

  const handleReject = (adId) => {
    // In a real app, this would call an API to reject the ad
    alert(`Rejecting advertisement: ${adId}`)
  }

  return (
    <div className="space-y-4">
      {recentAds.map((ad) => (
        <Card key={ad.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={ad.image} alt={ad.title} />
                <AvatarFallback>{ad.title.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{ad.title}</p>
                  <Badge variant="outline">{ad.category}</Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{ad.advertiser}</span>
                  <span className="mx-1">•</span>
                  <span>${ad.budget}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(ad.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex border-t">
              <Button
                variant="ghost"
                className="flex-1 rounded-none text-green-500 hover:text-green-700 hover:bg-green-100"
                onClick={() => handleApprove(ad.id)}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-none text-red-500 hover:text-red-700 hover:bg-red-100"
                onClick={() => handleReject(ad.id)}
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

