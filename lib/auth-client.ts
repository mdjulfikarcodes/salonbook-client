import { inferAdditionalFields, adminClient, jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(), 
        adminClient(),
        jwtClient() // ⬅️ টোকেন জেনারেট করার জন্য জরুরি
    ],
})

export const { signIn, signUp, signOut, useSession } = authClient;