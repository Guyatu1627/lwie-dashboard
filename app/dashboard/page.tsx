import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
          <CardDescription>This is the regular user dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are logged in as a regular user. You do not have access to the Admin or Manager dashboards.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/login">Logout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

