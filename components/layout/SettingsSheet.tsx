"use client"

import { useEffect } from "react"
import Link from "next/link"
import { INSTAGRAM } from "./nav"

export default function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in"
    >
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Sheet / Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-t-[32px] sm:rounded-[28px] border border-white/[0.1] bg-[#120f0d]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[90vh] overflow-y-auto">
        {/* Drag handle pill on mobile */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-2xl tracking-[0.14em] text-cream">
              SETTINGS
            </h2>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">
              FRAME · Photography Journal
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

        {/* Content sections */}
        <div className="mt-6 space-y-6">
          {/* Studio Entry Point */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-2.5">
              Private Access
            </p>
            <Link
              href="/admin/login"
              onClick={onClose}
              className="group relative flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 transition-all duration-300 hover:border-gold/60 hover:bg-gold/[0.12] hover:shadow-[0_0_25px_rgba(232,193,112,0.18)] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-surface shadow-inner text-gold transition-transform duration-300 group-hover:rotate-45">
                  {/* Aperture / Studio Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                    <line x1="9.69" y1="8" x2="21.17" y2="8" />
                    <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                    <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                    <line x1="14.31" y1="16" x2="2.83" y2="16" />
                    <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
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
                    Private curation, photograph management &amp; security
                  </p>
                </div>
              </div>

              <span className="text-gold text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Portfolio & Device Details */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-2.5">
              Portfolio &amp; Display
            </p>
            <div className="divide-y divide-line rounded-2xl border border-line bg-surface/60 text-xs">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted">Aesthetic Theme</span>
                <span className="font-medium text-cream">OLED Dark · Editorial Gold</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted">App Experience</span>
                <span className="font-medium text-cream">Installable PWA</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-muted">Artist</span>
                <span className="font-medium text-cream">Aryan Pol</span>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-2.5">
              Connect
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-line bg-surface/60 px-4 py-3 text-xs text-muted transition-all duration-200 hover:border-gold/30 hover:text-gold active:scale-95"
            >
              <span>Follow on Instagram (@aryan.on.cam)</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted/60">
          FRAME · Keep What Matters
        </p>
      </div>
    </div>
  )
}
