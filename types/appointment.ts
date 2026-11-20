// This describes one appointment booking
export interface Appointment {
  _id?: string // unique id (optional, backend adds it)
  serviceName: string // e.g. "Premium Haircut"
  servicePrice: number // price in ৳
  appointmentDate: string // e.g. "2026-11-25"
  timeSlot: string // e.g. "10:00 AM"
  status: "Pending" | "Confirmed" | "Cancelled"
}
