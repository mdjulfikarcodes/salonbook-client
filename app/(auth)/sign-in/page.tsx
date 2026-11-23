"use client"

import Link from "next/link"
import { useState, Suspense } from "react" 
import { Lock, Mail, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"


function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams();
  
  const redirectTo = searchParams.get("redirectTo") ?? "/"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = { email, password }
    console.log("Sign in form data:", formData)

    setLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: true,
        callbackURL: redirectTo,
      })

      if (error) {
        console.log("Sign in failed:", error.message)
        return
      }

      console.log("Sign in successful:", data)

      router.push(redirectTo)
      router.refresh() 

    } catch (error: unknown) {
      console.log("Something went wrong:", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      })
    } catch (error) {
      console.error("Google sign in error:", error)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-blush to-white px-4 py-16 dark:from-zinc-950 dark:to-neutral-900">
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-[0_24px_60px_-24px_rgba(190,24,93,0.35)] dark:border-zinc-800 dark:bg-neutral-900">
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
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-3 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
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
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-10 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
              />
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
            className="w-full rounded-full bg-gradient-to-r from-rose-500 to-rosegold py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-all hover:from-rose-600"
          >
            {loading ? "Signing In..." : "Login"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-neutral-900 dark:text-zinc-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full rounded-full py-2.5 text-sm font-medium transition-all hover:shadow-md"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
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


export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-muted-foreground">Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}
