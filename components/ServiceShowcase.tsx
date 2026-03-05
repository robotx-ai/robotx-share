"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const SERVICES = [
  {
    key: "cleaning",
    label: "Cleaning",
    image: "/Warehouse.png",
    title: "Cleaning Robots",
    description:
      "Autonomous floor-cleaning robots for commercial spaces. Precision-scheduled, operator-managed, zero supervision required.",
    href: "/services?category=Cleaning",
  },
  {
    key: "warehouse",
    label: "Warehouse",
    image: "/Warehouse_Delivery.png",
    title: "Warehouse Automation",
    description:
      "Streamline logistics with autonomous picking, sorting, and delivery robots. Built for scale.",
    href: "/services?category=Warehouse",
  },
  {
    key: "restaurant",
    label: "Restaurant",
    image: "/Restaurant.png",
    title: "Restaurant Service Robots",
    description:
      "Front-of-house delivery and back-of-house prep robots for modern dining operations.",
    href: "/services?category=Restaurant",
  },
  {
    key: "showcase",
    label: "Showcase",
    image: "/Showcase.png",
    title: "Showcase & Performance",
    description:
      "High-impact robotic demonstrations for events, trade shows, and brand activations.",
    href: "/services?category=Showcase+%26+Performance",
  },
];

export default function ServiceShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SERVICES[activeIndex];

  return (
    <section className="relative overflow-hidden py-24">
      {/* Ambient video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source
          src="https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            What We Offer
          </p>
          <h2
            className={`${barlow.className} text-5xl font-extrabold uppercase text-white sm:text-6xl`}
          >
            Our Services
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <div className="relative flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {SERVICES.map((service, i) => (
              <button
                key={service.key}
                onClick={() => setActiveIndex(i)}
                className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                  i === activeIndex
                    ? "text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {i === activeIndex && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{service.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-center gap-10 md:grid-cols-2"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={active.image}
                alt={active.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={activeIndex === 0}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-6">
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                {active.title}
              </h3>
              <p className="text-lg leading-relaxed text-gray-300">
                {active.description}
              </p>
              <div>
                <Link
                  href={active.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-black"
                >
                  Explore
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
