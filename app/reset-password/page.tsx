import type { Metadata } from "next"
import { PasswordResetForm } from "@/components/auth/password-reset-form"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Reset Password | Lwie Admin Dashboard",
  description: "Reset your password for the Lwie Admin Dashboard",
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>
        <PasswordResetForm token={token} />
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

