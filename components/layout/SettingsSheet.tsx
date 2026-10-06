"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { INSTAGRAM } from "./nav"

type MotionPref = "full" | "reduced"
type QualityPref = "auto" | "high" | "eco"

export default function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [motion, setMotion] = useState<MotionPref>("full")
  const [quality, setQuality] = useState<QualityPref>("auto")
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [installSuccess, setInstallSuccess] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [expandedInfo, setExpandedInfo] = useState<"privacy" | "credits" | null>(null)

  // Track client mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background scroll while settings sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Initialize client settings & preferences
  useEffect(() => {
    if (typeof window === "undefined") return

    // Standalone PWA detection
    const standaloneMatch =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsStandalone(standaloneMatch)

    // Check PWA install prompt readiness
    if (window.__pwaPrompt) {
      setCanInstall(true)
    }
    const onPromptAvailable = () => setCanInstall(true)
    window.addEventListener("pwa-prompt-available", onPromptAvailable)

    // Motion preference
    const savedMotion = localStorage.getItem("frame-motion") as MotionPref | null
    if (savedMotion) {
      setMotion(savedMotion)
      document.documentElement.setAttribute("data-motion", savedMotion)
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("reduced")
      document.documentElement.setAttribute("data-motion", "reduced")
    }

    // Quality preference
    const savedQuality = localStorage.getItem("frame-quality") as QualityPref | null
    if (savedQuality) {
      setQuality(savedQuality)
    }

    return () => {
      window.removeEventListener("pwa-prompt-available", onPromptAvailable)
    }
  }, [])

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  const handleMotionChange = (val: MotionPref) => {
    setMotion(val)
    localStorage.setItem("frame-motion", val)
    document.documentElement.setAttribute("data-motion", val)
  }

  const handleQualityChange = (val: QualityPref) => {
    setQuality(val)
    localStorage.setItem("frame-quality", val)
  }

  const handleInstallClick = async () => {
    if (window.__pwaPrompt) {
      try {
        await window.__pwaPrompt.prompt()
        const choice = await window.__pwaPrompt.userChoice
        if (choice.outcome === "accepted") {
          setInstallSuccess(true)
          setCanInstall(false)
        }
        window.__pwaPrompt = null
      } catch {
        // Ignored
      }
    }
  }

  const handleShareClick = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://frame-aryan-on-cam.vercel.app"
    const shareData = {
      title: "FRAME — Aryan Pol",
      text: "FRAME is the photography journal of Aryan Pol.",
      url,
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or share failed
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2500)
    }
  }

  if (!open || !mounted) return null

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings & Control"
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4"
    >
      {/* Dimmed glass backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Sheet Container */}
      <div className="relative z-[9999] w-full max-w-lg rounded-t-[32px] sm:rounded-[28px] border border-white/[0.1] bg-[#120f0d]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-y-auto">
        {/* Mobile handle indicator */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-2xl tracking-[0.14em] text-cream">
              SETTINGS
            </h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">
              Preferences &amp; Information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-surface/70 text-muted transition-all duration-200 hover:border-gold/40 hover:text-cream active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Settings Sections */}
        <div className="mt-6 space-y-7">
          {/* 1. EXPERIENCE */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">
              Experience
            </p>
            <div className="rounded-2xl border border-line bg-surface/60 divide-y divide-line text-xs">
              {/* Appearance */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-cream font-medium">Appearance</p>
                  <p className="text-[11px] text-muted">Curated OLED editorial palette</p>
                </div>
                <span className="rounded-full border border-white/10 bg-surface px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] text-gold font-medium">
                  Dark (OLED)
                </span>
              </div>

              {/* Motion */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3.5">
                <div>
                  <p className="text-cream font-medium">Motion</p>
                  <p className="text-[11px] text-muted">Micro-animations &amp; dynamic transitions</p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-surface/80 p-0.5 w-fit">
                  <button
                    type="button"
                    onClick={() => handleMotionChange("full")}
                    className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] font-medium transition-all ${
                      motion === "full"
                        ? "bg-gold text-base shadow-sm font-semibold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    Full
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMotionChange("reduced")}
                    className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] font-medium transition-all ${
                      motion === "reduced"
                        ? "bg-gold text-base shadow-sm font-semibold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    Reduced
                  </button>
                </div>
              </div>

              {/* Image Quality */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3.5">
                <div>
                  <p className="text-cream font-medium">Image Quality</p>
                  <p className="text-[11px] text-muted">Adaptive Cloudinary bandwidth delivery</p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-surface/80 p-0.5 w-fit">
                  <button
                    type="button"
                    onClick={() => handleQualityChange("auto")}
                    className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-medium transition-all ${
                      quality === "auto"
                        ? "bg-gold text-base shadow-sm font-semibold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQualityChange("high")}
                    className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-medium transition-all ${
                      quality === "high"
                        ? "bg-gold text-base shadow-sm font-semibold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    High
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQualityChange("eco")}
                    className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-medium transition-all ${
                      quality === "eco"
                        ? "bg-gold text-base shadow-sm font-semibold"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    Data Saver
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. FRAME */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">
              FRAME
            </p>
            <div className="rounded-2xl border border-line bg-surface/60 divide-y divide-line text-xs">
              {/* Install FRAME (PWA) */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-cream font-medium">Install FRAME</p>
                  <p className="text-[11px] text-muted">
                    {isStandalone || installSuccess
                      ? "Installed as standalone app"
                      : canInstall
                      ? "Install to home screen for fullscreen experience"
                      : "Installable Web App (PWA)"}
                  </p>
                </div>
                {isStandalone || installSuccess ? (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-gold font-medium">
                    Installed ✓
                  </span>
                ) : canInstall ? (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-[10.5px] uppercase tracking-[0.14em] font-semibold text-gold transition-all hover:bg-gold hover:text-base active:scale-95"
                  >
                    Install →
                  </button>
                ) : (
                  <span className="text-[11px] text-muted/70">
                    Browser App
                  </span>
                )}
              </div>

              {/* Share FRAME */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-cream font-medium">Share FRAME</p>
                  <p className="text-[11px] text-muted">
                    {shareSuccess ? "Link copied to clipboard!" : "Share photography journal"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="rounded-full border border-white/15 bg-surface px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] text-cream transition-all hover:border-gold/40 hover:text-gold active:scale-95"
                >
                  {shareSuccess ? "Copied ✓" : "Share ↗"}
                </button>
              </div>

              {/* About FRAME */}
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface/80"
              >
                <div>
                  <p className="text-cream font-medium">About FRAME</p>
                  <p className="text-[11px] text-muted">Exhibition philosophy &amp; guestbook</p>
                </div>
                <span className="text-muted text-sm">→</span>
              </Link>

              {/* About Aryan */}
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface/80"
              >
                <div>
                  <p className="text-cream font-medium">About Aryan</p>
                  <p className="text-[11px] text-muted">Photographer profile &amp; journey</p>
                </div>
                <span className="text-muted text-sm">→</span>
              </Link>

              {/* Instagram Link */}
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface/80"
              >
                <div>
                  <p className="text-cream font-medium">Instagram</p>
                  <p className="text-[11px] text-muted">@aryan.on.cam</p>
                </div>
                <span className="text-muted text-xs">↗</span>
              </a>
            </div>
          </section>

          {/* 3. INFORMATION */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold">
              Information
            </p>
            <div className="rounded-2xl border border-line bg-surface/60 divide-y divide-line text-xs">
              {/* Privacy & Image Metadata */}
              <div className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedInfo(expandedInfo === "privacy" ? null : "privacy")
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-cream font-medium">Privacy &amp; Image Metadata</p>
                    <p className="text-[11px] text-muted">EXIF parameters and location transparency</p>
                  </div>
                  <span className="text-muted text-xs transition-transform duration-200">
                    {expandedInfo === "privacy" ? "▲" : "▼"}
                  </span>
                </button>
                {expandedInfo === "privacy" && (
                  <div className="mt-3 pt-3 border-t border-line text-[11px] leading-relaxed text-muted space-y-2">
                    <p>
                      Photographs presented in FRAME feature optical metadata (camera model, lens, aperture, shutter speed, and ISO) to celebrate the craft of manual photography.
                    </p>
                    <p>
                      Private device telemetry and GPS coordinates are stripped by default unless a broad location is deliberately curated for public storytelling. All publication decisions are managed privately in Studio.
                    </p>
                  </div>
                )}
              </div>

              {/* Credits */}
              <div className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedInfo(expandedInfo === "credits" ? null : "credits")
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-cream font-medium">Credits</p>
                    <p className="text-[11px] text-muted">Craft, typography &amp; technology</p>
                  </div>
                  <span className="text-muted text-xs transition-transform duration-200">
                    {expandedInfo === "credits" ? "▲" : "▼"}
                  </span>
                </button>
                {expandedInfo === "credits" && (
                  <div className="mt-3 pt-3 border-t border-line text-[11px] leading-relaxed text-muted space-y-1.5">
                    <p>
                      <strong className="text-cream">Photography:</strong> Aryan Pol
                    </p>
                    <p>
                      <strong className="text-cream">Typography:</strong> Bebas Neue, Inter, Playfair Display
                    </p>
                    <p>
                      <strong className="text-cream">Architecture:</strong> Next.js App Router, Supabase, Cloudinary, WebAuthn Passkeys
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. STUDIO (Visually separated private workspace) */}
          <section className="pt-2">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted">
                Private Workspace
              </span>
            </div>
            <Link
              href="/admin/login"
              onClick={onClose}
              className="group relative flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/[0.05] p-4 transition-all duration-300 hover:border-gold/60 hover:bg-gold/[0.12] hover:shadow-[0_0_25px_rgba(232,193,112,0.18)] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-surface shadow-inner text-gold transition-transform duration-300 group-hover:scale-105">
                  {/* Subtle Lock Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg tracking-[0.16em] text-cream group-hover:text-gold transition-colors">
                      Studio
                    </span>
                    <span className="rounded-full border border-gold/30 bg-gold/15 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.18em] font-medium text-gold">
                      Passkey
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted">
                    Private photographer workspace
                  </p>
                </div>
              </div>

              <span className="text-gold text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </section>
        </div>

        {/* 5. FOOTER */}
        <div className="mt-8 border-t border-line/60 pt-5 text-center">
          <p className="font-display text-sm tracking-[0.25em] text-cream">FRAME</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted/80">
            Notice more. Keep what matters.
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-muted/40 font-mono">
            v0.1.0
          </p>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
