"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("customer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Send the form data to Better Auth
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL,
        role,
      })

      if (error) {
        setError(error.message || "Something went wrong. Please try again.")
        return
      }

      router.push("/")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-neutral-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Join SalonBook and book your favorite services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="name"
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-3 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
          </div>

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
              htmlFor="photoURL"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Photo URL
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                id="photoURL"
                type="url"
                required
                placeholder="https://example.com/photo.jpg"
                value={photoURL}
                onChange={(event) => setPhotoURL(event.target.value)}
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
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 py-2.5 pr-3 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              I am a
            </span>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:checked]:text-rose-600 dark:border-zinc-700 dark:text-zinc-300 dark:has-[:checked]:border-rose-500 dark:has-[:checked]:bg-rose-500/10 dark:has-[:checked]:text-rose-400">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                  className="size-4 accent-rose-500"
                />
                Customer
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:checked]:text-rose-600 dark:border-zinc-700 dark:text-zinc-300 dark:has-[:checked]:border-rose-500 dark:has-[:checked]:bg-rose-500/10 dark:has-[:checked]:text-rose-400">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="size-4 accent-rose-500"
                />
                Admin
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-500 py-2.5 text-sm text-white hover:bg-rose-600"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
