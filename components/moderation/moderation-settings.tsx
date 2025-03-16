"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function ModerationSettings() {
  const [autoModeration, setAutoModeration] = useState(true)
  const [aiModeration, setAiModeration] = useState(true)
  const [sensitivityLevel, setSensitivityLevel] = useState([70])
  const [autoFlag, setAutoFlag] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="auto-moderation" className="text-base">
            Automatic Moderation
          </Label>
          <p className="text-sm text-muted-foreground">Automatically moderate content based on rules</p>
        </div>
        <Switch id="auto-moderation" checked={autoModeration} onCheckedChange={setAutoModeration} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="ai-moderation" className="text-base">
            AI-Powered Moderation
          </Label>
          <p className="text-sm text-muted-foreground">Use AI to detect prohibited content</p>
        </div>
        <Switch
          id="ai-moderation"
          checked={aiModeration}
          onCheckedChange={setAiModeration}
          disabled={!autoModeration}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sensitivity" className="text-base">
          AI Sensitivity
        </Label>
        <p className="text-sm text-muted-foreground mb-6">Adjust how sensitive the AI is to potential violations</p>
        <Slider
          id="sensitivity"
          disabled={!autoModeration || !aiModeration}
          value={sensitivityLevel}
          onValueChange={setSensitivityLevel}
          max={100}
          step={1}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs">Low</span>
          <span className="text-xs">Medium</span>
          <span className="text-xs">High</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="auto-flag" className="text-base">
            Auto-Flag Suspicious Content
          </Label>
          <p className="text-sm text-muted-foreground">Automatically flag content that may violate policies</p>
        </div>
        <Switch id="auto-flag" checked={autoFlag} onCheckedChange={setAutoFlag} disabled={!autoModeration} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="require-approval" className="text-base">
            Require Approval for All Items
          </Label>
          <p className="text-sm text-muted-foreground">All items require moderator approval before being listed</p>
        </div>
        <Switch id="require-approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
      </div>
    </div>
  )
}

