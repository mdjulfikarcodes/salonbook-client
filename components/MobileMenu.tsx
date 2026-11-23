"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import type { NavbarUser } from "@/components/ProfileDropdown"

type NavLinkItem = { href: string; label: string }

export default function MobileMenu({
  links,
  user,
  dashboardHref,
  isPending,
}: {
  links: NavLinkItem[]
  user: NavbarUser | undefined
  dashboardHref: string
  isPending: boolean
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
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

  async function handleLogout() {
    setOpen(false)
    await authClient.signOut()
    router.push("/")
  }

  return (
    <div ref={menuRef} className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex size-9 items-center justify-center rounded-full text-zinc-200 transition-colors hover:bg-white/10 hover:text-gold"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <div
        className={cn(
          "absolute inset-x-0 top-full flex flex-col gap-1 overflow-hidden border-b border-gold/25 bg-ink-soft p-4 shadow-2xl transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-white/10 text-gold"
                : "text-zinc-300 hover:bg-white/5 hover:text-gold"
            )}
          >
            {link.label}
          </Link>
        ))}

        {!isPending &&
          (user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gold transition-colors hover:bg-white/10"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-rose-400"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-center text-sm font-medium text-zinc-200 transition-colors hover:border-gold/50 hover:text-gold"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gradient-to-r from-rose-500 to-rosegold px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition-all hover:from-rose-600"
              >
                Sign Up
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}
