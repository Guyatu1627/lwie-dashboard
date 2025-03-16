import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5eded] dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This area is restricted based on your user role. Please contact your administrator if you believe you should
            have access.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

