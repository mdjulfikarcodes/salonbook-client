"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { Clock } from "lucide-react"

import type { Service } from "@/components/services/ServiceCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getServiceById } from "@/lib/api/services"
import { useSession } from "@/lib/auth-client"
import { createAppointment } from "@/lib/actions/appointments"

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
]

export default function ServiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params?.id as string

  const { data: session, isPending } = useSession()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // ১. লগইন না থাকলে sign-in এ redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push(`/sign-in?redirectTo=/browse-services/${serviceId}`)
    }
  }, [session, isPending, router, serviceId])

  // ২. সার্ভিস ডেটা ফেচ
  useEffect(() => {
    let active = true

    async function fetchService() {
      if (!serviceId || !session) return

      try {
        setLoading(true)
        const data = await getServiceById(serviceId)

        if (active) {
          if (data && !data.error && Object.keys(data).length > 0) {
            setService(data?.service || data)
          } else {
            setService(null)
          }
        }
      } catch (err) {
        console.error("Failed to fetch service", err)
        if (active) setService(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchService()

    return () => {
      active = false
    }
  }, [serviceId, session])

  // ৩. অ্যাপয়েন্টমেন্ট সাবমিট
  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setShowSuccess(false)

    if (!date || !time) {
      setError("Please pick a date and a time slot.")
      return
    }

    setIsSubmitting(true)

    const appointmentData = {
      serviceId: serviceId,
      customerId: session?.user?.id,
      customerName: session?.user?.name,
      customerEmail: session?.user?.email,
      serviceName: service?.name,
      servicePrice: Number(service?.price),
      appointmentDate: date,
      timeSlot: time,
      message: message,
      status: "Pending",
      paymentStatus: "Unpaid",
    }

    console.log("Sending data to database:", appointmentData)

    try {
      const result = await createAppointment(appointmentData)

      if (result) {
        setShowSuccess(true)
        setMessage("")
        setTime("")
        setDate("")
      } else {
        setError("Failed to book appointment. Try again.")
      }
    } catch (err) {
      setError("Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
        <p className="text-center text-muted-foreground animate-pulse">Checking authentication...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
        <p className="text-center text-muted-foreground animate-pulse">Loading service details...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center flex-col gap-4">
        <p className="text-center text-red-500 font-medium text-lg">Service not found or invalid ID.</p>
        <Button onClick={() => (window.location.href = "/browse-services")}>
          Go Back to Services
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="h-96 w-full rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-xl bg-rose-50 text-6xl font-bold text-rose-400 shadow-md">
              {service.name?.charAt(0)}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <Badge variant="outline">{service.category}</Badge>
          </div>

          <p className="mt-3 text-2xl font-semibold text-rose-500">
            ৳{service.price}
          </p>

          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" />
            Estimated Duration: {service.duration} min
          </p>

          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {service.description}
          </p>

          {session?.user?.role !== "admin" ? (
            <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Book This Service</h2>

              <form onSubmit={handleBooking} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium">
                    Appointment Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Time Slot</label>
                  <Select value={time} onValueChange={(value) => setTime(String(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium">
                    Additional Message (optional)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Anything we should know?"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                  </p>
                )}

                {showSuccess && (
                  <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    Appointment requested successfully! You can view it in your dashboard.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <p className="font-medium">Admins cannot book appointments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}