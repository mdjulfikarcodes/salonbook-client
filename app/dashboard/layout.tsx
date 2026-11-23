import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import type { ReactNode } from "react"

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b px-4 py-2">
          <SidebarTrigger />
        </div>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <Toaster />
    </SidebarProvider>
  )
}
