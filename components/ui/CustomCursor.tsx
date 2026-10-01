"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [size, setSize] = useState(40)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // ~120ms of lag.
  const sx = useSpring(x, { damping: 26, stiffness: 320, mass: 0.6 })
  const sy = useSpring(y, { damping: 26, stiffness: 320, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add("cursor-none-desktop")

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as HTMLElement)?.closest("[data-cursor]")
      const kind = el?.getAttribute("data-cursor")
      setSize(kind === "photo" ? 64 : kind === "link" ? 8 : 40)
    }

    window.addEventListener("mousemove", move)
    return () => {
      window.removeEventListener("mousemove", move)
      document.documentElement.classList.remove("cursor-none-desktop")
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-gold"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size,
        height: size,
        backgroundColor: size === 8 ? "#E8C170" : "transparent",
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
