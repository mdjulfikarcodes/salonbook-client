import Link from "next/link"

import { ServiceCard, type Service } from "@/components/services/ServiceCard"
import { buttonVariants } from "@/components/ui/button"
import { getServices } from "@/lib/api/services"
import { cn } from "@/lib/utils"

// Service + status field (backend sends status like "Active")
type ServiceWithStatus = Service & { status?: string }

// Shows up to 6 Active services on the home page
export default async function FeaturedService() {
  // Fetch all services from the API
  const allServices: ServiceWithStatus[] = await getServices()

  // Only Active services, max 6 items
  const featuredServices = allServices
    .filter((service) => service.status === "Active")
    .slice(0, 6)

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Featured Salon Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Our most loved treatments, picked just for you.
          </p>
        </div>

        <Link
          href="/browse-services"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
        >
          View All
        </Link>
      </div>

      {featuredServices.length === 0 ? (
        <div className="mt-8 text-center py-10 bg-muted/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">No active services to show yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard key={service._id || service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
