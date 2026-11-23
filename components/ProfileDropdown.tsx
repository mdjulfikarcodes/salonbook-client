"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import Image from "next/image"

export type NavbarUser = {
  name?: string | null
  email?: string | null
  role?: string | null
  image?: string | null
}

function getInitials(user: NavbarUser) {
  const source = user.name || user.email || "User"
  return source
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function ProfileDropdown({
  user,
  dashboardHref,
}: {
  user: NavbarUser
  dashboardHref: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-full border border-zinc-200 p-1 pr-2 transition-colors hover:border-rose-300 hover:bg-rose-50 dark:border-zinc-700 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile"}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-7 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white">
            {getInitials(user)}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 text-zinc-500 transition-transform dark:text-zinc-400",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {user.name || "User"}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
          <div className="p-1.5">
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
