const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// ==================== Types ====================

export interface AppointmentData {
  serviceId: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  serviceName?: string
  servicePrice?: number
  appointmentDate: string
  timeSlot: string
  message?: string
  status?: string
  paymentStatus?: string
}

// ==================== Create Appointment ====================

export const createAppointment = async (appointmentData: AppointmentData) => {
  try {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })

    if (!res.ok) {
      throw new Error("Failed to create appointment")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in createAppointment:", error)
    return null
  }
}