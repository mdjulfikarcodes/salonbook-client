"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import type { LucideIcon } from "lucide-react"
import {
    LayoutDashboard,
    CalendarDays,
    User,
    Scissors,
    PlusCircle,
    Users,
    CreditCard,
    Home,
} from "lucide-react"
import Link from "next/link";


type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

const menuItemByRole: Record<"admin" | "customer", MenuItem[]> = {
    admin: [
        { id: "admin-overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
        { id: "admin-services", name: "Manage Services", url: "/dashboard/admin/services", icon: Scissors },
        { id: "admin-services-add", name: "Add / Update Service", url: "/dashboard/admin/services/add", icon: PlusCircle },
        { id: "admin-appointments", name: "Manage Appointments", url: "/dashboard/admin/appointments", icon: CalendarDays },
        { id: "admin-users", name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
        { id: "admin-transactions", name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
        { id: "admin-profile", name: "My Profile", url: "/dashboard/admin/profile", icon: User },
    ],
    customer: [
        { id: "customer-overview", name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
        { id: "customer-appointments", name: "My Appointments", url: "/dashboard/customer/my-appointments", icon: CalendarDays },
        { id: "customer-profile", name: "My Profile", url: "/dashboard/customer/profile", icon: User },
    ],
}

export function DashboardSidebar() {
    const { data: session, isPending } = useSession();
    const role = session?.user?.role?.toLowerCase() === "admin" ? "admin" : "customer";
    
    return (
        <Sidebar className="shadow-[12px_0_32px_-16px_rgba(0,0,0,0.5)]">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            menuItemByRole[role]?.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<Link href={item.url} />}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                        
                        
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link href="/" />}>
                                <Home />
                                <span>Back to Home</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}