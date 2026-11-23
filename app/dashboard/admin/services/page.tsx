import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getServices } from "@/lib/api/services"
import { DeleteServiceButton } from "@/components/DeleteServiceButton"
import { ToggleStatusButton } from "@/components/ToggleStatusButton" 

type ServiceRow = {
    _id: string
    serviceName: string
    price: number | string
    status: string
}

export default async function ManageServicesPage() {
    const services: ServiceRow[] = await getServices()

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Services</h1>
                <Link href="/dashboard/admin/services/add" className={cn(buttonVariants(), "bg-rose-500 hover:bg-rose-600")}>
                    Add New Service
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        )}
                        {services.map((service) => (
                            <TableRow key={service._id}>
                                <TableCell className="font-medium">{service.serviceName}</TableCell>
                                <TableCell>৳{service.price}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            service.status === "Active"
                                                ? "text-green-600 border-green-200 bg-green-50"
                                                : "text-zinc-500 bg-zinc-50"
                                        }
                                    >
                                        {service.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <Link
                                            href={`/dashboard/admin/services/add?id=${service._id}`}
                                            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                                        >
                                            Edit
                                        </Link>
                                        <DeleteServiceButton serviceId={service._id} />
                                        
                                        
                                        <ToggleStatusButton 
                                            serviceId={service._id} 
                                            currentStatus={service.status} 
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export const dynamic = 'force-dynamic'