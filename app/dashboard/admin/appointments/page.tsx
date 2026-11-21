"use client"

import { useEffect, useState } from "react"
import { getAllAppointmentsAdmin, updateAppointmentStatusAdmin } from "@/lib/actions/appointments"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  
  const loadData = async () => {
    setLoading(true)
    const data = await getAllAppointmentsAdmin() 
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])


  const handleStatusChange = async (id: string, newStatus: string) => {
    const confirmAction = window.confirm(`Are you sure you want to mark this as ${newStatus}?`)
    if (!confirmAction) return

    await updateAppointmentStatusAdmin(id, newStatus)
    loadData() 
  }

  if (loading) return <p className="p-8">Loading appointments...</p>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Manage Appointments</h1>

      <div className="grid grid-cols-1 gap-4">
        {appointments.map((app) => (
          <Card key={app._id}>
            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div>
                <h2 className="text-lg font-semibold">{app.serviceName}</h2>
                <p className="text-sm text-zinc-500">Customer: {app.customerName} ({app.customerEmail})</p>
                <p className="text-sm">Date: {app.appointmentDate} | Time: {app.timeSlot}</p>
                {app.message && <p className="text-sm text-blue-500 mt-1">Note: {app.message}</p>}
              </div>

              
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge variant={app.status === "Confirmed" ? "default" : "outline"}>
                    {app.status}
                  </Badge>
                  <Badge variant={app.paymentStatus === "Paid" ? "default" : "destructive"}>
                    {app.paymentStatus}
                  </Badge>
                </div>

                
                <div className="flex gap-2 mt-2">
                  {app.status === "Pending" && (
                    <>
                      <Button size="sm" onClick={() => handleStatusChange(app._id, "Confirmed")} className="bg-green-600">
                        Confirm
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatusChange(app._id, "Cancelled")}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {app.status === "Confirmed" && (
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(app._id, "Cancelled")}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}