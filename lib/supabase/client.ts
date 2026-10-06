"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Supabase Passkey API is currently experimental and must be opted into.
        experimental: { passkey: true },
      },
    }
  )
}
