import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// Fetch all users (admin plugin, needs an admin session cookie)
export const getUsers = async () => {
    try {
        const result = await auth.api.listUsers({
            query: {
                sortBy: "name",
                sortDirection: "desc",
            },
            headers: await headers(),
        })

        return result.users // plain array of users
    } catch (error) {
        console.error("Error in getUsers:", error)
        return []
    }
}
