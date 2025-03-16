"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Ban, Clock, Globe, Trash2 } from "lucide-react"
import { DataTable } from "@/components/data-table"

// Mock data for IP bans
const ipBansData = [
  {
    id: 1,
    ipAddress: "192.168.1.1",
    reason: "Multiple failed login attempts",
    bannedAt: "2024-01-14T10:23:45",
    expiresAt: "2024-01-21T10:23:45",
    status: "Active",
  },
  {
    id: 2,
    ipAddress: "192.168.2.2",
    reason: "Suspicious activity",
    bannedAt: "2024-01-13T09:15:30",
    expiresAt: "2024-01-20T09:15:30",
    status: "Active",
  },
  {
    id: 3,
    ipAddress: "192.168.3.3",
    reason: "Fraud attempt",
    bannedAt: "2024-01-12T18:45:12",
    expiresAt: null,
    status: "Permanent",
  },
  {
    id: 4,
    ipAddress: "192.168.4.4",
    reason: "Account takeover attempt",
    bannedAt: "2024-01-11T14:30:22",
    expiresAt: "2024-01-18T14:30:22",
    status: "Active",
  },
  {
    id: 5,
    ipAddress: "192.168.5.5",
    reason: "Prohibited content",
    bannedAt: "2024-01-10T11:20:15",
    expiresAt: "2024-01-17T11:20:15",
    status: "Active",
  },
]

export function IPBanList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ipBans] = useState(ipBansData)

  const filteredBans = ipBans.filter(
    (ban) =>
      ban.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ban.reason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const columns = [
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "bannedAt",
      header: "Banned At",
      cell: ({ row }) => {
        return <div>{new Date(row.getValue("bannedAt")).toLocaleString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return <Badge className={status === "Permanent" ? "bg-red-500" : "bg-yellow-500"}>{status}</Badge>
      },
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => {
        const expiresAt = row.getValue("expiresAt")
        return expiresAt ? (
          <div>{new Date(expiresAt).toLocaleString()}</div>
        ) : (
          <Badge variant="outline" className="text-red-500">
            Never
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Remove Ban">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search IP addresses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Ban className="mr-2 h-4 w-4" />
          Add New Ban
        </Button>
      </div>

      <DataTable columns={columns} data={filteredBans} pagination={true} />

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Automatic IP Ban Duration</p>
            <p className="text-xs text-muted-foreground">Default duration for automatic IP bans</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input type="number" defaultValue="7" className="w-16 text-center" />
          <span className="text-sm">days</span>
        </div>
      </div>
    </div>
  )
}

