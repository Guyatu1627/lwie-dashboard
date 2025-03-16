import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Contacts List */}
        <div className="md:col-span-1 border rounded-md overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="h-[calc(100vh-340px)] overflow-auto">
            <div className="divide-y">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-[120px]" />
                          <Skeleton className="h-4 w-[40px]" />
                        </div>
                        <Skeleton className="h-4 w-[100px] mt-1" />
                        <Skeleton className="h-4 w-full mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="md:col-span-2 border rounded-md flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[100px] mt-1" />
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-start">
                    <Skeleton className="h-[80px] w-[80%] rounded-lg" />
                  </div>
                ))}
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-end">
                    <Skeleton className="h-[60px] w-[70%] rounded-lg" />
                  </div>
                ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <Skeleton className="h-[80px] w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

