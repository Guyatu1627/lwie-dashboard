"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function FraudDetectionSettings() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [sensitivityLevel, setSensitivityLevel] = useState([70])
  const [autoFlag, setAutoFlag] = useState(true)
  const [autoBlock, setAutoBlock] = useState(false)
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true)
  const [behavioralAnalysis, setBehavioralAnalysis] = useState(true)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="ai-detection" className="text-base">
              AI-Powered Fraud Detection
            </Label>
            <p className="text-sm text-muted-foreground">Use machine learning to detect suspicious activities</p>
          </div>
          <Switch id="ai-detection" checked={aiEnabled} onCheckedChange={setAiEnabled} />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="sensitivity" className="text-base">
          Detection Sensitivity
        </Label>
        <p className="text-sm text-muted-foreground mb-6">
          Adjust how sensitive the system is to potential fraud (higher = more strict)
        </p>
        <Slider
          id="sensitivity"
          disabled={!aiEnabled}
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

      <div className="space-y-4">
        <Label className="text-base">Automated Actions</Label>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-flag suspicious activities</p>
            <p className="text-xs text-muted-foreground">Automatically flag activities that exceed risk threshold</p>
          </div>
          <Switch disabled={!aiEnabled} checked={autoFlag} onCheckedChange={setAutoFlag} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Auto-block high-risk users</p>
            <p className="text-xs text-muted-foreground">
              Automatically block users with multiple high-risk activities
            </p>
          </div>
          <Switch disabled={!aiEnabled} checked={autoBlock} onCheckedChange={setAutoBlock} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base">Advanced Settings</Label>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Real-time monitoring</p>
            <p className="text-xs text-muted-foreground">Monitor user activities in real-time</p>
          </div>
          <Switch checked={realTimeMonitoring} onCheckedChange={setRealTimeMonitoring} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Behavioral analysis</p>
            <p className="text-xs text-muted-foreground">Analyze user behavior patterns to detect anomalies</p>
          </div>
          <Switch checked={behavioralAnalysis} onCheckedChange={setBehavioralAnalysis} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline">Save Settings</Button>
      </div>
    </div>
  )
}

