import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { requireRole } from "@/lib/core/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin")
  
  return <>{children}</>
}