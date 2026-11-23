"use client"

import { useEffect, useState } from "react"
import { CalendarDays, CheckCircle, Clock, CreditCard, Scissors, Users } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// One row from any list API 
type Row = {
    status?: string
}

// All 6 numbers shown on the cards
type Stats = {
    customers: number
    services: number
    appointments: number
    pending: number
    confirmed: number
    payments: number
}

async function getToken() {
    const { data } = await authClient.token()
    return data?.token ?? null
}


async function fetchWithToken(path: string) {
    const token = await getToken()

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (!res.ok) throw new Error("Failed to load dashboard data")
    return res.json()
}

// APIs may send a plain array OR 
function toArray(payload: unknown, key: string): Row[] {
    if (Array.isArray(payload)) return payload as Row[]

    if (payload && typeof payload === "object") {
        const obj = payload as Record<string, unknown>
        const list = obj[key] ?? obj.data
        if (Array.isArray(list)) return list as Row[]
    }

    return []
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null) 
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let active = true

        async function loadStats() {
            try {
                // Fetch all endpoints at the same time
                const [customersData, servicesData, appointmentsData, transactionsData] =
                    await Promise.all([
                        fetchWithToken("/users/count"), 
                        fetchWithToken("/services"),
                        fetchWithToken("/admin/appointments"),
                        fetchWithToken("/admin/transactions"),
                    ])

                const appointments = toArray(appointmentsData, "appointments")

                if (!active) return

                setStats({
                    customers: customersData?.totalCustomers || 0, // ⬅️ কাউন্ট ডেটা সেট করা হলো
                    services: toArray(servicesData, "services").length,
                    appointments: appointments.length,
                    pending: appointments.filter((a) => a.status === "Pending").length,
                    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
                    payments: toArray(transactionsData, "transactions").length,
                })
            } catch (error) {
                console.error("Failed to load stats", error)
                toast.error(
                    error instanceof Error ? error.message : "Failed to load dashboard stats"
                )
                if (active) setFailed(true)
            }
        }

        loadStats()

        return () => {
            active = false
        }
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Quick numbers for your salon.
                </p>
            </div>

            
            {failed && (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-red-500">
                    Could not load the stats. Please try again later.
                </p>
            )}

        
            {!failed && stats === null && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <Card key={n}>
                            <CardHeader>
                                <Skeleton className="h-4 w-28" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

       
            {stats !== null && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: "Total Customers", value: stats.customers, icon: Users },
                        { title: "Active Services", value: stats.services, icon: Scissors },
                        { title: "Total Appointments", value: stats.appointments, icon: CalendarDays },
                        { title: "Pending", value: stats.pending, icon: Clock },
                        { title: "Confirmed", value: stats.confirmed, icon: CheckCircle },
                        { title: "Successful Payments", value: stats.payments, icon: CreditCard },
                    ].map(({ title, value, icon: Icon }) => (
                        <Card key={title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}