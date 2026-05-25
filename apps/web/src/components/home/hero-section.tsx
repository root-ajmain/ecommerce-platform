"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  accentColor: string;
}

const DEMO_SLIDES: Slide[] = [
  {
    id: "1",
    title: "Elevate Your Style",
    subtitle: "New Collection",
    description: "Discover handpicked pieces that define modern luxury.",
    ctaLabel: "Shop Now",
    ctaUrl: "/category/new-arrivals",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
    accentColor: "from-violet-600 to-purple-800",
  },
  {
    id: "2",
    title: "Summer Essentials",
    subtitle: "Hot Deals",
    description: "Up to 60% off on premium summer collections.",
    ctaLabel: "View Deals",
    ctaUrl: "/category/summer",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80",
    accentColor: "from-orange-500 to-rose-600",
  },
  {
    id: "3",
    title: "Tech & Lifestyle",
    subtitle: "Just Arrived",
    description: "The future of wearable tech is here.",
    ctaLabel: "Explore",
    ctaUrl: "/category/tech",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1400&q=80",
    accentColor: "from-cyan-500 to-blue-600",
  },
];

const SLIDE_DURATION = 6000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % DEMO_SLIDES.length);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    resetInterval();
  };

  const prev = () => { setDirection(-1); setCurrent((p) => (p - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length); resetInterval(); };
  const next = () => { setDirection(1); setCurrent((p) => (p + 1) % DEMO_SLIDES.length); resetInterval(); };

  const slide = DEMO_SLIDES[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section
      className="relative h-[90vh] min-h-[600px] overflow-hidden bg-black"
      onMouseMove={(e) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            style={prefersReducedMotion ? {} : { rotateX: smoothRotateX, rotateY: smoothRotateY }}
            className="max-w-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <span className={`inline-block rounded-full bg-gradient-to-r ${slide.accentColor} px-4 py-1.5 text-sm font-semibold text-white`}>
                  {slide.subtitle}
                </span>
                <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="max-w-lg text-lg text-white/80">{slide.description}</p>
                <div className="flex gap-4">
                  <Link
                    href={slide.ctaUrl}
                    className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${slide.accentColor} px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  >
                    {slide.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {DEMO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-2 bg-white/40"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
