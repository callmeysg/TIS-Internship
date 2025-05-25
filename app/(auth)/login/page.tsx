"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@/lib/supabase"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingDemo, setIsCreatingDemo] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [supabase, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const createDemoUsers = async () => {
    setIsCreatingDemo(true)
    try {
      const response = await fetch("/api/auth/register-demo", {
        method: "POST",
      })

      if (response.ok) {
        setError(null)
        alert("Demo users created successfully! You can now login with the demo accounts.")
      } else {
        setError("Failed to create demo users")
      }
    } catch (err) {
      setError("Failed to create demo users")
    } finally {
      setIsCreatingDemo(false)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (authData.user) {
        // Check if profile exists
        const { data: profile } = await supabase.from("profiles").select("*").eq("userId", authData.user.id).single()

        if (!profile) {
          setError("User profile not found. Please contact administrator.")
          return
        }

        // Successful login - redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-white dark:bg-black rounded-sm"></div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your retail dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    disabled={isLoading}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>

          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Demo Accounts</p>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Admin:</span>
                  <span className="text-gray-600 dark:text-gray-400">admin@example.com / admin123</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Cashier:</span>
                  <span className="text-gray-600 dark:text-gray-400">cashier@example.com / cashier123</span>
                </div>
              </div>

              <Button
                onClick={createDemoUsers}
                disabled={isCreatingDemo}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isCreatingDemo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreatingDemo ? "Creating Demo Users..." : "Create Demo Users"}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Click this button first if demo accounts don't exist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
