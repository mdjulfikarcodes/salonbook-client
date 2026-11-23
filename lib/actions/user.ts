"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"


export const blockUser = async (userId: string) => {
    try {
        await auth.api.banUser({
            body: {
                userId,
                banReason: "Blocked by admin",
            },
            headers: await headers(),
        })
    } catch (error) {
        console.error("Error in blockUser:", error)
    }

    revalidatePath("/dashboard/admin/users")
}

export const unblockUser = async (userId: string) => {
    try {
        await auth.api.unbanUser({
            body: { userId },
            headers: await headers(),
        })
    } catch (error) {
        console.error("Error in unblockUser:", error)
    }

    revalidatePath("/dashboard/admin/users")
}