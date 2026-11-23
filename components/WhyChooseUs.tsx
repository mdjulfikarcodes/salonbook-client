import { Calendar, Scissors, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react"

const features: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Expert Stylists",
    description: "Trained professionals who know exactly what suits you.",
    icon: Scissors,
  },
  {
    title: "Premium Products",
    description: "Only trusted, salon-grade products touch your hair and skin.",
    icon: Sparkles,
  },
  {
    title: "Hygiene First",
    description: "Sterilized tools and a spotless space for every visit.",
    icon: ShieldCheck,
  },
  {
    title: "Easy Booking",
    description: "Book your appointment online in just a few taps.",
    icon: Calendar,
  },
]


export default function WhyChooseUs() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-14">
      <div className="text-center">
        <h2 className="text-2xl font-bold md:text-3xl">Why Choose Us?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reasons our customers keep coming back.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border bg-card p-6 text-center transition-colors hover:border-rose-300 hover:bg-rose-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/30"
          >
            
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-950">
              <Icon className="size-6" />
            </span>

            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

