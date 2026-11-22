import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Unauthorized</h1>
      <p className="text-muted-foreground mb-8">You do not have permission to access this page.</p>
      <Link href="/">
        <Button>Go Back Home</Button>
      </Link>
    </div>
  )
}