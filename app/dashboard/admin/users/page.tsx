import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getUsers } from "@/lib/api/user"
import { blockUser, unblockUser } from "@/lib/actions/user"

// Shape of one user row
type UserRow = {
    id: string
    name: string
    email: string
    role?: string | null
    banned?: boolean | null
}

export default async function ManageUsersPage() {
    // Fetch all users from Better Auth
    const users: UserRow[] = await getUsers()

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Block or unblock users from here.
                </p>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}

                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            user.role === "admin"
                                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                                : "text-zinc-500 bg-zinc-50"
                                        }
                                    >
                                        {user.role === "admin" ? "admin" : "customer"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            user.banned
                                                ? "border-red-200 bg-red-50 text-red-600"
                                                : "border-green-200 bg-green-50 text-green-700"
                                        }
                                    >
                                        {user.banned ? "Blocked" : "Active"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    {/* Show Block or Unblock based on user.banned */}
                                    {user.banned ? (
                                        <form action={unblockUser.bind(null, user.id)}>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                                className="border-green-200 text-green-700 hover:bg-green-50"
                                            >
                                                Unblock
                                            </Button>
                                        </form>
                                    ) : (
                                        <form action={blockUser.bind(null, user.id)}>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                Block
                                            </Button>
                                        </form>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}


export const dynamic = 'force-dynamic'