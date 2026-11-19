const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getServices = async () =>{
    const res = await fetch(`${BASE_URL}/services`, { cache: 'no-store' })
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