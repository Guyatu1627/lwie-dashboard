import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-4 w-[250px] mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-[400px]" />

      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}

