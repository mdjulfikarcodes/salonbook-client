"use client";

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client"


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

   
    useEffect(() => {
        if (isPending) return

      
        if (!session) {
            router.push("/sign-in")
            return
        }

        
        if (role === "admin" && isCustomerPath) {
            router.push("/dashboard/admin")
            return
        }

        
        if (role === "customer" && isAdminPath) {
            router.push("/dashboard/customer")
        }
    }, [isPending, session, role, isAdminPath, isCustomerPath, router])

    
    if (isPending) return <CheckingPermissions />

    
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
