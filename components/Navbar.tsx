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

  // The dashboard has its own SidebarTrigger header — hide the site Navbar there
  if (pathname.startsWith("/dashboard")) return null

  console.log('user session in navbar', session)

  const dashboardHref =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"

  const links = user
    ? [{ href: "/", label: "Home" }, { href: "/services", label: "Salon Details" }]
    : baseLinks

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

 

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-zinc-900 transition-colors hover:text-rose-600 dark:text-white dark:hover:text-rose-400"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm">
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
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-rose-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
          ) : user ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} dashboardHref={dashboardHref} />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-400"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-600"
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
