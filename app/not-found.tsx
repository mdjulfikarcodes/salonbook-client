import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <p className="text-7xl font-bold text-rose-500">404</p>
            <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                The page you are looking for does not exist or has been moved.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                    href="/"
                    className={cn(buttonVariants(), "rounded-full bg-rose-500 text-white hover:bg-rose-600")}
                >
                    Go Home
                </Link>
                <Link
                    href="/browse-services"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                    Browse Services
                </Link>
            </div>
        </div>
    )
}
