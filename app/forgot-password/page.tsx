"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      // In a real app, this would be an API call to send a reset email
      // For demo purposes, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo validation - only allow reset for demo accounts
      if (email === "admin@lwie.com" || email === "manager@lwie.com") {
        setSuccess(true)
      } else {
        throw new Error("Email not found in our system")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e5eded] dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lwie Platform</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Reset your password</p>
        </div>

        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Link href="/login" className="mr-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <CardTitle className="text-xl">Forgot Password</CardTitle>
            </div>
            <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                  instructions.
                </p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Demo: admin@lwie.com or manager@lwie.com</p>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending reset link...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

