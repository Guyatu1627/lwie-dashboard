"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import { Search, HelpCircle, Mail, Phone, MessageSquare, FileText, Book, Video, ExternalLink } from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // FAQ data
  const faqs = [
    {
      question: "How do I approve or reject marketplace items?",
      answer:
        "Navigate to the Marketplace section, find the item you want to review, click on the three dots menu, and select 'Approve' or 'Reject'. You can also view item details first by selecting 'View Details'.",
      category: "  or 'Reject'. You can also view item details first by selecting 'View Details'.",
      category: "marketplace",
    },
    {
      question: "How do I create and send notifications to users?",
      answer:
        "Go to the Notifications section, click 'New Notification', fill in the required information including title, message, type, priority, and target audience. You can send it immediately or save as a draft for later.",
      category: "notifications",
    },
    {
      question: "Can I schedule notifications to be sent at a specific time?",
      answer:
        "Yes, when creating or editing a notification, save it as a draft first. Then from the drafts tab, select the notification, click the three dots menu and choose 'Schedule'. You'll be able to set the date and time for delivery.",
      category: "notifications",
    },
    {
      question: "How do I check user verification status?",
      answer:
        "Navigate to the Users section, where verification status is displayed for each user with a badge. You can filter users by verification status using the tab options at the top of the page.",
      category: "users",
    },
    {
      question: "What actions can I take on user accounts?",
      answer:
        "From the Users page, you can view user details, edit their information, verify accounts, suspend users for policy violations, or activate previously suspended accounts. Use the actions menu (three dots) to access these options.",
      category: "users",
    },
    {
      question: "How do I feature an item in the marketplace?",
      answer:
        "Go to the Marketplace section, find the item you want to feature, click the three dots menu, and select 'Feature Item'. Featured items will appear with a highlighted badge and receive more visibility on the platform.",
      category: "marketplace",
    },
    {
      question: "How do I analyze platform performance?",
      answer:
        "Use the Analytics page to view comprehensive data about platform usage, user growth, engagement metrics, and revenue trends. You can filter by date range and export reports in various formats.",
      category: "analytics",
    },
    {
      question: "What payment information can I view and manage?",
      answer:
        "The Payments section shows all transaction details, including payment methods, amounts, status, and related items or services. You can filter transactions, view details, and process refunds when necessary.",
      category: "payments",
    },
    {
      question: "How do I handle user disputes?",
      answer:
        "Disputes are managed through the Users section. When viewing a user's details, check the 'Disputes' tab to see any open cases. You can view the details, communicate with both parties, and make resolution decisions.",
      category: "users",
    },
    {
      question: "Can I customize notification settings?",
      answer:
        "Yes, in the Settings page, navigate to the 'Notifications' tab where you can configure default notification settings, including delivery preferences, templates, and automated notification rules.",
      category: "settings",
    },
  ]

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    if (
      searchQuery &&
      !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (selectedCategory !== "all" && faq.category !== selectedCategory) {
      return false
    }

    return true
  })

  // Predefined documentation links
  const documentation = [
    { title: "Manager Dashboard Overview", type: "guide", link: "#manager-dashboard-overview" },
    { title: "User Management Guide", type: "guide", link: "#user-management-guide" },
    { title: "Marketplace Moderation", type: "guide", link: "#marketplace-moderation" },
    { title: "Creating Effective Notifications", type: "guide", link: "#creating-notifications" },
    { title: "Analytics & Reporting", type: "tutorial", link: "#analytics-reporting" },
    { title: "Payment Processing", type: "tutorial", link: "#payment-processing" },
    { title: "Platform Settings Configuration", type: "reference", link: "#platform-settings" },
    { title: "API Documentation", type: "reference", link: "#api-documentation" },
    { title: "Security Best Practices", type: "guide", link: "#security-practices" },
    { title: "Using the Report Generator", type: "tutorial", link: "#report-generator" },
  ]

  // Video tutorials
  const videoTutorials = [
    { title: "Getting Started with the Manager Dashboard", duration: "5:23", link: "#video1" },
    { title: "Advanced User Management", duration: "8:47", link: "#video2" },
    { title: "Moderating Marketplace Content", duration: "6:12", link: "#video3" },
    { title: "Creating and Scheduling Notifications", duration: "4:36", link: "#video4" },
    { title: "Understanding Analytics Reports", duration: "7:15", link: "#video5" },
  ]

  const handleSubmitTicket = (e) => {
    e.preventDefault()
    toast({
      title: "Support Ticket Submitted",
      description: "Our team will get back to you within 24 hours",
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions or contact our support team</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for help topics..."
          className="pl-10 h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Video Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact Support</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "users" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("users")}
            >
              Users
            </Button>
            <Button
              variant={selectedCategory === "marketplace" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("marketplace")}
            >
              Marketplace
            </Button>
            <Button
              variant={selectedCategory === "notifications" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("notifications")}
            >
              Notifications
            </Button>
            <Button
              variant={selectedCategory === "analytics" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("analytics")}
            >
              Analytics
            </Button>
            <Button
              variant={selectedCategory === "payments" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("payments")}
            >
              Payments
            </Button>
            <Button
              variant={selectedCategory === "settings" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("settings")}
            >
              Settings
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the manager dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-1">We couldn't find any FAQs matching your search criteria</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{faq.question}</span>
                          <Badge variant="outline" className="ml-2">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 bg-muted rounded-md">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Comprehensive guides, tutorials, and reference materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentation.map((doc, index) => (
                  <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <Badge variant="outline" className="mt-2">
                            {doc.type === "guide" ? (
                              <Book className="mr-1 h-3 w-3" />
                            ) : doc.type === "tutorial" ? (
                              <Video className="mr-1 h-3 w-3" />
                            ) : (
                              <FileText className="mr-1 h-3 w-3" />
                            )}
                            {doc.type}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={doc.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Tutorials Tab */}
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Step-by-step visual guides for common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videoTutorials.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-24 w-32 bg-muted rounded-md flex items-center justify-center mr-4">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Duration: {video.duration}</p>
                    </div>
                    <Button asChild>
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        Watch
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Submit a Support Ticket</h3>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Briefly describe your issue" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide details about your issue"
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Ticket
                    </Button>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground mt-1">Send us an email at support@lwie.com</p>
                        <p className="text-sm text-muted-foreground">Response time: Within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Phone Support</h4>
                        <p className="text-sm text-muted-foreground mt-1">Call us at +1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Available: Monday-Friday, 9AM-5PM ET</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Live Chat</h4>
                        <p className="text-sm text-muted-foreground mt-1">Chat with a support representative</p>
                        <p className="text-sm text-muted-foreground">Available: 24/7 for emergency issues</p>
                        <Button variant="outline" className="mt-2">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Form components
function Label({ htmlFor, children, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
    >
      {children}
    </label>
  )
}

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function Select({ children, defaultValue }) {
  return (
    <div>
      <select
        defaultValue={defaultValue}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
    </div>
  )
}

function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>
}

function SelectContent({ children }) {
  return <>{children}</>
}

function SelectTrigger({ id, children }) {
  return <div id={id}>{children}</div>
}

function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

