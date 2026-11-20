"use client"

import { useParams } from "next/navigation"
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

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
]

export default function ServiceDetailsPage() {
  const params = useParams()
 
  const serviceId = params?.id as string 

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  // Booking form state
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch the single service
  useEffect(() => {
    let active = true

    async function fetchService() {
      if (!serviceId) return;

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
  }, [serviceId])

  // On submit: just collect and log the data (no backend yet)
  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setShowSuccess(false)

    if (!date || !time) {
      setError("Please pick a date and a time slot.")
      return
    }

    const bookingData = { serviceId, date, time, message }
    console.log("Booking data:", bookingData)

    setShowSuccess(true)
    setMessage("")
    setTime("")
    setDate("")
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
        <Button onClick={() => window.location.href = "/browse-services"}>
            Go Back to Services
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image side */}
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

        {/* Details side */}
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

          {/* Booking form */}
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
                  Appointment requested! Check the browser console for the details.
                </p>
              )}

              <Button
                type="submit"
                className="w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
              >
                Book Appointment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}