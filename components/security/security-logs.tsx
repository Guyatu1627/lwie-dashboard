"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, ShieldAlert, UserX, Globe, AlertCircle } from "lucide-react"

// Mock data for security logs
const securityLogsData = [
  {
    id: 1,
    action: "Login Attempt Blocked",
    description: "Multiple failed login attempts from IP 192.168.1.1",
    timestamp: "2024-01-14T10:23:45",
    severity: "High",
    icon: ShieldAlert,
  },
  {
    id: 2,
    action: "User Suspended",
    description: "User bob_johnson suspended for suspicious activity",
    timestamp: "2024-01-14T09:15:30",
    severity: "Medium",
    icon: UserX,
  },
  {
    id: 3,
    action: "IP Ban",
    description: "IP 192.168.3.3 banned for fraud attempt",
    timestamp: "2024-01-13T18:45:12",
    severity: "High",
    icon: Globe,
  },
  {
    id: 4,
    action: "Security Alert",
    description: "Password reset from unrecognized device and location",
    timestamp: "2024-01-13T14:30:22",
    severity: "Critical",
    icon: AlertCircle,
  },
  {
    id: 5,
    action: "Admin Action",
    description: "Admin approved content moderation settings change",
    timestamp: "2024-01-12T11:20:15",
    severity: "Low",
    icon: Clock,
  },
]

export function SecurityLogs() {
  const [logs] = useState(securityLogsData)

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
          <div
            className={`p-2 rounded-full ${
              log.severity === "Critical"
                ? "bg-red-100 text-red-600"
                : log.severity === "High"
                  ? "bg-orange-100 text-orange-600"
                  : log.severity === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-blue-100 text-blue-600"
            }`}
          >
            <log.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{log.action}</h4>
              <Badge
                className={
                  log.severity === "Critical"
                    ? "bg-red-500"
                    : log.severity === "High"
                      ? "bg-orange-500"
                      : log.severity === "Medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                }
              >
                {log.severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(log.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

