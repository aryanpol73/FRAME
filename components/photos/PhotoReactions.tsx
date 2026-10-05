"use client"

import { useEffect, useState } from "react"
import { getOrCreateClientId } from "@/lib/client-id"
import type { ReactionType } from "@/lib/supabase/types"

const REACTIONS: { type: ReactionType; icon: string; label: string }[] = [
  { type: "appreciate", icon: "♡", label: "Appreciate" },
  { type: "beautiful", icon: "✦", label: "Beautiful" },
  { type: "peaceful", icon: "◌", label: "Peaceful" },
  { type: "caught_my_eye", icon: "◎", label: "Caught my eye" },
]

export default function PhotoReactions({
  photoId,
  compact = false,
}: {
  photoId: string
  compact?: boolean
}) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({
    appreciate: 0,
    beautiful: 0,
    peaceful: 0,
    caught_my_eye: 0,
  })
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const clientId = getOrCreateClientId()
    fetch(`/api/reactions?photoId=${photoId}&clientId=${clientId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.counts) setCounts(data.counts)
        if (data?.userReaction) setUserReaction(data.userReaction)
      })
      .catch(() => {})
  }, [photoId])

  const toggle = async (type: ReactionType) => {
    if (loading) return
    const clientId = getOrCreateClientId()
    const isRemoving = userReaction === type
    const prevType = userReaction

    // Optimistic UI update
    setUserReaction(isRemoving ? null : type)
    setCounts((prev) => {
      const next = { ...prev }
      if (isRemoving) {
        next[type] = Math.max(0, (next[type] || 0) - 1)
      } else {
        if (prevType) {
          next[prevType] = Math.max(0, (next[prevType] || 0) - 1)
        }
        next[type] = (next[type] || 0) + 1
      }
      return next
    })

    setLoading(true)
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, reactionType: type, clientId }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.counts) setCounts(data.counts)
        setUserReaction(data?.userReaction ?? null)
      }
    } catch {
      // Revert on error
      setUserReaction(prevType)
    } finally {
      setLoading(false)
    }
  }

  // Compact mode: Simple elegant Appreciate heart with total count
  if (compact) {
    const isAppreciated = userReaction === "appreciate"
    const totalAppreciate = counts.appreciate

    return (
      <button
        type="button"
        data-cursor="link"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggle("appreciate")
        }}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] backdrop-blur-md transition-all duration-300 active:scale-90 ${
          isAppreciated
            ? "border border-gold/40 bg-gold/15 text-gold shadow-[0_0_12px_rgba(232,193,112,0.2)]"
            : "border border-white/10 bg-surface/80 text-muted hover:border-gold/30 hover:text-cream"
        }`}
      >
        <span className={isAppreciated ? "text-gold" : "text-cream/70"}>
          {isAppreciated ? "♥" : "♡"}
        </span>
        {totalAppreciate > 0 && <span>{totalAppreciate}</span>}
      </button>
    )
  }

  // Full editorial capsule dock with all 4 reactions
  return (
    <div className="flex flex-wrap items-center gap-2">
      {REACTIONS.map((item) => {
        const active = userReaction === item.type
        const count = counts[item.type] || 0

        return (
          <button
            key={item.type}
            type="button"
            data-cursor="link"
            onClick={() => toggle(item.type)}
            className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 ease-out active:scale-90 ${
              active
                ? "border border-gold/40 bg-gold/15 text-gold shadow-[0_0_14px_rgba(232,193,112,0.25)] font-semibold"
                : "border border-white/[0.08] bg-surface/70 text-muted backdrop-blur-md hover:border-white/20 hover:bg-surface/90 hover:text-cream hover:scale-105"
            }`}
          >
            <span
              className={`text-sm transition-transform duration-300 group-hover:scale-125 ${
                active ? "text-gold scale-110" : "text-muted group-hover:text-cream"
              }`}
            >
              {active && item.type === "appreciate" ? "♥" : item.icon}
            </span>
            <span>{item.label}</span>
            {count > 0 && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9.5px] tabular-nums font-mono ${
                  active
                    ? "bg-gold/25 text-gold"
                    : "bg-white/[0.06] text-muted/80 group-hover:text-cream"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
