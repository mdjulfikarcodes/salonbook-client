import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getAllTransactions } from "@/lib/actions/payments"

// Shape of one transaction (fields may come with slightly different names)
type Transaction = {
    _id?: string
    customerEmail?: string
    email?: string
    amount?: number
    appointmentId?: string
    sessionId?: string
    session_id?: string
    status?: string
    paymentStatus?: string
    date?: string
    createdAt?: string
}

// Badge color based on payment status
function getStatusColor(status: string) {
    if (status === "Paid" || status === "Succeeded") {
        return "border-green-200 bg-green-50 text-green-700"
    }
    if (status === "Pending") {
        return "border-amber-200 bg-amber-50 text-amber-700"
    }
    return "border-red-200 bg-red-50 text-red-600"
}

// Make the date look nice, e.g. "Nov 25, 2026"
function formatDate(date?: string) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default async function TransactionsPage() {
    // Fetch all transactions
    const transactions: Transaction[] = await getAllTransactions()

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    All payments made by customers. View only.
                </p>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No transactions found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Email</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Related Service</TableHead>
                                <TableHead>Stripe Session ID</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Transaction Date</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {transactions.map((tx, index) => {
                                const email = tx.customerEmail || tx.email || "-"
                                const sessionId = tx.sessionId || tx.session_id || "-"
                                const appointmentId = tx.appointmentId || "N/A"
                                const status = tx.status || tx.paymentStatus || "Unknown"
                                const date = tx.date || tx.createdAt

                                return (
                                    <TableRow key={tx._id || sessionId || index}>
                                        <TableCell className="font-medium">{email}</TableCell>
                                        <TableCell>৳{tx.amount ?? 0}</TableCell>

                                        {/* Related appointment, or N/A when missing */}
                                        <TableCell className="text-muted-foreground">
                                            {appointmentId}
                                        </TableCell>

                                        {/* Long session id, cut off with "..." */}
                                        <TableCell className="max-w-[150px] truncate">
                                            {sessionId}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(status)}>
                                                {status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{formatDate(date)}</TableCell>
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
