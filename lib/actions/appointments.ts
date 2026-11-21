// The backend server address (change it if your API runs elsewhere)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Fetch all appointments for one customer from the API
export const getCustomerAppointments = async (customerId: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/appointments?customerId=${customerId}`,
      { cache: "no-store" } // always get fresh data
    )

    if (!res.ok) {
      throw new Error("Failed to load appointments")
    }

    return await res.json()
  } catch (error) {
    // If something goes wrong, log it and return an empty list
    console.error("Error in getCustomerAppointments:", error)
    return []
  }
}

// Fetch appointment counts for a specific customer
export const getCustomerAppointmentsCount = async (customerId: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/appointments/count?customerId=${customerId}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error("Failed to load appointment counts")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in getCustomerAppointmentsCount:", error)
    return { total: 0, pending: 0, confirmed: 0, cancelled: 0, unpaid: 0 }
  }
}

// Create a new appointment and send it to the database
export const createAppointment = async (appointmentData: any) => {
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


// ADMIN FUNCTIONS:

// Fetch all appointments for Admin
export const getAllAppointmentsAdmin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin/appointments`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to load all appointments")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in getAllAppointmentsAdmin:", error)
    return []
  }
}

// Update appointment status by Admin (Confirm/Cancel)
export const updateAppointmentStatusAdmin = async (id: string, status: string) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      throw new Error("Failed to update status")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in updateAppointmentStatusAdmin:", error)
    return null
  }
}