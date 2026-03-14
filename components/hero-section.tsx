"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronDown, ArrowRight } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { GITHUB_URL, TECH_TAGS } from "@/config/constants"
import { EASE, EASE_SMOOTH, EASE_BOUNCE, DUR, DUR_SLOW, PAGE_START, PAGE_STEP } from "@/lib/animation"

const Particles = dynamic(() => import("@/components/particles"), { ssr: false })

// Letter animation - fast wave effect
const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: PAGE_START + i * 0.012, 
      duration: 0.2, 
      ease: EASE 
    },
  }),
}

const AnimatedText = ({ text, className }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <motion.span 
        key={i} 
        custom={i} 
        variants={letterVariants} 
        initial="hidden" 
        animate="visible" 
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
)

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use window scroll without target to avoid container position warnings
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center px-4" style={{ overflow: "clip" }}>

      {/* Grid bg - instant */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 grid-bg"
      />

      {/* Particles - only render after mount to prevent hydration mismatch */}
      {mounted && <Particles count={55} />}

      {/* Radial glow - fast entrance */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: "radial-gradient(ellipse at 50% 40%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 55%)"
        }} 
      />

      {/* Floating orbs - ambient */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025, x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ 
          opacity: { duration: 0.5 },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full pointer-events-none blur-3xl" 
        style={{ background: "var(--primary)" }} 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02, x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.1 },
          x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 14, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full pointer-events-none blur-3xl" 
        style={{ background: "var(--primary)" }} 
      />

      <motion.div style={{ y, opacity, willChange: "transform, opacity" }} className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">

        {/* Status badge - fast entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, delay: PAGE_START, ease: EASE_BOUNCE }}
          className="flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs font-medium text-primary tracking-wide">Available for hire</span>
        </motion.div>

        {/* Name - fast letter wave */}
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          <AnimatedText text="Reject" />
          {"Modders".split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i + 6}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block text-primary"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle - fast slide up */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: PAGE_START + 0.1, duration: DUR, ease: EASE }}
          className="max-w-2xl space-y-3"
        >
          <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
            Cybersecurity developer from Missouri, building things I actually care about.
          </p>
          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: PAGE_START + 0.14, duration: DUR, ease: EASE }}
            className="text-base text-foreground/90 font-medium sm:text-lg"
          >
            Right now that means security tools and keeping people safe online.
          </motion.p>
        </motion.div>

        {/* Tech tags - fast staggered entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ 
            visible: { 
              transition: { 
                staggerChildren: 0.02, 
                delayChildren: PAGE_START + 0.16 
              } 
            } 
          }}
          className="flex flex-wrap justify-center gap-2 max-w-xl"
        >
          {TECH_TAGS.map((lang) => (
            <motion.span
              key={lang}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  scale: 1, 
                  transition: { duration: 0.15, ease: EASE } 
                },
              }}
              whileHover={{ scale: 1.06, transition: { duration: 0.1 } }}
              className="rounded-md border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-sm transition-colors duration-100 hover:border-primary/30 hover:text-foreground cursor-default"
            >
              {lang}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons - fast staggered entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ 
            visible: { 
              transition: { 
                staggerChildren: 0.03, 
                delayChildren: PAGE_START + 0.2 
              } 
            } 
          }}
          className="flex flex-col items-center gap-3 pt-2 w-full sm:flex-row sm:justify-center sm:gap-4"
        >
          <motion.div
            variants={{ 
              hidden: { opacity: 0, y: 10 }, 
              visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } } 
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link href="/projects" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-100 sm:w-auto">
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-100 group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.div
            variants={{ 
              hidden: { opacity: 0, y: 10 }, 
              visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } } 
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link href="/about" className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card/50 px-7 py-3.5 font-semibold text-foreground backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-100 sm:w-auto">
              About Me
            </Link>
          </motion.div>
          <motion.a
            variants={{ 
              hidden: { opacity: 0, y: 10 }, 
              visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } } 
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card/50 px-7 py-3.5 font-semibold text-foreground backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-100 sm:w-auto"
          >
            GitHub
          </motion.a>
        </motion.div>

      </motion.div>

      {/* Scroll indicator - fast entrance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: PAGE_START + 0.3, duration: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:bottom-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: PAGE_START + 0.4, duration: 0.3 }}
          className="font-mono text-[10px] text-muted-foreground/30 select-none hidden sm:block"
        >
          {`// press Ctrl+K for magic`}
        </motion.p>
        <motion.div 
          animate={{ y: [0, 6, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/50 sm:h-6 sm:w-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}
