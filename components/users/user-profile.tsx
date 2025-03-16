"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, MapPin, Calendar, Package, RefreshCw, ShieldCheck, UserX, Edit } from "lucide-react"

export function UserProfile({ user }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Badge
              className={
                user.status === "Active"
                  ? "bg-green-500"
                  : user.status === "Suspended"
                    ? "bg-red-500"
                    : user.status === "Inactive"
                      ? "bg-gray-500"
                      : "bg-yellow-500"
              }
            >
              {user.status}
            </Badge>
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>

        <Separator className="md:hidden" />

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Joined: {user.joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last Active: {user.lastActive}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Verification: {user.verificationLevel}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <Package className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{user.itemCount}</span>
                <span className="text-sm text-muted-foreground">Items Listed</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{user.swapCount}</span>
                <span className="text-sm text-muted-foreground">Swaps Completed</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center">
                <ShieldCheck className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-2xl font-bold">{user.trustScore}</span>
                <span className="text-sm text-muted-foreground">Trust Score</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Email User
        </Button>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
        <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-100">
          <UserX className="mr-2 h-4 w-4" />
          {user.status === "Suspended" ? "Unsuspend User" : "Suspend User"}
        </Button>
      </div>
    </div>
  )
}

