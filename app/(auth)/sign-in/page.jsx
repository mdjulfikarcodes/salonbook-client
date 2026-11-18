"use client"

import Link from "next/link"
import { useState } from "react"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // ⬅️ পাসওয়ার্ড দেখার স্টেট
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    // Collect the form data
    const formData = { email, password }
    console.log("Sign in form data:", formData)

    setLoading(true)

    try {
      // Sign in the user with Better Auth
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: true,
        callbackURL: "/"
      })

      // Show error if login fails
      if (error) {
        console.log("Sign in failed:", error.message)
        return
      }

      // Login successful
      console.log("Sign in successful:", data)

      // Redirect to homepage
      router.push("/")

    } catch (error) {
      console.log("Something went wrong:", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-neutral-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to book your next salon appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-3 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"} // ⬅️ ডাইনামিক টাইপ
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-10 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
              />
              {/* ⬇️ Eye Icon বাটন */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <div className="mt-1 text-right">
              <a
                href="#"
                className="text-xs font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-500 py-2.5 text-sm text-white hover:bg-rose-600"
          >
            {loading ? "Signing In..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}