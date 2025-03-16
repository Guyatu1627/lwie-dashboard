"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Camera, Check, Key, Mail, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@lwie.com",
    bio: "Platform administrator with 5+ years of experience in digital marketplace management.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatarUrl: "/placeholder.svg?height=128&width=128",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    securityAlerts: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveProfile = () => {
    // Simulate API call
    setSaveSuccess(false)
    setSaveError(null)

    setTimeout(() => {
      // Validation
      if (!profileData.name || !profileData.email) {
        setSaveError("Name and email are required fields")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileData.email)) {
        setSaveError("Please enter a valid email address")
        return
      }

      // Success
      setSaveSuccess(true)
      setIsEditing(false)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleSavePassword = () => {
    // Simulate API call
    setSaveSuccess(false)
    setSaveError(null)

    setTimeout(() => {
      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setSaveError("All password fields are required")
        return
      }

      if (passwordData.newPassword.length < 8) {
        setSaveError("New password must be at least 8 characters long")
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSaveError("New passwords do not match")
        return
      }

      // Success
      setSaveSuccess(true)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleSaveNotifications = () => {
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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profile Management</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          Back to Dashboard
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          <Check className="h-4 w-4" />
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatarUrl} alt="Profile" className="object-cover" />
                    <AvatarFallback className="text-2xl">AD</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" variant="secondary">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change avatar</span>
                  </Button>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          className="pl-10"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Your phone number"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, Country"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </>
              ) : (
                <>
                  <div></div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className="pl-10"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters and include a number and a special character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePassword} className="ml-auto">
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Receive a verification code via SMS when signing in</p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Authenticator App</h4>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes
                  </p>
                </div>
                <Button variant="outline">Set Up</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your active sessions and devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Session</h4>
                    <p className="text-sm text-muted-foreground">Chrome on Windows • San Francisco, CA • Active now</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    Current
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mobile App</h4>
                    <p className="text-sm text-muted-foreground">
                      iPhone 13 • San Francisco, CA • Last active 2 hours ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Firefox</h4>
                    <p className="text-sm text-muted-foreground">
                      Firefox on MacOS • New York, NY • Last active 5 days ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="ml-auto">
                Revoke All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications from the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Communication Channels</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in the browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of platform activity</p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyReport", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about important security events</p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} className="ml-auto">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

