"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Camera, Mail, Phone, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authClient, useSession } from "@/lib/auth-client"
import Image from "next/image"

type ProfileUser = {
    id: string
    name?: string | null
    email: string
    image?: string | null
    phone?: string | null
}

export default function AdminProfilePage() {
    const { data: session, isPending } = useSession()

    // Loading state
    if (isPending) {
        return (
            <div className="flex w-full max-w-6xl justify-center px-4 py-20 md:p-8">
                <p className="animate-pulse text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!session) return null

    return <ProfileForm user={session.user} />
}

function ProfileForm({ user }: { user: ProfileUser }) {
    const router = useRouter()

    // Form state
    const [name, setName] = useState(user.name || "")
    const [phone, setPhone] = useState(user.phone || "")
    const [image, setImage] = useState(user.image || "")
    const [saving, setSaving] = useState(false)

    // Save the updated profile
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaving(true)

        try {
            const { error } = await authClient.updateUser({
                name,
                image,
                phone,
            })

            if (error) {
                toast.error(error.message || "Could not update the profile. Please try again.")
            } else {
                toast.success("Profile updated successfully!")
                router.refresh()
            }
        } catch (err) {
            console.error("Update error:", err)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Update your personal information here.
            </p>

            <Card className="mt-6 pt-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Profile Details</CardTitle>
                    <CardDescription>
                        Only name, phone and image can be changed.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Profile image preview */}
                    <Image
                        src={image || "https://github.com/shadcn.png"}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border-2 border-rose-500 mx-auto mb-6"
                    />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <User className="size-4" /> Name
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <Mail className="size-4" /> Email
                            </label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="text-muted-foreground"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <Phone className="size-4" /> Phone
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="01XXXXXXXXX"
                            />
                        </div>

                        {/* Profile Image URL */}
                        <div>
                            <label htmlFor="image" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <Camera className="size-4" /> Profile Image URL
                            </label>
                            <Input
                                id="image"
                                type="url"
                                value={image}
                                onChange={(event) => setImage(event.target.value)}
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
                        >
                            {saving ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}