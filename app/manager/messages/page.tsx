"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Send, PaperclipIcon, RefreshCw, Phone, Video, Info, MoreVertical, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Contact {
  id: string
  name: string
  role: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  attachments?: { name: string; url: string; type: string }[]
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const contactId = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load contacts and messages
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          id: "adv-001",
          name: "TechGadgets Inc.",
          role: "Advertiser",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "Thank you for reviewing our advertisement request.",
          lastMessageTime: "10:30 AM",
          unread: 2,
          online: true,
        },
        {
          id: "adv-004",
          name: "GreenEats",
          role: "Advertiser",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "When can we expect a decision on our ad?",
          lastMessageTime: "Yesterday",
          unread: 1,
          online: false,
        },
        {
          id: "adv-008",
          name: "ArtisanCrafts",
          role: "Advertiser",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "We've updated our ad creative as requested.",
          lastMessageTime: "Yesterday",
          unread: 0,
          online: true,
        },
        {
          id: "adv-010",
          name: "LinguaLearn",
          role: "Advertiser",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "Looking forward to your feedback on our campaign.",
          lastMessageTime: "2 days ago",
          unread: 0,
          online: false,
        },
        {
          id: "adv-012",
          name: "FitLife Pro",
          role: "Advertiser",
          avatar: "/placeholder.svg?height=40&width=40",
          lastMessage: "Thanks for approving our advertisement!",
          lastMessageTime: "3 days ago",
          unread: 0,
          online: true,
        },
      ]

      setContacts(mockContacts)
      setFilteredContacts(mockContacts)
      setIsLoading(false)

      // If there's a contact ID in the URL, select that contact
      if (contactId) {
        const contact = mockContacts.find((c) => c.id === contactId)
        if (contact) {
          setSelectedContact(contact)
          loadMessages(contact.id)
        }
      }
    }, 1000)
  }, [contactId])

  // Filter contacts based on search query
  useEffect(() => {
    if (contacts.length === 0) return

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      setFilteredContacts(
        contacts.filter(
          (contact) => contact.name.toLowerCase().includes(query) || contact.role.toLowerCase().includes(query),
        ),
      )
    } else {
      setFilteredContacts(contacts)
    }
  }, [contacts, searchQuery])

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load messages for a contact
  const loadMessages = (contactId: string) => {
    // Simulate API call
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: "msg-001",
          senderId: contactId,
          receiverId: "manager-001",
          content:
            "Hello, I've submitted an advertisement request for our new product line. Could you please review it when you have a chance?",
          timestamp: "2024-01-27T10:15:00Z",
          isRead: true,
        },
        {
          id: "msg-002",
          senderId: "manager-001",
          receiverId: contactId,
          content:
            "Hi there! I'll take a look at your advertisement request today. Is there anything specific you'd like me to know about the campaign?",
          timestamp: "2024-01-27T10:20:00Z",
          isRead: true,
        },
        {
          id: "msg-003",
          senderId: contactId,
          receiverId: "manager-001",
          content:
            "Thank you for the quick response! We're targeting a younger demographic with this campaign, and we're hoping to run it for at least 30 days.",
          timestamp: "2024-01-27T10:25:00Z",
          isRead: true,
        },
        {
          id: "msg-004",
          senderId: contactId,
          receiverId: "manager-001",
          content: "Also, we've attached some additional creative assets that you might find useful.",
          timestamp: "2024-01-27T10:26:00Z",
          isRead: true,
          attachments: [
            {
              name: "campaign_assets.zip",
              url: "#",
              type: "application/zip",
            },
          ],
        },
        {
          id: "msg-005",
          senderId: "manager-001",
          receiverId: contactId,
          content:
            "Thanks for the additional information. I've reviewed your request and the creative assets look great. I just have a few questions about your budget allocation.",
          timestamp: "2024-01-27T11:05:00Z",
          isRead: true,
        },
        {
          id: "msg-006",
          senderId: contactId,
          receiverId: "manager-001",
          content: "Of course! What would you like to know about our budget?",
          timestamp: "2024-01-27T11:10:00Z",
          isRead: true,
        },
        {
          id: "msg-007",
          senderId: "manager-001",
          receiverId: contactId,
          content:
            "I'm wondering if you have flexibility in your budget for premium placement? The campaign might perform better with featured positioning.",
          timestamp: "2024-01-27T11:15:00Z",
          isRead: true,
        },
        {
          id: "msg-008",
          senderId: contactId,
          receiverId: "manager-001",
          content:
            "We do have some flexibility. We could increase our budget by about 15% for premium placement if you think it would significantly improve performance.",
          timestamp: "2024-01-27T11:20:00Z",
          isRead: false,
        },
        {
          id: "msg-009",
          senderId: contactId,
          receiverId: "manager-001",
          content: "When can we expect a decision on our advertisement request?",
          timestamp: "2024-01-27T11:30:00Z",
          isRead: false,
        },
      ]

      setMessages(mockMessages)
    }, 500)
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Messages refreshed",
        description: "Your messages have been updated",
      })
    }, 1500)
  }

  // Handle contact selection
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)

    // Mark messages as read
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)))

    loadMessages(contact.id)
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: "manager-001",
        receiverId: selectedContact.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isRead: false,
      }

      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")
      setIsSending(false)

      // Update last message in contacts
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? {
                ...c,
                lastMessage: newMessage,
                lastMessageTime: "Just now",
              }
            : c,
        ),
      )
    }, 500)
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for message groups
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2 hidden md:inline">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Contacts List */}
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Contacts</CardTitle>
            <CardDescription>Your message conversations</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading contacts...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No contacts found</div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.lastMessageTime}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                          {contact.unread > 0 && <Badge className="ml-2 bg-primary">{contact.unread}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        {selectedContact.role}
                        {selectedContact.online && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-500 text-white">
                            Online
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Call">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Video Call">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Info">
                      <Info className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Contact</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                        <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                        <DropdownMenuItem>Block Contact</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No messages yet</div>
                  ) : (
                    <div className="space-y-4">
                      {/* Group messages by date */}
                      {(() => {
                        const messagesByDate: { [key: string]: Message[] } = {}

                        messages.forEach((message) => {
                          const date = formatMessageDate(message.timestamp)
                          if (!messagesByDate[date]) {
                            messagesByDate[date] = []
                          }
                          messagesByDate[date].push(message)
                        })

                        return Object.entries(messagesByDate).map(([date, msgs]) => (
                          <div key={date} className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="bg-muted px-3 py-1 rounded-full text-xs">{date}</div>
                            </div>

                            {msgs.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.senderId === "manager-001" ? "justify-end" : "justify-start"}`}
                              >
                                <div className="max-w-[80%]">
                                  {message.senderId !== "manager-001" && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                                        <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs font-medium">{selectedContact.name}</span>
                                    </div>
                                  )}
                                  <div
                                    className={`p-3 rounded-lg ${
                                      message.senderId === "manager-001"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    {message.attachments && message.attachments.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {message.attachments.map((attachment, index) => (
                                          <div
                                            key={index}
                                            className={`flex items-center gap-2 p-2 rounded ${
                                              message.senderId === "manager-001"
                                                ? "bg-primary-foreground/10"
                                                : "bg-background"
                                            }`}
                                          >
                                            <PaperclipIcon className="h-4 w-4" />
                                            <span className="text-xs flex-1 truncate">{attachment.name}</span>
                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                              Download
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground text-right">
                                    {formatTimestamp(message.timestamp)}
                                    {message.senderId === "manager-001" && (
                                      <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      })()}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[80px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="icon" title="Attach File">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-muted-foreground mt-1">Select a contact from the list to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

