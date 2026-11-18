import Link from "next/link"
import { Clock, Mail, MapPin, Phone, Scissors } from "lucide-react"

type IconProps = { className?: string }

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V5c-.2 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4V11H8.8v3h2.4v7h2.3Z" />
    </svg>
  )
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.7 4h2.7l-6 6.9L21.5 20h-5.5l-4.3-5.6L6.7 20H4l6.5-7.4L3.9 4h5.6l3.9 5.2L17.7 4Zm-1 14.3h1.5L8.5 5.6H6.9l9.8 12.7Z" />
    </svg>
  )
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
]

const socials = [
  { href: "#", label: "Facebook", icon: FacebookIcon },
  { href: "#", label: "Instagram", icon: InstagramIcon },
  { href: "#", label: "Twitter", icon: XIcon },
]

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-zinc-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-rose-400"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-rose-500 text-white">
              <Scissors className="size-4" />
            </span>
            SalonBook
          </Link>
          <p className="mt-3 text-sm leading-relaxed">
            Book your favorite salon services anytime, anywhere.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm transition-colors hover:text-rose-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-rose-500" />
              <a
                href="tel:+880123456789"
                className="transition-colors hover:text-rose-400"
              >
                +880 1234 56789
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-rose-500" />
              <a
                href="mailto:hello@salonbook.com"
                className="transition-colors hover:text-rose-400"
              >
                hello@salonbook.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
            Visit Us
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
              <span>123 Gulshan Avenue, Dhaka</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-rose-500" />
              <span>Sat–Thu: 10AM–8PM</span>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full bg-neutral-800 text-zinc-300 transition-colors hover:bg-rose-500 hover:text-white"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-zinc-500">
          © 2025 SalonBook. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
