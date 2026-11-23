"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

type Slide = {
  image: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

const slides: Slide[] = [
  {
    image: "/assets/hero1.jpg",
    title: "Book Your Perfect Salon Experience",
    subtitle: "Explore top-rated salons and book instantly — anytime, anywhere.",
    ctaText: "Explore Salon Services",
    ctaLink: "/browse-services",
  },
  {
    image: "/assets/hero2.jpg",
    title: "Premium Hair & Beauty Care",
    subtitle: "Trusted professionals, quality service, and secure online payment.",
    ctaText: "Explore Salon Services",
    ctaLink: "/browse-services",
  },
  {
    image: "/assets/hero3.jpg",
    title: "Your Beauty, Your Schedule",
    subtitle: "Choose your service, pick a time slot, and pay securely with Stripe.",
    ctaText: "Explore Salon Services",
    ctaLink: "/browse-services",
  },
]

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[500px] md:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.image} className="relative">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 flex h-full items-center justify-center">
              <div className="max-w-3xl space-y-4 px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-white md:text-5xl">
                  {slide.title}
                </h2>
                <p className="text-base text-gray-100 md:text-lg">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaLink}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full bg-rose-500 px-6 text-white hover:bg-rose-600"
                  )}
                >
                  {slide.ctaText}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
