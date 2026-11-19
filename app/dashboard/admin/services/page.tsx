import Link from "next/link"

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
import { getServices } from "@/lib/api/services"

type Service = {
  _id: string // MongoDB থেকে আইডি _id হিসেবে আসে
  name: string
  image: string
  category: string
  price: number
  duration: number
  status: "Active" | "Inactive"
}

export default async function ManageServicesPage() {
  const services = await getServices();

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
            {services.map((service: Service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-md bg-rose-100 text-sm font-semibold text-rose-600">
                        {service.name?.charAt(0)}
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
                      href={`/dashboard/admin/services/add?id=${service._id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Edit
                    </Link>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                    <Button variant="outline" size="sm">
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