import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function MarketplaceLoading() {
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
          <Skeleton className="h-9 w-[100px] rounded-md" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[240px] rounded-md" />
          <Skeleton className="h-9 w-[180px] rounded-md" />
          <Skeleton className="h-9 w-[180px] rounded-md" />
        </div>
        <Skeleton className="h-9 w-[120px] rounded-md" />
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-[400px] rounded-md" />

      {/* Items grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <Skeleton className="w-full h-[200px] rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

