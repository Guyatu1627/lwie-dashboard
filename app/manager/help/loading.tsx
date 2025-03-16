import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px] mt-2" />
      </div>

      {/* Search skeleton */}
      <Skeleton className="h-12 w-full rounded-md" />

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Content skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

