"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number; a: number; va: number
}

export function Particles({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === "undefined") return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = window.innerWidth
    let H = canvas.closest("section")?.clientHeight ?? window.innerHeight
    let rafId: number
    let mx = -9999, my = -9999

    canvas.width  = W
    canvas.height = H

    const resize = () => {
      W = window.innerWidth
      H = canvas.closest("section")?.clientHeight ?? window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    window.addEventListener("resize", resize)
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener("mousemove", onMove)

    const CR = 220, CG = 38, CB = 38
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      a: Math.random(),
      va: (Math.random() - 0.5) * 0.004,
    }))

    const draw = () => {
      rafId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my
        const d  = Math.hypot(dx, dy)
        if (d < 120 && d > 0) { p.vx += (dx / d) * 0.04; p.vy += (dy / d) * 0.04 }
        p.vx *= 0.99; p.vy *= 0.99
        p.x  += p.vx; p.y  += p.vy
        p.a  += p.va
        if (p.a < 0.05) p.va =  Math.abs(p.va)
        if (p.a > 0.55) p.va = -Math.abs(p.va)
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${CR},${CG},${CB},${p.a.toFixed(3)})`
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.hypot(dx, dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${CR},${CG},${CB},${((1 - d / 100) * 0.12).toFixed(3)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  )
}

export default Particles
