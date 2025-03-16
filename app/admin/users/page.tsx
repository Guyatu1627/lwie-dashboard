"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Plus, ChevronRight, Pencil, Trash2, Search, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FieldAdder } from "@/components/field-adder"
import { Separator } from "@/components/ui/separator"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    // Simulate API call
    const fetchUsers = () => {
      const mockUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
          status: "Active",
          lastLogin: "2024-01-15 14:30",
          joinDate: "2023-05-10",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "Manager",
          status: "Active",
          lastLogin: "2024-01-14 09:15",
          joinDate: "2023-06-22",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
          role: "User",
          status: "Inactive",
          lastLogin: "2023-12-05 11:45",
          joinDate: "2023-07-15",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily.davis@example.com",
          role: "User",
          status: "Active",
          lastLogin: "2024-01-10 16:20",
          joinDate: "2023-08-30",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "5",
          name: "Michael Wilson",
          email: "michael.wilson@example.com",
          role: "Manager",
          status: "Suspended",
          lastLogin: "2023-11-28 13:10",
          joinDate: "2023-09-12",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search query, role filter, and status filter
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, roleFilter, statusFilter, users])

  const handleAddField = (field) => {
    setCustomFields((prev) => [...prev, field])

    // In a real application, you would send this to your backend
    console.log("Added new custom field to users:", field)
  }

  const columns = [
    {
      accessorKey: "avatar",
      header: "",
      cell: ({ row }) => (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={row.getValue("avatar") || "/placeholder.svg"}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role")
        let badgeClass = ""

        switch (role) {
          case "Admin":
            badgeClass = "bg-purple-500"
            break
          case "Manager":
            badgeClass = "bg-blue-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{role}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        let badgeClass = ""

        switch (status) {
          case "Active":
            badgeClass = "bg-green-500"
            break
          case "Inactive":
            badgeClass = "bg-gray-500"
            break
          case "Suspended":
            badgeClass = "bg-red-500"
            break
          default:
            badgeClass = "bg-gray-500"
        }

        return <Badge className={badgeClass}>{status}</Badge>
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="View Details">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
          <FieldAdder onAddField={handleAddField} entityName="Users" />
        </div>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="icon" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Role: {roleFilter === "all" ? "All" : roleFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Admin")}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("Manager")}>Manager</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("User")}>User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Suspended")}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {customFields.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Custom Fields</Badge>
                <span className="text-sm text-muted-foreground">
                  {customFields.length} custom {customFields.length === 1 ? "field" : "fields"} added
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {customFields.map((field, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {field.label} ({field.type})
                  </Badge>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          <DataTable columns={columns} data={filteredUsers} />
        </div>
      </Card>
    </div>
  )
}

