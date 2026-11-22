"use client";

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client"

// Shown while we check the session / role (also during the redirect)
function CheckingPermissions() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <p className="animate-pulse text-muted-foreground">Checking permissions...</p>
        </div>
    )
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, isPending } = useSession()

    const role = session?.user?.role
    const isAdminPath = pathname.startsWith("/dashboard/admin")
    const isCustomerPath = pathname.startsWith("/dashboard/customer")

    // Send users to the right dashboard (runs after the session loads)
    useEffect(() => {
        if (isPending) return

        // Not logged in → sign in
        if (!session) {
            router.push("/sign-in")
            return
        }

        // Admin opened a customer page → go to admin dashboard
        if (role === "admin" && isCustomerPath) {
            router.push("/dashboard/admin")
            return
        }

        // Customer opened an admin page → go to customer dashboard
        if (role === "customer" && isAdminPath) {
            router.push("/dashboard/customer")
        }
    }, [isPending, session, role, isAdminPath, isCustomerPath, router])

    // Wait for the session before rendering anything (no flash on refresh)
    if (isPending) return <CheckingPermissions />

    // Logged out or wrong role → don't render children (redirect is on the way)
    const roleMatches =
        session !== null &&
        !((role === "admin" && isCustomerPath) || (role === "customer" && isAdminPath))

    if (!roleMatches) return <CheckingPermissions />

    return (
    <SidebarProvider>
      <DashboardSidebar/>
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  )
};

export default DashboardLayout;
