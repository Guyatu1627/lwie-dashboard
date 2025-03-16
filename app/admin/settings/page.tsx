"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    autoApprove: false,
    emailNotifications: true,
    itemsPerPage: "10",
    defaultView: "grid",
    language: "english",
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    ipRestriction: false,
    activityLogging: true,
  })

  // API settings
  const [apiSettings, setApiSettings] = useState({
    apiKey: "sk_live_51NXxxxxxxxxxxxxxxxxxxx",
    readItems: true,
    writeItems: true,
    readUsers: true,
    writeUsers: false,
  })

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: "system",
    accentColor: "blue",
    fontSize: "medium",
    animationsEnabled: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleGeneralChange = (key: string, value: any) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleApiChange = (key: string, value: any) => {
    setApiSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleThemeChange = (key: string, value: any) => {
    setThemeSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Simulate API call
    setSaveSuccess(false)
    setSaveError(null)

    setTimeout(() => {
      // Success
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleCopyApiKey = () => {
    navigator.clipboard
      .writeText(apiSettings.apiKey)
      .then(() => {
        alert("API key copied to clipboard")
      })
      .catch(() => {
        alert("Failed to copy API key")
      })
  }

  const handleRegenerateApiKey = () => {
    // Simulate API call
    setSaveSuccess(false)
    setSaveError(null)

    setTimeout(() => {
      // Generate a new fake API key
      const newApiKey =
        "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      setApiSettings((prev) => ({
        ...prev,
        apiKey: newApiKey,
      }))

      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and platform preferences</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to Dashboard
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          <Check className="h-4 w-4" />
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure how the Lwie platform works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-approve">Auto-approve new items</Label>
                  <Switch
                    id="auto-approve"
                    checked={generalSettings.autoApprove}
                    onCheckedChange={(checked) => handleGeneralChange("autoApprove", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, new items will be automatically approved without manual review
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Email notifications</Label>
                  <Switch
                    id="notifications"
                    checked={generalSettings.emailNotifications}
                    onCheckedChange={(checked) => handleGeneralChange("emailNotifications", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new items, user registrations, and reports
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items per page</Label>
                <Select
                  value={generalSettings.itemsPerPage}
                  onValueChange={(value) => handleGeneralChange("itemsPerPage", value)}
                >
                  <SelectTrigger id="items-per-page">
                    <SelectValue placeholder="Select items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 items</SelectItem>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Number of items to display per page in listings</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-view">Default view</Label>
                <RadioGroup
                  id="default-view"
                  value={generalSettings.defaultView}
                  onValueChange={(value) => handleGeneralChange("defaultView", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="grid-view" />
                    <Label htmlFor="grid-view">Grid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list-view" />
                    <Label htmlFor="list-view">List</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => handleGeneralChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-4" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Two-factor authentication</Label>
                  <Switch
                    id="two-factor"
                    checked={securitySettings.twoFactor}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactor", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                <Select
                  value={securitySettings.sessionTimeout}
                  onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                >
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ip-restriction">IP address restriction</Label>
                  <Switch
                    id="ip-restriction"
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={(checked) => handleSecurityChange("ipRestriction", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Restrict login to specific IP addresses or ranges</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="activity-logging">Activity logging</Label>
                  <Switch
                    id="activity-logging"
                    checked={securitySettings.activityLogging}
                    onCheckedChange={(checked) => handleSecurityChange("activityLogging", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Log all admin actions for security audit purposes</p>
              </div>

              <Button className="mt-4" onClick={handleSaveSettings}>
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value={apiSettings.apiKey} readOnly />
                  <Button variant="outline" onClick={handleCopyApiKey}>
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your API key provides full access to your account. Keep it secure!
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>API Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-items">Read Items</Label>
                    <Switch
                      id="read-items"
                      checked={apiSettings.readItems}
                      onCheckedChange={(checked) => handleApiChange("readItems", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="write-items">Write Items</Label>
                    <Switch
                      id="write-items"
                      checked={apiSettings.writeItems}
                      onCheckedChange={(checked) => handleApiChange("writeItems", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="read-users">Read Users</Label>
                    <Switch
                      id="read-users"
                      checked={apiSettings.readUsers}
                      onCheckedChange={(checked) => handleApiChange("readUsers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="write-users">Write Users</Label>
                    <Switch
                      id="write-users"
                      checked={apiSettings.writeUsers}
                      onCheckedChange={(checked) => handleApiChange("writeUsers", checked)}
                    />
                  </div>
                </div>
              </div>

              <Button className="mt-4" onClick={handleRegenerateApiKey}>
                Regenerate API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the dashboard looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <RadioGroup
                  id="theme"
                  value={themeSettings.theme}
                  onValueChange={(value) => handleThemeChange("theme", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light-theme" />
                    <Label htmlFor="light-theme">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark-theme" />
                    <Label htmlFor="dark-theme">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system-theme" />
                    <Label htmlFor="system-theme">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Select
                  value={themeSettings.accentColor}
                  onValueChange={(value) => handleThemeChange("accentColor", value)}
                >
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={themeSettings.fontSize} onValueChange={(value) => handleThemeChange("fontSize", value)}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Enable animations</Label>
                  <Switch
                    id="animations"
                    checked={themeSettings.animationsEnabled}
                    onCheckedChange={(checked) => handleThemeChange("animationsEnabled", checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Toggle animations and transitions throughout the interface
                </p>
              </div>

              <Button className="mt-4" onClick={handleSaveSettings}>
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

