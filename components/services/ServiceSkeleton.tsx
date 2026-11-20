import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

export function ServiceSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Card key={n} className="animate-pulse overflow-hidden">
          <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800" />
          <CardHeader className="pb-2">
            <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </CardHeader>
          <CardContent className="space-y-2 pb-2">
            <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
          <CardFooter>
            <div className="h-10 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
