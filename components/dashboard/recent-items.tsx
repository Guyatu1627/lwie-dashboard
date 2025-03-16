import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const items = [
  {
    name: "Living Room Set",
    description: "Complete living room furniture set",
    order: "1",
    date: "2024-01-14",
    status: "Active",
  },
  {
    name: "Dining Table",
    description: "6-seater dining table",
    order: "2",
    date: "2024-01-13",
    status: "Active",
  },
  {
    name: "Office Chair",
    description: "Ergonomic office chair",
    order: "3",
    date: "2024-01-12",
    status: "Pending",
  },
]

export function RecentItems() {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.order}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

