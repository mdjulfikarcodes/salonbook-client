"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { authClient } from "@/lib/auth-client"

// The backend server address (change it if your API runs elsewhere)
const BASE_URL = process.env.API_BASE_URL || "http://localhost:5000"

// Shape of one transaction (fields may come with slightly different names)
type Transaction = {
    _id?: string
    customer_email?: string
    email?: string
    appointmentId?: string
    currency?: string
    amount?: number
    sessionId?: string
    session_id?: string
    status?: string
    paymentStatus?: string
    createdAt?: string
}

// Get the JWT token of the logged-in admin (client side)
async function getToken() {
    const { data } = await authClient.token()
    return data?.token ?? null
}

// GET request with "Authorization: Bearer <token>" added
async function fetchWithToken(path: string) {
    const token = await getToken()

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (!res.ok) throw new Error("Failed to load transactions")
    return res.json()
}

// APIs may send a plain array OR { transactions: [...] } OR { data: [...] }
function toArray(payload: unknown): Transaction[] {
    if (Array.isArray(payload)) return payload as Transaction[]

    if (payload && typeof payload === "object") {
        const obj = payload as Record<string, unknown>
        const list = obj.transactions ?? obj.data
        if (Array.isArray(list)) return list as Transaction[]
    }

    return []
}

// Badge color: green for "paid", red for "failed", amber for anything else
function getStatusColor(status: string) {
    const value = status.toLowerCase()
    if (value === "paid") return "border-green-200 bg-green-50 text-green-700"
    if (value === "failed") return "border-red-200 bg-red-50 text-red-600"
    return "border-amber-200 bg-amber-50 text-amber-700"
}

// Make the date look nice, e.g. "Nov 22, 2024"
function formatDate(value?: string) {
    if (!value) return "-"
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null) // null = loading
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let active = true

        async function loadTransactions() {
            try {
                const data = await fetchWithToken("/admin/transactions")
                if (active) setTransactions(toArray(data))
            } catch (error) {
                console.error("Failed to fetch transactions", error)
                toast.error(
                    error instanceof Error ? error.message : "Failed to load transactions"
                )
                if (active) setFailed(true)
            }
        }

        loadTransactions()

        return () => {
            active = false
        }
    }, [])

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    All payments made by customers. View only.
                </p>
            </div>

            {/* Something went wrong */}
            {failed && (
                <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-red-500">
                    Could not load transactions. Please try again later.
                </p>
            )}

            {/* Loading: skeleton rows inside the table */}
            {!failed && transactions === null && (
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Email</TableHead>
                                <TableHead>Service/Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Session ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <TableRow key={n}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-36" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-5 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Empty state */}
            {transactions !== null && transactions.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                    No transactions found.
                </div>
            )}

            {/* Loaded: read-only table */}
            {transactions !== null && transactions.length > 0 && (
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Email</TableHead>
                                <TableHead>Service/Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Session ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {transactions.map((tx, index) => {
                                const email = tx.customer_email || tx.email || "-"
                                const appointmentId = tx.appointmentId || "N/A"
                                const status = tx.status || tx.paymentStatus || "-"
                                const sessionId = tx.sessionId || tx.session_id || "-"
                                const shortId =
                                    sessionId.length > 10
                                        ? `${sessionId.slice(0, 10)}...`
                                        : sessionId

                                return (
                                    <TableRow key={tx._id || sessionId || index}>
                                        <TableCell className="font-medium">{email}</TableCell>

                                        {/* Related appointment, or N/A when missing */}
                                        <TableCell className="text-muted-foreground">
                                            {appointmentId}
                                        </TableCell>

                                        {/* currency + amount, e.g. ৳500 */}
                                        <TableCell>
                                            {tx.currency ?? ""}
                                            {tx.amount ?? 0}
                                        </TableCell>

                                        {/* Long session id, cut off after 10 chars */}
                                        <TableCell className="font-mono">{shortId}</TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getStatusColor(status)}
                                            >
                                                {status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
