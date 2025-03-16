import { redirect } from "next/navigation"

export default function HomePage() {
  // This ensures that the root page redirects to the admin dashboard
  // The middleware will handle role-based access control
  redirect("/admin")

  // This return is never reached but is needed for TypeScript
  return null
}

