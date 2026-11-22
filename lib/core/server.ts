import "server-only"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// Get the logged-in user's session (server components & route handlers only)
export async function getSession() {
    return auth.api.getSession({ headers: await headers() })
}

// Return the session only if the user has the given role, otherwise null
export async function requireRole(role: string) {
    const session = await getSession()

    if (!session || session.user.role !== role) {
        return null
    }

    return session
}
