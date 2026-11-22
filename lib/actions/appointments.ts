import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// ⬇️ টোকেন সহ ফেচ করার হেল্পার ফাংশন
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const { data: tokenData } = await authClient.token();
  const token = tokenData?.token;

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
};

// Fetch all appointments for one customer from the API
export const getCustomerAppointments = async (customerId: string) => {
  try {
    const res = await fetchWithToken(`${BASE_URL}/appointments?customerId=${customerId}`)

    if (!res.ok) {
      throw new Error("Failed to load appointments")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in getCustomerAppointments:", error)
    return []
  }
}

// Fetch appointment counts for a specific customer
export const getCustomerAppointmentsCount = async (customerId: string) => {
  try {
    const res = await fetchWithToken(`${BASE_URL}/appointments/count?customerId=${customerId}`)

    if (!res.ok) {
      throw new Error("Failed to load appointment counts")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in getCustomerAppointmentsCount:", error)
    return { total: 0, pending: 0, confirmed: 0, cancelled: 0, unpaid: 0 }
  }
}

// Create a new appointment (authFetch adds the JWT token automatically)
export const createAppointment = async (appointmentData: Record<string, unknown>) => {
  try {
    const res = await fetchWithToken(`${BASE_URL}/appointments`, {
      method: "POST",
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

// Cancel a Pending appointment (customer action)
export const cancelAppointment = async (id: string) => {
  try {
    const res = await fetchWithToken(`${BASE_URL}/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Cancelled" }),
    })

    if (!res.ok) {
      throw new Error("Failed to cancel appointment")
    }

    return await res.json()
  } catch (error) {
    console.error("Error in cancelAppointment:", error)
    return null
  }
}

// ADMIN FUNCTIONS:

// Fetch all appointments for Admin
export const getAllAppointmentsAdmin = async () => {
  try {
    const res = await fetchWithToken(`${BASE_URL}/admin/appointments`)

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
    const res = await fetchWithToken(`${BASE_URL}/admin/appointments/${id}`, {
      method: "PATCH",
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