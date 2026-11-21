"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  CalendarDays,
  Clock,
  CreditCard,
  DollarSign,
  Tag,
  XCircle,
} from "lucide-react"

import type { Appointment } from "@/types/appointment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cancelAppointment, getCustomerAppointments } from "@/lib/actions/appointments"
import { useSession } from "@/lib/auth-client"

// Appointment + the extra fields our API sends
type MyAppointment = Appointment & {
  serviceImage?: string
  category?: string
  paymentStatus?: string
  requestedAt?: string
}

// Status badge colors
function getStatusColor(status: Appointment["status"]) {
  if (status === "Confirmed") return "border-green-200 bg-green-50 text-green-700"
  if (status === "Pending") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-red-200 bg-red-50 text-red-700"
}

// Payment badge colors (green = Paid, red = Unpaid)
function getPaymentColor(paymentStatus?: string) {
  if (paymentStatus === "Paid") return "border-green-200 bg-green-50 text-green-700"
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

export default function MyAppointmentsPage() {
  // Logged-in user
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Appointments state (null = not fetched yet)
  const [appointments, setAppointments] = useState<MyAppointment[] | null>(null)

  // Fetch appointments once we know the user id
  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return

    let active = true

    async function fetchAppointments() {
      try {
        const data = await getCustomerAppointments(userId as string)
        if (active) {
          // API may send a plain array OR { appointments: [...] }
          const list = Array.isArray(data) ? data : (data?.appointments ?? data?.data ?? [])
          setAppointments(list)
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error)
        if (active) setAppointments([])
      }
    }

    fetchAppointments()

    return () => {
      active = false // ignore results after leaving the page
    }
  }, [session?.user?.id])

  // Loading = session is being checked, OR user found but data not back yet
  const isLoading = isPending || (!!session?.user?.id && appointments === null)

  // Cancel a Pending appointment: confirm → API → reload
  async function handleCancel(id: string) {
    const ok = window.confirm("Are you sure you want to cancel this appointment?")
    if (!ok) return

    const result = await cancelAppointment(id)

    if (result) {
      window.location.reload()
    } else {
      console.error("Failed to cancel appointment")
    }
  }

  // Go to the Stripe payment page with the appointment details
  function handlePay(appointment: MyAppointment) {
    const params = new URLSearchParams({
      amount: String(appointment.servicePrice),
      service: appointment.serviceName,
      id: appointment._id ?? "",
    })

    router.push(`/payment?${params.toString()}`)
  }

  // Simple loading text while fetching
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex justify-center py-20">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    )
  }

  const list = appointments ?? []

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold">My Appointments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here are your upcoming and past bookings.
      </p>

      {/* No appointments yet */}
      {list.length === 0 ? (
        <div className="mt-10 text-center py-10 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">You have no appointments booked yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((appointment) => (
            <Card key={appointment._id} className="pt-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Service image (or first letter if there is none) */}
              {appointment.serviceImage ? (
                <img
                  src={appointment.serviceImage}
                  alt={appointment.serviceName}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-rose-50 text-4xl font-bold text-rose-400">
                  {appointment.serviceName?.charAt(0)}
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{appointment.serviceName}</CardTitle>
                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>

                {/* Category + payment badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {appointment.category && (
                    <Badge variant="outline" className="text-zinc-600 bg-zinc-50 border-zinc-200">
                      <Tag className="mr-1 size-3" />
                      {appointment.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className={getPaymentColor(appointment.paymentStatus)}>
                    <CreditCard className="mr-1 size-3" />
                    {appointment.paymentStatus || "Unpaid"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <DollarSign className="size-4 text-rose-500" />
                  <span className="font-semibold">৳{appointment.servicePrice}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4" />
                  {formatDate(appointment.appointmentDate)}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" />
                  {appointment.timeSlot}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />
                  Requested: {formatDate(appointment.requestedAt)}
                </p>

                {/* Pay Now button: only for Confirmed + Unpaid appointments */}
                {appointment.status === "Confirmed" &&
                  appointment.paymentStatus === "Unpaid" && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handlePay(appointment)}
                      className="mt-2 w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
                    >
                      <CreditCard className="mr-1 size-4" />
                      Pay Now
                    </Button>
                  )}

                {/* Cancel button: only for Pending appointments */}
                {appointment.status === "Pending" && appointment._id && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(appointment._id!)}
                    className="mt-2 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="mr-1 size-4" />
                    Cancel Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
