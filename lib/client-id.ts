"use client"

export function getOrCreateClientId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = localStorage.getItem("frame_visitor_id")
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v_${Math.random().toString(36).slice(2)}_${Date.now()}`
      localStorage.setItem("frame_visitor_id", id)
    }
    return id
  } catch {
    return "anonymous_visitor"
  }
}
