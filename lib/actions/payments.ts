const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Fetch total successful payments count
export const getPaymentsCount = async () => {
    try {
        const res = await fetch(`${BASE_URL}/payments/count`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch payments count")
        return await res.json()
    } catch (error) {
        console.error("Error in getPaymentsCount:", error)
        return { totalPaid: 0 }
    }
}


export const getAllTransactions = async () => {
    try {
        const res = await fetch(`${BASE_URL}/admin/transactions`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch transactions")

        const data = await res.json()

        
        if (Array.isArray(data)) return data
        return data?.transactions ?? data?.data ?? []
    } catch (error) {
        console.error("Error in getAllTransactions:", error)
        return []
    }
}

export const paymentsVerify = async (sessionId: string) => {
    try {
        const res = await fetch(`${BASE_URL}/payments/payments-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
        })
        return res.json()
    } catch (error) {
        console.error("API Call Error in paymentsVerify:", error)
        return { success: false, message: "Network error" }
    }
}