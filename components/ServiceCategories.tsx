import Link from "next/link"
import {
  Brush,
  Droplets,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

const categories: { name: string; icon: LucideIcon }[] = [
  { name: "Haircut", icon: Scissors },
  { name: "Coloring", icon: Palette },
  { name: "Treatment", icon: Sparkles },
  { name: "Facial", icon: Droplets },
  { name: "Makeup", icon: Brush },
  { name: "Manicure", icon: Hand },
  { name: "Spa", icon: Flower2 },
]

// Category cards that link to the filtered browse page
export default function ServiceCategories() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-14 mt-8">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Salon Service Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a category and explore what we offer.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            href={`/browse-services?category=${name}`}
            className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-colors hover:border-rose-300 hover:bg-rose-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/30"
          >
            {/* Icon circle */}
            <span className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white dark:bg-rose-950">
              <Icon className="size-6" />
            </span>

            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">Browse services →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
