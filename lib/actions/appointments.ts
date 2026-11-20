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
