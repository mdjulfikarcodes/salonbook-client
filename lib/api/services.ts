const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"


export const getServices = async (query?: string) => {
    const url = query ? `${BASE_URL}/services?${query}` : `${BASE_URL}/services`

    try {
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch services")

        const data = await res.json()

        if (Array.isArray(data)) return data
        return data?.services ?? data?.data ?? []
    } catch (error) {
        console.error("Error in getServices:", error)
        return []
    }
}

export const getServiceById = async (id: string) => {
    try {
        const res = await fetch(`${BASE_URL}/services/${id}`, { cache: "no-store" })

        if (!res.ok) {
            return null
        }

        return await res.json()
    } catch (error) {
        console.error("Fetch error:", error)
        return null
    }
}

export const deleteService = async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        console.error("Delete failed with status:", res.status)
        return null
    }

    return res.json()
}
