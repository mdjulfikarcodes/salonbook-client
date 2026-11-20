"use client"

import { CreditCard, ShieldCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function PaymentContent() {
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()

    const amount = searchParams.get("amount") || "1000"
    const serviceName = searchParams.get("service") || "Premium Hair Cut"

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            amount: Number(amount),
            serviceName: serviceName,
        }
        console.log("১. পেমেন্ট পেজ থেকে পাঠানো ডেটা:", payload) // ⬅️ চেক ১

        try {
            const response = await fetch("/api/checkout_session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            console.log("২. API থেকে আসা রেসপন্স:", data) // ⬅️ চেক ২

            if (data.url) {
                window.location.href = data.url
            } else {
                alert("Error: " + data.error)
                setLoading(false)
            }
        } catch (error) {
            console.error("❌ Fetch Error:", error)
            alert("Failed to connect to payment API")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-zinc-100 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Service</span>
                            <span className="font-medium">{serviceName}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                            <span className="font-semibold">Total Amount</span>
                            <span className="font-bold text-rose-500 text-lg">৳{amount}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <form onSubmit={handleCheckout} className="w-full">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-rose-500 text-white rounded-full py-6"
                        >
                            {loading ? "Redirecting..." : `Pay Now ৳${amount}`}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentContent />
        </Suspense>
    )
}