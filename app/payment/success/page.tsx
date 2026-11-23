"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { paymentsVerify } from "@/lib/actions/payments"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const router = useRouter()
  
  const [verifying, setVerifying] = useState(true)
  const [status, setStatus] = useState<"success" | "failed">("success")

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setVerifying(false)
        return
      }

      try {
        const data = await paymentsVerify(sessionId)
        
        if (data.success) {
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (error) {
        console.error("Verification error", error)
        setStatus("failed")
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="size-12 animate-spin text-rose-500 mb-4" />
        <h1 className="text-xl font-semibold">Verifying your payment...</h1>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Verification Failed</h1>
        <Button onClick={() => router.push("/payment")}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CheckCircle className="size-20 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8">Your payment has been verified and confirmed.</p>
      
    
      <Button 
        onClick={() => {
          router.push("/dashboard/customer/my-appointments")
          router.refresh()
        }} 
        className="bg-rose-500 hover:bg-rose-600"
      >
        Go to Dashboard
      </Button>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}