import { Card } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentItems } from "@/components/dashboard/recent-items"
import { FileText, Package, BarChart3, Upload } from "lucide-react"

const stats = [
  {
    title: "Total Template",
    value: "15",
    icon: FileText,
  },
  {
    title: "Total Items",
    value: "23",
    icon: Package,
  },
  {
    title: "Total Specifications",
    value: "42",
    icon: BarChart3,
  },
  {
    title: "Uploaded Files",
    value: "8",
    icon: Upload,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
              </div>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <Overview />
        </div>
      </Card>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Items</h2>
          <RecentItems />
        </div>
      </Card>
    </div>
  )
}

