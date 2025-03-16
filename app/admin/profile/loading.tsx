import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="flex space-x-1 rounded-lg border p-1 w-full md:w-auto">
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-9 w-1/3" />
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-24 w-24 rounded-full" />

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 pt-0">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}

