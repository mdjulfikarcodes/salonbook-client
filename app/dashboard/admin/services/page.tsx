"use client"

import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Service = {
  id: number
  name: string
  image: string
  category: string
  price: number
  duration: number
  status: "Active" | "Inactive"
}

const dummyServices: Service[] = [
  { id: 1, name: "Premium Haircut", image: "", category: "Haircut", price: 500, duration: 30, status: "Active" },
  { id: 2, name: "Full Hair Coloring", image: "", category: "Coloring", price: 2500, duration: 90, status: "Active" },
  { id: 3, name: "Deep Cleansing Facial", image: "", category: "Facial", price: 1500, duration: 60, status: "Active" },
  { id: 4, name: "Bridal Makeup", image: "", category: "Makeup", price: 5000, duration: 120, status: "Inactive" },
  { id: 5, name: "Relaxing Spa", image: "", category: "Spa", price: 3000, duration: 75, status: "Active" },
]

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>(dummyServices)

  // Delete the service after a simple confirm dialog
  function handleDelete(service: Service) {
    const confirmed = window.confirm(`Delete "${service.name}"?`)
    if (!confirmed) return
    setServices(services.filter((item) => item.id !== service.id))
  }

  // Switch a service between Active and Inactive
  function handleToggleStatus(service: Service) {
    setServices(
      services.map((item) =>
        item.id === service.id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link
          href="/dashboard/admin/services/add"
          className={cn(buttonVariants(), "bg-rose-500 text-white hover:bg-rose-600")}
        >
          Add New Service
        </Link>
      </div>

      <div className="mt-6 w-full overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-md bg-rose-100 text-sm font-semibold text-rose-600">
                        {service.name.charAt(0)}
                      </span>
                    )}
                    <span className="font-medium">{service.name}</span>
                  </div>
                </TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>৳{service.price}</TableCell>
                <TableCell>{service.duration} min</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      service.status === "Active"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500"
                    }
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href="/dashboard/admin/services/add"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Edit
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(service)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(service)}
                    >
                      {service.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
