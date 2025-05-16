"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import api from "@/services/api-service"
import toast from "react-hot-toast"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ErrorResponse, AuthResponse } from "@/types/response"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
  remember: z.boolean().default(false).optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const loginMutation = useMutation<AuthResponse, ErrorResponse, LoginFormValues>({
    mutationFn: (data: LoginFormValues) => {
      toast.loading("Signing in...", { id: "login-loading" })
      return api.post('/auth/login/email', data)
    },
    onSuccess: (data: AuthResponse) => {
      toast.dismiss("login-loading")
      toast.remove("login-loading")
      console.log(data)
      api.setCsrfToken(data.csrfToken)
      // new CookieService().setCookieWithExpiry(BANKNBOOK_AUTH_COOKIE_NAME, data.token.token, data.token.tokenExpires)
      // new CookieService().setCookieWithExpiry(BANKNBOOK_AUTH_REFRESH_COOKIE_NAME, data.token.refreshToken, data.token.refreshTokenExpires)
      toast.success(data.message, { id: "login-success" })
      router.push("/dashboard")
    },
    onError: (error: ErrorResponse) => {
      // console.log(error)
      toast.dismiss("login-loading")
      toast.remove("login-loading")
      toast.error(error.errors[0].message, { id: "login-error" })
    },
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(data)
    } catch (error: any) {
      toast.dismiss("login-loading")
      console.error("Login failed:", error)
      toast.error("Invalid email or password", { id: "login-error" })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-[#7B68EE]">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember me</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

