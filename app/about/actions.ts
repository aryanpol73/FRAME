"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function submitGuestbookThought(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const message = String(formData.get("message") || "").trim()

  if (!name || name.length > 60) {
    return { error: "Please enter your name or an initial (up to 60 characters)." }
  }

  if (!message || message.length < 3 || message.length > 600) {
    return { error: "Please write a thought between 3 and 600 characters." }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("guestbook_entries").insert({
    name,
    message,
    approved: false,
  })

  if (error) {
    return { error: error.message || "Failed to submit. Please try again." }
  }

  revalidatePath("/about")
  revalidatePath("/admin")

  return {
    success: true,
    message: "Thank you for leaving something behind. Your note will appear once reviewed.",
  }
}
