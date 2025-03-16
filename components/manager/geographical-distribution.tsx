"use client"

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { ResponsiveContainer } from "recharts"

// Mock data for geographical distribution
const markers = [
  { name: "New York", coordinates: [-74.006, 40.7128], users: 2500 },
  { name: "Los Angeles", coordinates: [-118.2437, 34.0522], users: 1800 },
  { name: "London", coordinates: [-0.1278, 51.5074], users: 1600 },
  { name: "Paris", coordinates: [2.3522, 48.8566], users: 1200 },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], users: 1000 },
  { name: "Sydney", coordinates: [151.2093, -33.8688], users: 800 },
  { name: "Berlin", coordinates: [13.405, 52.52], users: 700 },
  { name: "Mumbai", coordinates: [72.8777, 19.076], users: 600 },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505], users: 500 },
  { name: "Cairo", coordinates: [31.2357, 30.0444], users: 400 },
]

export function GeographicalDistribution() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposableMap>
        <Geographies geography="/world-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D6D6DA"
                stroke="#FFFFFF"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#F53" },
                  pressed: { outline: "none", fill: "#E42" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ name, coordinates, users }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={Math.sqrt(users) / 20} fill="#F00" stroke="#FFF" strokeWidth={0.5} />
            <text textAnchor="middle" y={-10} style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "8px" }}>
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </ResponsiveContainer>
  )
}

