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
import Image from "next/image"

export type Service = {
  _id?: string
  id?: string
  serviceName: string;
  category: string
  price: number
  duration: number
  description: string
  image?: string
}

export function ServiceCard({ service }: { service: Service }) {

  const serviceId = service._id || service.id;
  if (!serviceId) {
    console.error("Service ID is missing for:", service.serviceName);
    return null;
  }

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-rose-100 pt-0 shadow-[0_12px_32px_-16px_rgba(190,24,93,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_24px_48px_-18px_rgba(190,24,93,0.45)]">
      {service.image ? (
        <Image
  src={service.image}
  alt={service.serviceName}
  width={400}
  height={192}
  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105 h-auto"
/>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-rose-50 to-gold-soft text-3xl font-bold text-rose-500">
          {service.serviceName?.charAt(0)}
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{service.serviceName}</CardTitle>
          <Badge variant="outline" className="border-gold/40 bg-gold-soft font-medium text-ink">
            {service.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-1 pb-2">
        <p className="text-sm">
          <span className="font-bold text-rose-600">৳{service.price}</span>
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
            "w-full rounded-full bg-gradient-to-r from-rose-500 to-rosegold font-semibold text-white shadow-md shadow-rose-500/25 transition-all hover:from-rose-600 hover:shadow-lg"
          )}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
