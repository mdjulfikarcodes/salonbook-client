import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export const getUsers = async () => {
    try {
        const result = await auth.api.listUsers({
            query: {
                sortBy: "name",
                sortDirection: "desc",
            },
            headers: await headers(),
        })

        return result.users
    } catch (error) {
        console.error("Error in getUsers:", error)
        return []
    }
}
