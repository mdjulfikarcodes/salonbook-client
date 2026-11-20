import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Service = {
  _id?: string
  id?: string
  name: string
  category: string
  price: number
  duration: number
  description: string
  image?: string
}

export function ServiceCard({ service }: { service: Service }) {
  
  const serviceId = service._id || service.id;
  if (!serviceId) {
    console.error("Service ID is missing for:", service.name);
    return null; 
  }

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      {service.image ? (
        <img
          src={service.image}
          alt={service.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-rose-50 text-3xl font-bold text-rose-400">
          {service.name?.charAt(0)}
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{service.name}</CardTitle>
          <Badge variant="outline">{service.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-1 pb-2">
        <p className="text-sm">
          <span className="font-semibold">৳{service.price}</span>
          {" · "}
          {service.duration} min
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
      </CardContent>

      <CardFooter>
  
        <Link
          href={`/browse-services/${serviceId}`}
          className={cn(
            buttonVariants(),
            "w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
          )}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}