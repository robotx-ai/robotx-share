"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal"],
  display: "swap",
});

const slides = [
  { image: "/Showcase.png", label: "Performance Services" },
  { image: "/Restaurant.png", label: "Restaurant Services" },
  { image: "/Warehouse_Delivery.png", label: "Warehouse Services" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % slides.length);
  }, []);

  // Auto-advance every 10s; restarted whenever currentIndex changes (resets on manual nav too)
  useEffect(() => {
    const timer = setInterval(advance, 10_000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const goTo = (index: number) => {
    if (index !== currentIndex) setCurrentIndex(index);
  };

  return (
    <section className="relative -mt-28 min-h-[calc(100vh-112px)] overflow-hidden pt-28">
      {/* Background images — crossfade */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url('${slides[currentIndex].image}')` }}
        />
      </AnimatePresence>

      {/* Subtle left-side gradient for text legibility without obscuring the right-side imagery */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content — anchored to left 50% */}
      <div className="relative z-10 flex min-h-[calc(100vh-112px)] items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="flex w-full sm:w-1/2 flex-col gap-8">
            {/* Headline */}
            <h1
              className={`${barlow.className} text-[2.75rem] font-extrabold uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl`}
            >
              Book RobotX Services for
              {/* Animated service name — clip reveal */}
              <span className="mt-1 block overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-110%" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block text-neutral-300"
                  >
                    {slides[currentIndex].label}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* CTA */}
            <div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-neutral-200"
              >
                Explore Services
              </Link>
            </div>

            {/* Slide indicators — thin rectangles (industrial feel) */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-[2px] rounded-full transition-all duration-500 ${
                    i === currentIndex
                      ? "w-8 bg-white"
                      : "w-3 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
