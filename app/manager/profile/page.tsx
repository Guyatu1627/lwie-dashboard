"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  User,
  Lock,
  Bell,
  Upload,
  Shield,
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  Smartphone,
  MapPin,
  Briefcase,
  Calendar,
  Save,
} from "lucide-react"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(160, { message: "Bio must not be longer than 160 characters." }).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  joinDate: z.string().optional(),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>
type SecurityFormValues = z.infer<typeof securityFormSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState("/placeholder.svg?height=128&width=128")

  // Mock user data
  const defaultValues: Partial<ProfileFormValues> = {
    name: "Sarah Johnson",
    email: "sarah.johnson@lwie.com",
    bio: "Manager at Lwie Swapping Platform with 5+ years of experience in digital marketplaces and e-commerce.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    jobTitle: "Senior Platform Manager",
    department: "Operations",
    joinDate: "2021-06-15",
  }

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true,
    loginAlerts: true,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    loginHistory: true,
  })

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  function onProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1000)
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string)
          toast({
            title: "Avatar updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  function updateNotificationSetting(key: string, value: boolean) {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  function updateSecuritySetting(key: string, value: boolean) {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button onClick={() => router.push("/manager")}>
          <LogOut className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatar} alt="Profile picture" className="object-cover" />
                    <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        Change Avatar
                      </div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Your phone number" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Your location" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input placeholder="Your job title" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Your department" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us a little about yourself"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Brief description for your profile. URLs are hyperlinked.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="joinDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Join Date</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <Input type="date" {...field} disabled />
                            </div>
                          </FormControl>
                          <FormDescription>This is the date you joined the platform.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>Password must be at least 8 characters long.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSecuritySetting("twoFactorAuth", checked)}
                    />
                  </div>

                  {securitySettings.twoFactorAuth && (
                    <div className="ml-6 p-4 border rounded-md bg-muted/50">
                      <h4 className="font-medium mb-2">Set up Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use an authenticator app like Google Authenticator or Authy to scan the QR code.
                      </p>
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 rounded-md">
                          <img src="/placeholder.svg?height=150&width=150" alt="QR Code" className="h-32 w-32" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <div className="flex gap-2">
                          <Input id="verificationCode" placeholder="Enter 6-digit code" />
                          <Button variant="secondary">Verify</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after 30 minutes of inactivity
                      </p>
                    </div>
                    <Switch
                      id="sessionTimeout"
                      checked={securitySettings.sessionTimeout}
                      onCheckedChange={(checked) => updateSecuritySetting("sessionTimeout", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginHistory">Login History</Label>
                      <p className="text-sm text-muted-foreground">Keep track of where you're logged in</p>
                    </div>
                    <Switch
                      id="loginHistory"
                      checked={securitySettings.loginHistory}
                      onCheckedChange={(checked) => updateSecuritySetting("loginHistory", checked)}
                    />
                  </div>
                </div>

                {securitySettings.loginHistory && (
                  <div className="mt-4 space-y-4">
                    <h4 className="font-medium">Recent Login Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Current Session</p>
                            <p className="text-xs text-muted-foreground">San Francisco, CA • Chrome on Mac</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Just now</p>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Mobile App</p>
                            <p className="text-xs text-muted-foreground">San Francisco, CA • iPhone 13</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Failed Login Attempt</p>
                            <p className="text-xs text-muted-foreground">New York, NY • Firefox on Windows</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      View Full Login History
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Security settings saved",
                      description: "Your security preferences have been updated successfully.",
                    })
                  }}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Communication</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting("pushNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => updateNotificationSetting("weeklyReports", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Marketing</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => updateNotificationSetting("marketingEmails", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="securityAlerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about security incidents</p>
                    </div>
                    <Switch
                      id="securityAlerts"
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => updateNotificationSetting("securityAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginAlerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new logins to your account</p>
                    </div>
                    <Switch
                      id="loginAlerts"
                      checked={notificationSettings.loginAlerts}
                      onCheckedChange={(checked) => updateNotificationSetting("loginAlerts", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Notification preferences saved",
                    description: "Your notification preferences have been updated successfully.",
                  })
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

