import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[240px] mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-[150px] rounded-md" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Skeleton className="h-9 w-[300px] rounded-md" />
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-[400px] rounded-md" />

      {/* Notifications skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[150px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[250px]" />
                      <Skeleton className="h-4 w-[350px]" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

