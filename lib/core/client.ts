"use client"

import { authClient } from "@/lib/auth-client"

// Better Auth থেকে JWT টোকেন নেওয়ার ফাংশন
export async function getToken() {
    const { data, error } = await authClient.token()
    
    if (error || !data?.token) {
        console.log("❌ No token found");
        return null
    }
    return data.token
}

// প্রতিটি রিকোয়েস্টে টোকেন যুক্ত করার জন্য authFetch
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