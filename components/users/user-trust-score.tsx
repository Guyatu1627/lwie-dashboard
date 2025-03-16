"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function UserTrustScore({ user }) {
  // Calculate trust score color
  const getTrustScoreColor = (score) => {
    if (score < 30) return "text-red-500"
    if (score < 60) return "text-yellow-500"
    return "text-green-500"
  }

  // Calculate trust score progress color
  const getTrustScoreProgressColor = (score) => {
    if (score < 30) return "bg-red-500"
    if (score < 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Trust factors
  const trustFactors = [
    {
      name: "Identity Verification",
      status: user.verificationLevel === "Verified" ? "positive" : "negative",
      description:
        user.verificationLevel === "Verified"
          ? "User has verified their identity"
          : "User has not completed identity verification",
      icon: user.verificationLevel === "Verified" ? CheckCircle : XCircle,
    },
    {
      name: "Swap Completion Rate",
      status: user.swapCount > 5 ? "positive" : "neutral",
      description:
        user.swapCount > 5
          ? `Completed ${user.swapCount} swaps successfully`
          : `Only completed ${user.swapCount} swaps`,
      icon: user.swapCount > 5 ? CheckCircle : AlertTriangle,
    },
    {
      name: "Account Age",
      status: "positive",
      description: `Member since ${user.joinDate}`,
      icon: CheckCircle,
    },
    {
      name: "Reports Against User",
      status: user.reportCount === 0 ? "positive" : "negative",
      description:
        user.reportCount === 0 ? "No reports against this user" : `${user.reportCount} reports against this user`,
      icon: user.reportCount === 0 ? CheckCircle : AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trust Score</CardTitle>
          <CardDescription>Overall trust score based on user activity and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className={`text-5xl font-bold ${getTrustScoreColor(user.trustScore)}`}>{user.trustScore}</div>
            <Progress
              value={user.trustScore}
              className="w-full h-2"
              indicatorClassName={getTrustScoreProgressColor(user.trustScore)}
            />
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <Badge
              className={user.trustScore < 30 ? "bg-red-500" : user.trustScore < 60 ? "bg-yellow-500" : "bg-green-500"}
            >
              {user.trustScore < 30 ? "Low Trust" : user.trustScore < 60 ? "Medium Trust" : "High Trust"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trust Factors</CardTitle>
          <CardDescription>Factors that contribute to the trust score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trustFactors.map((factor, index) => (
              <div key={index}>
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      factor.status === "positive"
                        ? "bg-green-100 text-green-500"
                        : factor.status === "negative"
                          ? "bg-red-100 text-red-500"
                          : "bg-yellow-100 text-yellow-500"
                    }`}
                  >
                    <factor.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{factor.name}</h4>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
                {index < trustFactors.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

