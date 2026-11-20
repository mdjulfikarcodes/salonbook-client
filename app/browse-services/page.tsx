"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { ServiceCard, type Service } from "@/components/services/ServiceCard"
import { ServiceSkeleton } from "@/components/services/ServiceSkeleton"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getServices } from "@/lib/api/services"

const categories = [
    "All",
    "Haircut",
    "Coloring",
    "Facial",
    "Makeup",
    "Spa",
    "Manicure",
    "Pedicure",
]

export default function BrowseServicesPage() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [sort, setSort] = useState("default")
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    // ⬇️ ১. Debounce Search State
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500) // ৫০০ মিলিসেকেন্ড অপেক্ষা করবে

        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        let active = true

        async function fetchServices() {
            const params = new URLSearchParams()
            // ⬇️ এখানে debouncedSearch ব্যবহার করা হলো
            if (debouncedSearch) params.set("search", debouncedSearch)
            if (category !== "All") params.set("category", category)
            if (sort !== "default") params.set("sort", sort)
            const queryString = params.toString()

            try {
                setLoading(true)
                const data = await getServices(queryString)
                if (active) {
                    const list = Array.isArray(data)
                        ? data
                        : data?.services || data?.data || []
                    setServices(list)
                }
            } catch {
                if (active) setServices([])
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchServices()

        return () => {
            active = false
        }
    }, [debouncedSearch, category, sort]) // ⬇️ ডিপেন্ডেন্সি অ্যারে চেঞ্জ করা হলো

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[80vh]">
            <h1 className="text-2xl font-bold">Browse Services</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Find and book the perfect service for you.
            </p>

            {/* Filter bar */}
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={category} onValueChange={(value) => setCategory(String(value))}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={(value) => setSort(String(value))}>
                    <SelectTrigger className="w-full md:w-56">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results grid */}
            {loading ? (
                // ⬇️ ২. লোডিংয়ের সময় ৬টি ডামি কার্ড (Skeleton) দেখানো হচ্ছে
                <ServiceSkeleton />
            ) : services.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <p className="text-center text-muted-foreground">No services found.</p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <ServiceCard key={service._id || service.id} service={service} />
                    ))}
                </div>
            )}
        </div>
    )
}
