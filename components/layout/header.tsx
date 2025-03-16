"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Menu, Search, Moon, Sun, User, LogOut, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { auth } from "@/utils/auth"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  user: any
  onMenuClick: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications)
          setUnreadCount(data.notifications.filter((n: any) => !n.read).length)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle search
  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        setIsLoading(true)

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`,
            {
              headers: {
                Authorization: `Bearer ${auth.getAccessToken()}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            setSearchResults(data.results)
          }
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsSearching(false)
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      await auth.logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out",
        variant: "destructive",
      })
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      })

      if (response.ok) {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href={user?.role === "admin" ? "/admin" : "/manager"} className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Lwie Dashboard</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-background pl-8 md:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && (
            <div className="absolute top-full mt-1 w-full rounded-md border bg-background p-2 shadow-lg">
              {isLoading ? (
                <div className="space-y-2 p-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-80 overflow-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="block rounded-md p-2 hover:bg-accent"
                      onClick={() => setIsSearching(false)}
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.description}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">No results found</div>
              )}
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-3 ${notification.read ? "bg-background" : "bg-accent"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{notification.title}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{notification.message}</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">No notifications</div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                <AvatarFallback>{getInitials(`${user?.firstName} ${user?.lastName}`)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

