"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye, MoreHorizontal, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdvertisementDetails } from "@/components/manager/advertisement-details"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

interface AdvertisementListProps {
  filterStatus?: string
  searchQuery?: string
}

export function AdvertisementList({ filterStatus, searchQuery }: AdvertisementListProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([])
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)

  useEffect(() => {
    setMounted(true)

    // Simulate API call
    const mockAds: Advertisement[] = [
      {
        id: "ad-001",
        title: "Premium Electronics Store Banner",
        advertiser: "TechGadgets Inc.",
        advertiserId: "adv-001",
        type: "Banner",
        status: "pending",
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        budget: "$500",
        impressions: 0,
        clicks: 0,
        description:
          "Promoting our premium electronics store with high-quality gadgets and tech accessories at competitive prices.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-002",
        title: "Summer Fashion Collection Promotion",
        advertiser: "StyleHub",
        advertiserId: "adv-002",
        type: "Featured",
        status: "active",
        startDate: "2024-01-10",
        endDate: "2024-02-10",
        budget: "$750",
        impressions: 12500,
        clicks: 430,
        description: "Showcasing our summer collection featuring sustainable fashion items for all ages.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-003",
        title: "Luxury Car Dealership Spotlight",
        advertiser: "Premium Motors",
        advertiserId: "adv-003",
        type: "Spotlight",
        status: "active",
        startDate: "2024-01-05",
        endDate: "2024-02-05",
        budget: "$1,200",
        impressions: 18700,
        clicks: 620,
        description: "Highlighting our exclusive deals and premium service offerings for luxury vehicles.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-004",
        title: "Organic Food Delivery Service",
        advertiser: "GreenEats",
        advertiserId: "adv-004",
        type: "Banner",
        status: "pending",
        startDate: "2024-01-25",
        endDate: "2024-02-25",
        budget: "$350",
        impressions: 0,
        clicks: 0,
        description: "Promoting our fresh, organic produce and prepared meals delivery service.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-005",
        title: "Home Renovation Services",
        advertiser: "BuildRight Construction",
        advertiserId: "adv-005",
        type: "Featured",
        status: "completed",
        startDate: "2023-12-01",
        endDate: "2023-12-31",
        budget: "$850",
        impressions: 22400,
        clicks: 780,
        description: "Showcasing our high-quality home renovations and remodeling services.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-006",
        title: "Fitness Equipment Sale",
        advertiser: "FitLife Gear",
        advertiserId: "adv-006",
        type: "Banner",
        status: "rejected",
        startDate: "N/A",
        endDate: "N/A",
        budget: "$600",
        impressions: 0,
        clicks: 0,
        description: "Promoting our major sale on all fitness equipment with discounted products.",
        image: "/placeholder.svg?height=300&width=600",
      },
      {
        id: "ad-007",
        title: "Online Course Promotion",
        advertiser: "EduLearn Academy",
        advertiserId: "adv-007",
        type: "Spotlight",
        status: "completed",
        startDate: "2023-11-15",
        endDate: "2023-12-15",
        budget: "$950",
        impressions: 31200,
        clicks: 1240,
        description: "Promoting our professional certification courses in various fields.",
        image: "/placeholder.svg?height=300&width=600",
      },
    ]

    setAdvertisements(mockAds)
  }, [])

  // Filter advertisements based on status and search query
  useEffect(() => {
    if (!mounted) return

    let filtered = [...advertisements]

    if (filterStatus) {
      filtered = filtered.filter((ad) => ad.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(query) ||
          ad.advertiser.toLowerCase().includes(query) ||
          ad.type.toLowerCase().includes(query),
      )
    }

    setFilteredAds(filtered)
  }, [advertisements, filterStatus, searchQuery, mounted])

  const handleApprove = (id: string) => {
    setAdvertisements((ads) => ads.map((ad) => (ad.id === id ? { ...ad, status: "active" } : ad)))
    toast({
      title: "Advertisement Approved",
      description: "The advertisement has been approved and is now active.",
    })
  }

  const handleReject = (id: string) => {
    setAdvertisements((ads) => ads.map((ad) => (ad.id === id ? { ...ad, status: "rejected" } : ad)))
    toast({
      title: "Advertisement Rejected",
      description: "The advertisement has been rejected.",
    })
  }

  const handleMessageAdvertiser = (advertiserId: string) => {
    router.push("/manager/messages")
    toast({
      title: "Messaging Advertiser",
      description: "Opening messaging interface to contact the advertiser.",
    })
  }

  const getStatusBadge = (status: string) => {
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

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Advertisement</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
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
                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                <TableCell>
                  {ad.status === "rejected" ? (
                    "N/A"
                  ) : (
                    <div className="text-sm">
                      {ad.startDate} <span className="text-muted-foreground">to</span> {ad.endDate}
                    </div>
                  )}
                </TableCell>
                <TableCell>{ad.budget}</TableCell>
                <TableCell>
                  {ad.status === "active" || ad.status === "completed" ? (
                    <div className="text-sm">
                      <div>{ad.impressions.toLocaleString()} impressions</div>
                      <div>{ad.clicks.toLocaleString()} clicks</div>
                      <div className="text-xs text-muted-foreground">
                        CTR: {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Details" onClick={() => setSelectedAd(ad)}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    {ad.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" title="Approve" onClick={() => handleApprove(ad.id)}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject" onClick={() => handleReject(ad.id)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Message Advertiser"
                      onClick={() => handleMessageAdvertiser(ad.advertiserId)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem>Download Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No advertisements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Advertisement Details Dialog */}
      {selectedAd && (
        <AdvertisementDetails
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onMessage={handleMessageAdvertiser}
        />
      )}
    </div>
  )
}

