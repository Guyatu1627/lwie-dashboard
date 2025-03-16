"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function Overview() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    setMounted(true)

    // Simulate API call for activity data
    const fetchData = () => {
      setData([
        { name: "Jan", items: 45, users: 12 },
        { name: "Feb", items: 62, users: 18 },
        { name: "Mar", items: 78, users: 24 },
        { name: "Apr", items: 56, users: 16 },
        { name: "May", items: 89, users: 28 },
        { name: "Jun", items: 104, users: 32 },
      ])
    }

    fetchData()
  }, [])

  if (!mounted) {
    return <div className="h-[350px] flex items-center justify-center">Loading...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="items" name="New Items" fill="#004D4D" radius={[4, 4, 0, 0]} />
        <Bar dataKey="users" name="New Users" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

