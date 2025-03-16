import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-[100px] rounded-md" />
        </div>
      </div>

      {/* Filters and Actions skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[240px] rounded-md" />
          <Skeleton className="h-9 w-[180px] rounded-md" />
          <Skeleton className="h-9 w-[180px] rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[150px] rounded-md" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-[500px] rounded-md" />

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[120px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[200px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-3 w-[150px] mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4">
            <Skeleton className="h-4 w-[200px]" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

