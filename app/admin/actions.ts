"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/exif"

async function requireUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/admin/login")
  return supabase
}

export async function createPhoto(input: {
  title: string
  caption: string
  series: string
  newSeries: string
  published: boolean
  location: string
  shotAt: string | null
  publicId: string
  url: string
}) {
  const supabase = await requireUser()

  const seriesName = input.newSeries.trim() || input.series.trim() || null

  if (input.newSeries.trim()) {
    await supabase.from("series").upsert(
      { name: seriesName!, slug: slugify(seriesName!) },
      { onConflict: "name" }
    )
  }

  const base = slugify(input.title || "untitled")
  const slug = `${base}-${Date.now().toString(36).slice(-4)}`

  const { error } = await supabase.from("photos").insert({
    slug,
    title: input.title || null,
    caption: input.caption || null,
    cloudinary_public_id: input.publicId,
    cloudinary_url: input.url,
    series: seriesName,
    exif_location: input.location || null,
    exif_shot_at: input.shotAt,
    published: input.published,
  })

  if (error) return { error: error.message }

  revalidatePath("/")
  revalidatePath("/admin")
  return { error: null }
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await requireUser()
  await supabase
    .from("photos")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/")
}

export async function deletePhoto(id: string) {
  const supabase = await requireUser()
  await supabase.from("photos").delete().eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/")
}

export async function updatePhoto(id: string, formData: FormData) {
  const supabase = await requireUser()
  await supabase
    .from("photos")
    .update({
      title: String(formData.get("title") || "") || null,
      caption: String(formData.get("caption") || "") || null,
      series: String(formData.get("series") || "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/")
}

export async function createSeries(formData: FormData) {
  const supabase = await requireUser()
  const name = String(formData.get("name") || "").trim()
  if (!name) return
  await supabase.from("series").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") || "") || null,
  })
  revalidatePath("/admin")
}

export async function deleteSeries(id: string) {
  const supabase = await requireUser()
  await supabase.from("series").delete().eq("id", id)
  revalidatePath("/admin")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
