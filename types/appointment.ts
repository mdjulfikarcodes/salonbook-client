
export interface Appointment {
  _id?: string 
  serviceName: string
  servicePrice: number
  appointmentDate: string 
  timeSlot: string 
  status: "Pending" | "Confirmed" | "Cancelled"
}
