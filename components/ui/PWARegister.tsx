"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    __pwaPrompt?: any
  }
}

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault()
        window.__pwaPrompt = e
        window.dispatchEvent(new Event("pwa-prompt-available"))
      })

      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .catch((err) => {
              console.warn("PWA Service Worker registration failed: ", err)
            })
        })
      }
    }
  }, [])

  return null
}
