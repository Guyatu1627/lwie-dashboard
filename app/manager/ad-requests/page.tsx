"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  DollarSign,
  User,
  Tag,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdRequest {
  id: string
  title: string
  advertiser: string
  advertiserId: string
  type: string
  status: string
  submittedAt: string
  budget: string
  description: string
  image?: string
  category: string
  duration: number
}

export default function AdRequestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [adRequests, setAdRequests] = useState<AdRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AdRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)

  // Load ad requests
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAdRequests: AdRequest[] = [
        {
          id: "ad-001",
          title: "Premium Electronics Store Banner",
          advertiser: "TechGadgets Inc.",
          advertiserId: "adv-001",
          type: "Banner",
          status: "pending",
          submittedAt: "2024-01-20",
          budget: "$500",
          description:
            "Promoting our premium electronics store with high-quality gadgets and tech accessories at competitive prices.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Electronics",
          duration: 30,
        },
        {
          id: "ad-004",
          title: "Organic Food Delivery Service",
          advertiser: "GreenEats",
          advertiserId: "adv-004",
          type: "Banner",
          status: "pending",
          submittedAt: "2024-01-25",
          budget: "$350",
          description: "Promoting our fresh, organic produce and prepared meals delivery service.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Food & Beverage",
          duration: 14,
        },
        {
          id: "ad-008",
          title: "Handcrafted Jewelry Collection",
          advertiser: "ArtisanCrafts",
          advertiserId: "adv-008",
          type: "Featured",
          status: "pending",
          submittedAt: "2024-01-26",
          budget: "$420",
          description: "Showcasing our unique handcrafted jewelry pieces made with sustainable materials.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Fashion",
          duration: 21,
        },
        {
          id: "ad-010",
          title: "Language Learning App Promotion",
          advertiser: "LinguaLearn",
          advertiserId: "adv-010",
          type: "Spotlight",
          status: "pending",
          submittedAt: "2024-01-27",
          budget: "$650",
          description: "Promoting our innovative language learning app with AI-powered conversation practice.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Education",
          duration: 30,
        },
        {
          id: "ad-012",
          title: "Fitness Coaching Services",
          advertiser: "FitLife Pro",
          advertiserId: "adv-012",
          type: "Banner",
          status: "approved",
          submittedAt: "2024-01-15",
          budget: "$300",
          description: "Promoting our personalized fitness coaching services for all fitness levels.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Health & Fitness",
          duration: 14,
        },
        {
          id: "ad-015",
          title: "Luxury Watch Collection",
          advertiser: "TimePiece Luxury",
          advertiserId: "adv-015",
          type: "Featured",
          status: "rejected",
          submittedAt: "2024-01-10",
          budget: "$800",
          description: "Showcasing our exclusive collection of luxury timepieces from renowned brands.",
          image: "/placeholder.svg?height=300&width=600",
          category: "Luxury Goods",
          duration: 30,
        },
      ]

      setAdRequests(mockAdRequests)
      setIsLoading(false)

      // If there's a request ID in the URL, select that request
      if (requestId) {
        const request = mockAdRequests.find((req) => req.id === requestId)
        if (request) {
          setSelectedRequest(request)
        }
      }
    }, 1000)
  }, [requestId])

  // Filter ad requests based on search query and status filter
  useEffect(() => {
    if (adRequests.length === 0) return

    let filtered = [...adRequests]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(query) ||
          req.advertiser.toLowerCase().includes(query) ||
          req.type.toLowerCase().includes(query) ||
          req.category.toLowerCase().includes(query),
      )
    }

    setFilteredRequests(filtered)
  }, [adRequests, searchQuery, statusFilter])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Ad requests have been updated",
      })
    }, 1500)
  }

  // Handle view details
  const handleViewDetails = (request: AdRequest) => {
    setSelectedRequest(request)
    setIsRejecting(false)
    setRejectionReason("")
  }

  // Handle approve
  const handleApprove = (id: string) => {
    setAdRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))

    setSelectedRequest(null)

    toast({
      title: "Ad request approved",
      description: "The advertisement has been approved and is now active",
    })
  }

  // Handle reject
  const handleReject = (id: string) => {
    if (isRejecting) {
      setAdRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))

      setSelectedRequest(null)
      setIsRejecting(false)
      setRejectionReason("")

      toast({
        title: "Ad request rejected",
        description: "The advertisement has been rejected",
      })
    } else {
      setIsRejecting(true)
    }
  }

  // Handle message advertiser
  const handleMessageAdvertiser = (advertiserId: string) => {
    router.push(`/manager/messages?id=${advertiserId}`)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Advertisement Requests</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden md:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Requests</CardTitle>
              <CardDescription>Manage and review advertisement requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading advertisement requests...</div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No advertisement requests found</div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Advertisement</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            <div>
                              {request.title}
                              <div className="text-xs text-muted-foreground">{request.advertiser}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.type}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{request.submittedAt}</TableCell>
                          <TableCell>{request.budget}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View Details"
                                onClick={() => handleViewDetails(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {request.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Approve"
                                    onClick={() => handleApprove(request.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Reject"
                                    onClick={() => handleReject(request.id)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                title="Message Advertiser"
                                onClick={() => handleMessageAdvertiser(request.advertiserId)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and process pending advertisement requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading pending requests...</div>
              ) : (
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
                      {filteredRequests
                        .filter((req) => req.status === "pending" || statusFilter !== "pending")
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <div>
                                {request.title}
                                <div className="text-xs text-muted-foreground">{request.advertiser}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.type}</Badge>
                            </TableCell>
                            <TableCell>{request.submittedAt}</TableCell>
                            <TableCell>{request.budget}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Details"
                                  onClick={() => handleViewDetails(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Approve"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Reject"
                                  onClick={() => handleReject(request.id)}
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Message Advertiser"
                                  onClick={() => handleMessageAdvertiser(request.advertiserId)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>View approved advertisement requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading approved requests...</div>
              ) : (
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
                      {filteredRequests
                        .filter((req) => req.status === "approved" || statusFilter !== "approved")
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <div>
                                {request.title}
                                <div className="text-xs text-muted-foreground">{request.advertiser}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.type}</Badge>
                            </TableCell>
                            <TableCell>{request.submittedAt}</TableCell>
                            <TableCell>{request.budget}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Details"
                                  onClick={() => handleViewDetails(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Message Advertiser"
                                  onClick={() => handleMessageAdvertiser(request.advertiserId)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
              <CardDescription>View rejected advertisement requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[300px] flex items-center justify-center">Loading rejected requests...</div>
              ) : (
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
                      {filteredRequests
                        .filter((req) => req.status === "rejected" || statusFilter !== "rejected")
                        .map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              <div>
                                {request.title}
                                <div className="text-xs text-muted-foreground">{request.advertiser}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.type}</Badge>
                            </TableCell>
                            <TableCell>{request.submittedAt}</TableCell>
                            <TableCell>{request.budget}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="View Details"
                                  onClick={() => handleViewDetails(request)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Message Advertiser"
                                  onClick={() => handleMessageAdvertiser(request.advertiserId)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ad Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Advertisement Request Details</DialogTitle>
              <DialogDescription>Review advertisement request details before approval or rejection.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedRequest.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{selectedRequest.type}</Badge>
                  {getStatusBadge(selectedRequest.status)}
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {selectedRequest.advertiser}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    Budget: {selectedRequest.budget}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    Duration: {selectedRequest.duration} days
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    Submitted: {selectedRequest.submittedAt}
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    Category: {selectedRequest.category}
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <div className="mt-1 p-3 border rounded-md text-sm">{selectedRequest.description}</div>
                </div>

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

            <div className="mt-4">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-1 border rounded-md overflow-hidden">
                {selectedRequest.image ? (
                  <img
                    src={selectedRequest.image || "/placeholder.svg"}
                    alt={selectedRequest.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="h-[200px] flex items-center justify-center bg-muted">No preview image available</div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleMessageAdvertiser(selectedRequest.advertiserId)}
                  className="flex items-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Advertiser
                </Button>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex items-center"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {isRejecting ? "Confirm Rejection" : "Reject"}
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={isRejecting}
                    className="flex items-center"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

