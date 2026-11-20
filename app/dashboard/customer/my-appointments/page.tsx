"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, DollarSign } from "lucide-react"

import type { Appointment } from "@/types/appointment"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ⬇️ ১. প্রয়োজনীয় ফাংশন এবং সেশন ইমপোর্ট করুন
import { getCustomerAppointments } from "@/lib/actions/appointments"
import { useSession } from "@/lib/auth-client"

// স্ট্যাটাস অনুযায়ী ব্যাজের রঙ ঠিক করার ফাংশন
function getStatusColor(status: Appointment["status"]) {
  if (status === "Confirmed") return "border-green-200 bg-green-50 text-green-700"
  if (status === "Pending") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-red-200 bg-red-50 text-red-700"
}

// ডেট সুন্দরভাবে দেখানোর ফাংশন
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function MyAppointmentsPage() {
  // ⬇️ ২. ইউজারের সেশন নিন
  const { data: session } = useSession()
  
  // ⬇️ ৩. ডেটা রাখার জন্য state তৈরি করুন
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ⬇️ ৪. পেজ লোড হলে ডেটাবেস থেকে ডেটা নিয়ে আসুন
  useEffect(() => {
    async function fetchAppointments() {
      // যদি ইউজার লগইন না থাকে, তবে ডেটা আনবো না
      if (!session?.user?.id) return 

      try {
        setIsLoading(true)
        // API থেকে ডেটা আনুন
        const data = await getCustomerAppointments(session.user.id)
        setAppointments(data)
      } catch (error) {
        console.error("Failed to fetch appointments", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [session?.user?.id]) // ইউজার লগইন হলে বা আইডি পেলে আবার ডেটা আনবে

  // ⬇️ ৫. লোডিং স্টেট দেখান
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex justify-center py-20">
        <p className="text-muted-foreground animate-pulse">Loading your appointments...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold">My Appointments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Here are your upcoming and past bookings.
      </p>

      {/* ⬇️ ৬. যদি কোনো অ্যাপয়েন্টমেন্ট না থাকে তবে মেসেজ দেখান */}
      {appointments.length === 0 ? (
        <div className="mt-10 text-center py-10 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">You have no appointments booked yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* ⬇️ ৭. আসল ডেটা ম্যাপ করে দেখান */}
          {appointments.map((appointment) => (
            <Card key={appointment._id} className="pt-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {appointment.serviceName}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(appointment.status)}>
                    {appointment.status}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}