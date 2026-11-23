"use client"

import { useState, type FormEvent } from "react"
import { Camera, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { authClient, useSession } from "@/lib/auth-client"
import Image from "next/image"

// The user fields we need on this page
type ProfileUser = {
    id: string
    name?: string | null
    email: string
    image?: string | null
    phone?: string | null
    role?: string | null
}

export default function ProfilePage() {

    const { data: session, isPending } = useSession()


    if (isPending) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex justify-center py-20">
                <p className="text-muted-foreground animate-pulse">Loading...</p>
            </div>
        )
    }

    if (!session) return null

    return <ProfileForm user={session.user} />
}

function ProfileForm({ user }: { user: ProfileUser }) {
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
                // ⬇️ সঠিক টোস্ট মেথড
                toast.error(error.message || "Please try again.")
            } else {
                toast.success("Profile updated!", {
                    description: "Your changes have been saved.",
                })
            }
        } catch (err) {
            console.error("Update error:", err)
            toast.error("Update failed", {
                description: "Something went wrong.",
            })
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

                    <div className="mb-6 flex flex-col items-center gap-3">
                        {image ? (
                            <Image
                                src={image}
                                alt="Profile preview"
                                width={96}
                                height={96}
                                className="size-24 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="flex size-24 items-center justify-center rounded-full bg-rose-100 text-3xl font-bold text-rose-500 dark:bg-rose-950">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">Live preview of your image URL</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <User className="size-4" /> Full Name
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>


                        <div>
                            <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <Mail className="size-4" /> Email
                            </label>
                            <Input
                                id="email"
                                value={user.email}
                                readOnly
                                className="text-muted-foreground"
                            />
                        </div>


                        <div>
                            <label htmlFor="phone" className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                                <Phone className="size-4" /> Phone Number
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder="01XXXXXXXXX"
                            />
                        </div>


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


                        <div>
                            <label htmlFor="role" className="mb-1 text-sm font-medium">Role</label>
                            <Input
                                id="role"
                                value="customer"
                                readOnly
                                className="text-muted-foreground"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-full bg-rose-500 text-white hover:bg-rose-600"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}