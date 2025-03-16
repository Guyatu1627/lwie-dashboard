import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  href: string
  label: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={item.href}
              className={
                index === items.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

