import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Skeleton className="h-10 w-full md:w-[300px]" />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-[400px]" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-auto">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

