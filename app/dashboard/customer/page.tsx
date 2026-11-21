"use client"

import { useEffect, useState } from "react"
import { Calendar, CheckCircle, Clock, XCircle, type LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "@/lib/auth-client"
import { getCustomerAppointmentsCount } from "@/lib/actions/appointments"

// The 4 numbers we show on the cards
type Counts = {
    total: number
    pending: number
    confirmed: number
    cancelled: number
}

const emptyCounts: Counts = { total: 0, pending: 0, confirmed: 0, cancelled: 0 }

// Card layout info: label + icon + color
const cards: { label: string; key: keyof Counts; icon: LucideIcon; color: string }[] = [
    { label: "Total", key: "total", icon: Calendar, color: "text-rose-500 bg-rose-100 dark:bg-rose-950" },
    { label: "Pending", key: "pending", icon: Clock, color: "text-amber-500 bg-amber-100 dark:bg-amber-950" },
    { label: "Confirmed", key: "confirmed", icon: CheckCircle, color: "text-green-500 bg-green-100 dark:bg-green-950" },
    { label: "Cancelled", key: "cancelled", icon: XCircle, color: "text-red-500 bg-red-100 dark:bg-red-950" },
]

export default function CustomerOverviewPage() {
    // Logged-in user
    const { data: session, isPending } = useSession()

    // Stats state (null = not fetched yet)
    const [counts, setCounts] = useState<Counts | null>(null)

    // Fetch the counts once we know the user id
    useEffect(() => {
        const userId = session?.user?.id
        if (!userId) return

        let active = true

        async function fetchCounts() {
            try {
                const data = await getCustomerAppointmentsCount(userId as string)
                if (active) {
                    setCounts({
                        total: data.total ?? 0,
                        pending: data.pending ?? 0,
                        confirmed: data.confirmed ?? 0,
                        cancelled: data.cancelled ?? 0,
                    })
                }
            } catch (error) {
                console.error("Failed to fetch counts", error)
            }
        }

        fetchCounts()

        return () => {
            active = false // ignore results after leaving the page
        }
    }, [session?.user?.id])

    // Loading = session is being checked, OR user found but counts not back yet
    const isLoading = isPending || (!!session?.user?.id && counts === null)

    // Simple loading text while fetching
    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
                <p className="text-muted-foreground animate-pulse">Loading...</p>
            </div>
        )
    }

    const stats = counts ?? emptyCounts

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}! Here is your appointment summary.
            </p>

            {/* 4 cards: 1 column on mobile, 4 columns on desktop */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                {cards.map(({ label, key, icon: Icon, color }) => (
                    <Card key={label} className="pt-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <span className={`flex size-10 items-center justify-center rounded-full ${color}`}>
                                    <Icon className="size-5" />
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">{stats[key]}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
