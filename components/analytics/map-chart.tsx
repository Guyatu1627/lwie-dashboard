"use client"

import { useState, useEffect } from "react"
import { ResponsiveContainer } from "recharts"

export function MapChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading map...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <div className="relative h-full w-full bg-gray-100 rounded-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Geographic distribution map</p>
            <p className="text-xs text-muted-foreground">Showing user concentration by region</p>
          </div>
        </div>
        <svg width="100%" height="100%" viewBox="0 0 800 450" className="absolute inset-0">
          {/* Simplified world map outline */}
          <path
            d="M200,100 Q300,50 400,100 T600,100 Q700,150 600,200 T400,200 Q300,250 200,200 T100,100"
            fill="none"
            stroke="#ccc"
            strokeWidth="2"
          />

          {/* Hotspots */}
          <circle cx="300" cy="120" r="15" fill="#004D4D" fillOpacity="0.7" />
          <circle cx="450" cy="150" r="20" fill="#004D4D" fillOpacity="0.8" />
          <circle cx="380" cy="180" r="10" fill="#004D4D" fillOpacity="0.6" />
          <circle cx="520" cy="140" r="12" fill="#004D4D" fillOpacity="0.7" />
          <circle cx="250" cy="160" r="8" fill="#004D4D" fillOpacity="0.5" />
        </svg>
      </div>
    </ResponsiveContainer>
  )
}

