const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// ⬇️ এখানে query প্যারামিটারটি যোগ করা হয়েছে
export const getServices = async (query?: string) => {

    const url = query ? `${BASE_URL}/services?${query}` : `${BASE_URL}/services`;
    
    const res = await fetch(url, { cache: 'no-store' })
    return res.json()
}

export const getServiceById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, { cache: 'no-store' })
    return res.json()
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