"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scissors } from "lucide-react"

import MobileMenu from "@/components/MobileMenu"
import ProfileDropdown, { type NavbarUser } from "@/components/ProfileDropdown"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-services", label: "Browse Services" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const user: NavbarUser | undefined = session?.user

  if (pathname.startsWith("/dashboard")) return null

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"


  const links = user
    ? [
        { href: "/", label: "Home" }, 
        { href: "/browse-services", label: "Salon Details" } 
      ]
    : baseLinks

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

 

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-ink/95 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.6)] backdrop-blur">
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-wide text-white transition-colors hover:text-gold"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rosegold to-gold text-white shadow-md shadow-rose-500/30">
            <Scissors className="size-4" />
          </span>
          SalonBook
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-white/10 text-gold"
                  : "text-zinc-300 hover:bg-white/5 hover:text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-full border border-gold/50 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} dashboardHref={dashboardHref} />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-gold"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-gradient-to-r from-rose-500 to-rosegold px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-500/30 transition-all hover:from-rose-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <MobileMenu
          links={links}
          user={user}
          dashboardHref={dashboardHref}
          isPending={isPending}
        />
      </nav>
    </header>
  )
}
