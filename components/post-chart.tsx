"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Table", value: 2 },
  { name: "Chair", value: 4 },
  { name: "Sofa", value: 3 },
  { name: "Mobile", value: 6 },
  { name: "TV", value: 2 },
  { name: "TV Stand", value: 1 },
  { name: "Car", value: 3 },
]

export function PostChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="value" fill="#004D4D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

