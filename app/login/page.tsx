import type { Metadata } from "next"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Login | Lwie Admin Dashboard",
  description: "Login to the Lwie Admin Dashboard",
}

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            fill
            alt="Authentication"
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image src="/placeholder.svg?height=40&width=40" width={40} height={40} alt="Lwie Logo" className="mr-2" />
          Lwie Admin Dashboard
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Lwie provides a powerful platform for managing your swapping needs with ease and efficiency.&rdquo;
            </p>
            <footer className="text-sm">Lwie Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <span className="font-medium">Contact your administrator</span>
          </p>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

