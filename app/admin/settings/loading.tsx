import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />

        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />

              <Skeleton className="h-px w-full" />

              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />

              <Skeleton className="h-px w-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <Skeleton className="h-10 w-32 mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

