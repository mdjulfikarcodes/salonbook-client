"use client"

import { authClient } from "@/lib/auth-client"


export async function getToken() {
    const { data, error } = await authClient.token()
    
    if (error || !data?.token) {
        console.log(" No token found");
        return null
    }
    return data.token
}

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = await getToken()

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
}