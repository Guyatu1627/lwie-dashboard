import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  fullScreen?: boolean
}

export function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]}`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

