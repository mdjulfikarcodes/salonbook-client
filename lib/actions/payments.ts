const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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