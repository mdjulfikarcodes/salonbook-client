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


const menuItemByRole = {
    admin: [

    ],
    customer: [

    ]
}

export function DashboardSidebar() {
    const { data: session, isPending } = useSession();
    const role = (session?.user?.role as "admin" | "customer") || "customer";
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            // menuItemByRole[role].map((item) => (
                            //     <SidebarMenuItem key={item.id}>
                            //         <SidebarMenuButton render={<a href={item.url} />}>
                            //             <item.icon />
                            //             <span>{item.name}</span>
                            //         </SidebarMenuButton>
                            //     </SidebarMenuItem>
                            // ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}