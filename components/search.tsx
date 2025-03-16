"use client"

import { useState, useEffect } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Search() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="relative w-full max-w-sm h-9 bg-gray-200 rounded-md"></div>
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    // In a real app, you would implement search functionality here
  }

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search items, users, templates..."
        className="pl-9 w-full bg-white dark:bg-gray-900"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  )
}

