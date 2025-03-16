"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Settings, Save, RefreshCw, DollarSign, Clock, Users, Layers, Check } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Advertisement settings
  const [adSettings, setAdSettings] = useState({
    featuredAdPrice: 49.99,
    premiumListingPrice: 19.99,
    standardListingPrice: 9.99,
    featuredAdDuration: 30,
    premiumListingDuration: 14,
    standardListingDuration: 7,
    autoRenewAds: true,
    discountForBulkPurchase: true,
    discountPercentage: 15,
  })

  // Platform settings
  const [platformSettings, setPlatformSettings] = useState({
    maxItemsPerUser: 20,
    maxSwapsPerDay: 10,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    enableUserRatings: true,
    enableDisputeSystem: true,
    enableChatSystem: true,
    enableNotifications: true,
    notificationFrequency: "daily",
    dataRetentionPeriod: 90,
  })

  // Feature toggles
  const [featureToggles, setFeatureToggles] = useState({
    enableNewUserOnboarding: true,
    enableRecommendationEngine: true,
    enableAnalytics: true,
    enableAdvancedSearch: true,
    enableCategoryFiltering: true,
    enableLocationBasedSearch: true,
    enableItemComparisons: false,
    enableWishlist: true,
    enableSocialSharing: true,
    enableDarkMode: true,
  })

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your platform settings have been updated successfully",
      })
    }, 1500)
  }

  const handleResetSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Reset to default values
      setAdSettings({
        featuredAdPrice: 49.99,
        premiumListingPrice: 19.99,
        standardListingPrice: 9.99,
        featuredAdDuration: 30,
        premiumListingDuration: 14,
        standardListingDuration: 7,
        autoRenewAds: true,
        discountForBulkPurchase: true,
        discountPercentage: 15,
      })

      setPlatformSettings({
        maxItemsPerUser: 20,
        maxSwapsPerDay: 10,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        enableUserRatings: true,
        enableDisputeSystem: true,
        enableChatSystem: true,
        enableNotifications: true,
        notificationFrequency: "daily",
        dataRetentionPeriod: 90,
      })

      setFeatureToggles({
        enableNewUserOnboarding: true,
        enableRecommendationEngine: true,
        enableAnalytics: true,
        enableAdvancedSearch: true,
        enableCategoryFiltering: true,
        enableLocationBasedSearch: true,
        enableItemComparisons: false,
        enableWishlist: true,
        enableSocialSharing: true,
        enableDarkMode: true,
      })

      toast({
        title: "Settings reset",
        description: "All settings have been reset to their default values",
      })
    }, 1500)
  }

  const updateAdSetting = (key, value) => {
    setAdSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updatePlatformSetting = (key, value) => {
    setPlatformSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateFeatureToggle = (key, value) => {
    setFeatureToggles((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Manage and configure your platform settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="advertisements" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="advertisements" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Advertisement Settings
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Platform Settings
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Feature Toggles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advertisements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Pricing</CardTitle>
              <CardDescription>Configure pricing for different advertisement types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredAdPrice">Featured Ad Price ($)</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="featuredAdPrice"
                        type="number"
                        value={adSettings.featuredAdPrice}
                        onChange={(e) => updateAdSetting("featuredAdPrice", Number.parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premiumListingPrice">Premium Listing Price ($)</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="premiumListingPrice"
                        type="number"
                        value={adSettings.premiumListingPrice}
                        onChange={(e) => updateAdSetting("premiumListingPrice", Number.parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardListingPrice">Standard Listing Price ($)</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="standardListingPrice"
                        type="number"
                        value={adSettings.standardListingPrice}
                        onChange={(e) => updateAdSetting("standardListingPrice", Number.parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredAdDuration">Featured Ad Duration (days)</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="featuredAdDuration"
                        type="number"
                        value={adSettings.featuredAdDuration}
                        onChange={(e) => updateAdSetting("featuredAdDuration", Number.parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premiumListingDuration">Premium Listing Duration (days)</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="premiumListingDuration"
                        type="number"
                        value={adSettings.premiumListingDuration}
                        onChange={(e) => updateAdSetting("premiumListingDuration", Number.parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardListingDuration">Standard Listing Duration (days)</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="standardListingDuration"
                        type="number"
                        value={adSettings.standardListingDuration}
                        onChange={(e) => updateAdSetting("standardListingDuration", Number.parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRenewAds">Auto-Renew Advertisements</Label>
                    <p className="text-sm text-muted-foreground">Automatically renew advertisements when they expire</p>
                  </div>
                  <Switch
                    id="autoRenewAds"
                    checked={adSettings.autoRenewAds}
                    onCheckedChange={(checked) => updateAdSetting("autoRenewAds", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="discountForBulkPurchase">Discount for Bulk Purchases</Label>
                    <p className="text-sm text-muted-foreground">
                      Apply discount when users purchase multiple advertisements
                    </p>
                  </div>
                  <Switch
                    id="discountForBulkPurchase"
                    checked={adSettings.discountForBulkPurchase}
                    onCheckedChange={(checked) => updateAdSetting("discountForBulkPurchase", checked)}
                  />
                </div>

                {adSettings.discountForBulkPurchase && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="discountPercentage">Discount Percentage: {adSettings.discountPercentage}%</Label>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {adSettings.discountPercentage}%
                      </span>
                    </div>
                    <Slider
                      id="discountPercentage"
                      value={[adSettings.discountPercentage]}
                      onValueChange={(value) => updateAdSetting("discountPercentage", value[0])}
                      max={50}
                      step={5}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  updateAdSetting("featuredAdPrice", 49.99)
                  updateAdSetting("premiumListingPrice", 19.99)
                  updateAdSetting("standardListingPrice", 9.99)
                  updateAdSetting("featuredAdDuration", 30)
                  updateAdSetting("premiumListingDuration", 14)
                  updateAdSetting("standardListingDuration", 7)
                  updateAdSetting("autoRenewAds", true)
                  updateAdSetting("discountForBulkPurchase", true)
                  updateAdSetting("discountPercentage", 15)

                  toast({
                    title: "Advertisement settings reset",
                    description: "Advertisement settings have been reset to their default values",
                  })
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Advertisement settings saved",
                    description: "Your advertisement settings have been updated successfully",
                  })
                }}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Configure general platform settings and limitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxItemsPerUser">Maximum Items Per User</Label>
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="maxItemsPerUser"
                        type="number"
                        value={platformSettings.maxItemsPerUser}
                        onChange={(e) => updatePlatformSetting("maxItemsPerUser", Number.parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxSwapsPerDay">Maximum Swaps Per Day</Label>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="maxSwapsPerDay"
                        type="number"
                        value={platformSettings.maxSwapsPerDay}
                        onChange={(e) => updatePlatformSetting("maxSwapsPerDay", Number.parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetentionPeriod">Data Retention Period (days)</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="dataRetentionPeriod"
                        type="number"
                        value={platformSettings.dataRetentionPeriod}
                        onChange={(e) => updatePlatformSetting("dataRetentionPeriod", Number.parseInt(e.target.value))}
                        min="30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                    <Select
                      value={platformSettings.notificationFrequency}
                      onValueChange={(value) => updatePlatformSetting("notificationFrequency", value)}
                    >
                      <SelectTrigger id="notificationFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                      <p className="text-sm text-muted-foreground">Users must verify their email address</p>
                    </div>
                    <Switch
                      id="requireEmailVerification"
                      checked={platformSettings.requireEmailVerification}
                      onCheckedChange={(checked) => updatePlatformSetting("requireEmailVerification", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requirePhoneVerification">Require Phone Verification</Label>
                      <p className="text-sm text-muted-foreground">Users must verify their phone number</p>
                    </div>
                    <Switch
                      id="requirePhoneVerification"
                      checked={platformSettings.requirePhoneVerification}
                      onCheckedChange={(checked) => updatePlatformSetting("requirePhoneVerification", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableUserRatings">Enable User Ratings</Label>
                    <p className="text-sm text-muted-foreground">Allow users to rate each other after swaps</p>
                  </div>
                  <Switch
                    id="enableUserRatings"
                    checked={platformSettings.enableUserRatings}
                    onCheckedChange={(checked) => updatePlatformSetting("enableUserRatings", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableDisputeSystem">Enable Dispute System</Label>
                    <p className="text-sm text-muted-foreground">Allow users to open disputes for problematic swaps</p>
                  </div>
                  <Switch
                    id="enableDisputeSystem"
                    checked={platformSettings.enableDisputeSystem}
                    onCheckedChange={(checked) => updatePlatformSetting("enableDisputeSystem", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableChatSystem">Enable Chat System</Label>
                    <p className="text-sm text-muted-foreground">Allow users to chat with each other</p>
                  </div>
                  <Switch
                    id="enableChatSystem"
                    checked={platformSettings.enableChatSystem}
                    onCheckedChange={(checked) => updatePlatformSetting("enableChatSystem", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to users about platform activity</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={platformSettings.enableNotifications}
                    onCheckedChange={(checked) => updatePlatformSetting("enableNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  updatePlatformSetting("maxItemsPerUser", 20)
                  updatePlatformSetting("maxSwapsPerDay", 10)
                  updatePlatformSetting("requireEmailVerification", true)
                  updatePlatformSetting("requirePhoneVerification", false)
                  updatePlatformSetting("enableUserRatings", true)
                  updatePlatformSetting("enableDisputeSystem", true)
                  updatePlatformSetting("enableChatSystem", true)
                  updatePlatformSetting("enableNotifications", true)
                  updatePlatformSetting("notificationFrequency", "daily")
                  updatePlatformSetting("dataRetentionPeriod", 90)

                  toast({
                    title: "Platform settings reset",
                    description: "Platform settings have been reset to their default values",
                  })
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Platform settings saved",
                    description: "Your platform settings have been updated successfully",
                  })
                }}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableNewUserOnboarding">New User Onboarding</Label>
                      <p className="text-sm text-muted-foreground">Show onboarding tutorial for new users</p>
                    </div>
                    <Switch
                      id="enableNewUserOnboarding"
                      checked={featureToggles.enableNewUserOnboarding}
                      onCheckedChange={(checked) => updateFeatureToggle("enableNewUserOnboarding", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRecommendationEngine">Recommendation Engine</Label>
                      <p className="text-sm text-muted-foreground">Show personalized item recommendations</p>
                    </div>
                    <Switch
                      id="enableRecommendationEngine"
                      checked={featureToggles.enableRecommendationEngine}
                      onCheckedChange={(checked) => updateFeatureToggle("enableRecommendationEngine", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableAnalytics">User Analytics</Label>
                      <p className="text-sm text-muted-foreground">Collect and analyze user behavior data</p>
                    </div>
                    <Switch
                      id="enableAnalytics"
                      checked={featureToggles.enableAnalytics}
                      onCheckedChange={(checked) => updateFeatureToggle("enableAnalytics", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableAdvancedSearch">Advanced Search</Label>
                      <p className="text-sm text-muted-foreground">Enable advanced search filters and options</p>
                    </div>
                    <Switch
                      id="enableAdvancedSearch"
                      checked={featureToggles.enableAdvancedSearch}
                      onCheckedChange={(checked) => updateFeatureToggle("enableAdvancedSearch", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableCategoryFiltering">Category Filtering</Label>
                      <p className="text-sm text-muted-foreground">Allow filtering items by category</p>
                    </div>
                    <Switch
                      id="enableCategoryFiltering"
                      checked={featureToggles.enableCategoryFiltering}
                      onCheckedChange={(checked) => updateFeatureToggle("enableCategoryFiltering", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableLocationBasedSearch">Location-Based Search</Label>
                      <p className="text-sm text-muted-foreground">Allow searching for items by location</p>
                    </div>
                    <Switch
                      id="enableLocationBasedSearch"
                      checked={featureToggles.enableLocationBasedSearch}
                      onCheckedChange={(checked) => updateFeatureToggle("enableLocationBasedSearch", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableItemComparisons">Item Comparisons</Label>
                      <p className="text-sm text-muted-foreground">Allow users to compare multiple items</p>
                    </div>
                    <Switch
                      id="enableItemComparisons"
                      checked={featureToggles.enableItemComparisons}
                      onCheckedChange={(checked) => updateFeatureToggle("enableItemComparisons", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableWishlist">Wishlist</Label>
                      <p className="text-sm text-muted-foreground">Allow users to save items to a wishlist</p>
                    </div>
                    <Switch
                      id="enableWishlist"
                      checked={featureToggles.enableWishlist}
                      onCheckedChange={(checked) => updateFeatureToggle("enableWishlist", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableSocialSharing">Social Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing items on social media</p>
                    </div>
                    <Switch
                      id="enableSocialSharing"
                      checked={featureToggles.enableSocialSharing}
                      onCheckedChange={(checked) => updateFeatureToggle("enableSocialSharing", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableDarkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Allow users to switch to dark mode</p>
                    </div>
                    <Switch
                      id="enableDarkMode"
                      checked={featureToggles.enableDarkMode}
                      onCheckedChange={(checked) => updateFeatureToggle("enableDarkMode", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Changes are applied immediately
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    updateFeatureToggle("enableNewUserOnboarding", true)
                    updateFeatureToggle("enableRecommendationEngine", true)
                    updateFeatureToggle("enableAnalytics", true)
                    updateFeatureToggle("enableAdvancedSearch", true)
                    updateFeatureToggle("enableCategoryFiltering", true)
                    updateFeatureToggle("enableLocationBasedSearch", true)
                    updateFeatureToggle("enableItemComparisons", false)
                    updateFeatureToggle("enableWishlist", true)
                    updateFeatureToggle("enableSocialSharing", true)
                    updateFeatureToggle("enableDarkMode", true)

                    toast({
                      title: "Feature toggles reset",
                      description: "Feature toggles have been reset to their default values",
                    })
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Feature toggles saved",
                      description: "Your feature toggle settings have been updated successfully",
                    })
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

