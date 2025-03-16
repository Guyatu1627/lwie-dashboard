import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e5eded] dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-40 mt-4" />
          <Skeleton className="h-4 w-60 mt-2" />
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-1 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>

        <div className="text-center">
          <Skeleton className="h-4 w-60 mx-auto" />
        </div>
      </div>
    </div>
  )
}

