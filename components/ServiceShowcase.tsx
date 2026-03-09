"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

interface WaveConfig {
  frequency: number;
  amplitude: number;
  speed: number;
  layers: number;
}

const SERVICES = [
  {
    key: "showcase",
    overline: "SHOWCASE & PERFORMANCE",
    title: "Showcase & Performance",
    description:
      "High-impact robotic demonstrations for events, trade shows, and brand activations.",
    href: "/services?category=Showcase+%26+Performance",
    waveConfig: { frequency: 0.006, amplitude: 70, speed: 0.017, layers: 3 },
  },
  {
    key: "warehouse",
    overline: "WAREHOUSE",
    title: "Warehouse Automation",
    description:
      "Streamline logistics with autonomous picking, sorting, and delivery robots. Built for scale.",
    href: "/services?category=Warehouse",
    waveConfig: { frequency: 0.018, amplitude: 55, speed: 0.022, layers: 3 },
  },
  {
    key: "restaurant",
    overline: "RESTAURANT",
    title: "Restaurant Service Robots",
    description:
      "Front-of-house delivery and back-of-house prep robots for modern dining operations.",
    href: "/services?category=Restaurant",
    waveConfig: { frequency: 0.012, amplitude: 38, speed: 0.013, layers: 3 },
  },
];

function WaveformCanvas({ config }: { config: WaveConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const layerOpacities = [0.15, 0.09, 0.05];
    const layerPhases = [0, Math.PI * 0.6, Math.PI * 1.2];
    const layerAmplMult = [1, 0.65, 0.4];

    const draw = () => {
      timeRef.current += config.speed;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (let l = 0; l < config.layers; l++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${layerOpacities[l]})`;
        ctx.lineWidth = l === 0 ? 2 : 1;

        for (let x = 0; x <= width; x += 2) {
          const y =
            height / 2 +
            Math.sin(x * config.frequency + timeRef.current + layerPhases[l]) *
              config.amplitude *
              layerAmplMult[l] +
            Math.sin(
              x * config.frequency * 2.3 +
                timeRef.current * 1.4 +
                layerPhases[l]
            ) *
              config.amplitude *
              layerAmplMult[l] *
              0.4;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function ServiceSection({
  overline,
  title,
  description,
  href,
  waveConfig,
}: (typeof SERVICES)[number]) {
  return (
    <section className="relative flex items-center overflow-hidden bg-black" style={{ minHeight: "80vh" }}>
      <WaveformCanvas config={waveConfig} />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="flex max-w-xl flex-col gap-6"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400"
          >
            {overline}
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className={`${barlow.className} text-5xl font-extrabold uppercase leading-none text-white sm:text-6xl`}
          >
            {title}
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="h-px w-16 bg-white/30"
          />

          <motion.p
            variants={itemVariants}
            className="text-lg leading-relaxed text-gray-300"
          >
            {description}
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-black"
            >
              Explore
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ServiceShowcase() {
  return (
    <>
      {SERVICES.map(({ key, ...rest }) => (
        <ServiceSection key={key} {...rest} />
      ))}
    </>
  );
}
