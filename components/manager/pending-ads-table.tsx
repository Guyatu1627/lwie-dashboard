"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface PendingAd {
  id: string
  title: string
  advertiser: string
  advertiserId: string
  type: string
  submittedAt: string
  budget: string
}

export function PendingAdsTable() {
  const router = useRouter()
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPendingAds: PendingAd[] = [
        {
          id: "ad-001",
          title: "Premium Electronics Store Banner",
          advertiser: "TechGadgets Inc.",
          advertiserId: "adv-001",
          type: "Banner",
          submittedAt: "2024-01-20",
          budget: "$500",
        },
        {
          id: "ad-004",
          title: "Organic Food Delivery Service",
          advertiser: "GreenEats",
          advertiserId: "adv-004",
          type: "Banner",
          submittedAt: "2024-01-25",
          budget: "$350",
        },
        {
          id: "ad-008",
          title: "Handcrafted Jewelry Collection",
          advertiser: "ArtisanCrafts",
          advertiserId: "adv-008",
          type: "Featured",
          submittedAt: "2024-01-26",
          budget: "$420",
        },
        {
          id: "ad-010",
          title: "Language Learning App Promotion",
          advertiser: "LinguaLearn",
          advertiserId: "adv-010",
          type: "Spotlight",
          submittedAt: "2024-01-27",
          budget: "$650",
        },
      ]

      setPendingAds(mockPendingAds)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleApprove = (id: string) => {
    setPendingAds((ads) => ads.filter((ad) => ad.id !== id))
    toast({
      title: "Advertisement Approved",
      description: "The advertisement has been approved and is now active.",
    })
  }

  const handleReject = (id: string) => {
    setPendingAds((ads) => ads.filter((ad) => ad.id !== id))
    toast({
      title: "Advertisement Rejected",
      description: "The advertisement has been rejected.",
    })
  }

  const handleViewDetails = (id: string) => {
    router.push(`/manager/ad-requests?id=${id}`)
  }

  const handleMessageAdvertiser = (advertiserId: string) => {
    router.push(`/manager/messages?id=${advertiserId}`)
  }

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center">Loading pending advertisements...</div>
  }

  if (pendingAds.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No pending advertisements</div>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Advertisement</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingAds.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell className="font-medium">
                <div>
                  {ad.title}
                  <div className="text-xs text-muted-foreground">{ad.advertiser}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ad.type}</Badge>
              </TableCell>
              <TableCell>{ad.submittedAt}</TableCell>
              <TableCell>{ad.budget}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewDetails(ad.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApprove(ad.id)}>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Reject" onClick={() => handleReject(ad.id)}>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Message Advertiser"
                    onClick={() => handleMessageAdvertiser(ad.advertiserId)}
                  >
                    <MessageSquare className="h-4 w-4" />
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

