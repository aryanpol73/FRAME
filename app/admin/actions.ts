"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/exif"
import {
  deleteCloudinaryAsset,
  verifyCloudinaryAsset,
} from "@/lib/cloudinary-server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aryan.pol737@gmail.com"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/admin/login?error=unauthorized")
  }

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
  const supabase = await requireAdmin()

  // 1. Server-side validation of Cloudinary asset (verifies actual image, supported format, <=50MB, dimensions)
  if (input.publicId) {
    const verification = await verifyCloudinaryAsset(input.publicId)
    if (!verification.valid) {
      // Clean up invalid asset immediately from Cloudinary
      await deleteCloudinaryAsset(input.publicId).catch((err) => {
        console.error("Cleanup of invalid Cloudinary asset failed:", err)
      })
      return {
        error:
          verification.error ||
          "Uploaded file failed server-side image validation. Asset was removed.",
      }
    }
  }

  // 2. Prepare series and slug
  const seriesName = input.newSeries.trim() || input.series.trim() || null

  if (input.newSeries.trim()) {
    await supabase.from("series").upsert(
      { name: seriesName!, slug: slugify(seriesName!) },
      { onConflict: "name" }
    )
  }

  const base = slugify(input.title || "untitled")
  const slug = `${base}-${Date.now().toString(36).slice(-4)}`

  // 3. Insert into Supabase
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

  // 4. Rollback handling: If database insert fails, remove the newly uploaded Cloudinary asset
  if (error) {
    console.error("Database insert failed. Rolling back Cloudinary asset:", input.publicId)
    if (input.publicId) {
      await deleteCloudinaryAsset(input.publicId).catch((delErr) => {
        console.error("Rollback Cloudinary asset deletion failed:", delErr)
      })
    }
    return {
      error: `Failed to save photograph: ${error.message}. Uploaded file was rolled back.`,
    }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { error: null }
}

export async function togglePublish(id: string, published: boolean) {
  const supabase = await requireAdmin()
  await supabase
    .from("photos")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/")
}

export async function deletePhoto(id: string) {
  const supabase = await requireAdmin()

  // 1. Fetch photo record and its cloudinary_public_id
  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("id, title, cloudinary_public_id")
    .eq("id", id)
    .single()

  if (fetchError || !photo) {
    redirect("/admin?error=" + encodeURIComponent("Photograph record not found."))
  }

  // 2. If a Cloudinary public ID exists, delete the asset using authenticated Cloudinary API
  if (photo.cloudinary_public_id) {
    const cldRes = await deleteCloudinaryAsset(photo.cloudinary_public_id)
    if (!cldRes.success) {
      // Do NOT delete the Supabase record if Cloudinary deletion failed
      redirect(
        "/admin?error=" +
          encodeURIComponent(
            cldRes.error ||
              "Failed to delete Cloudinary asset. Database record was not deleted."
          )
      )
    }
  }

  // 3. Only after successful Cloudinary deletion, delete the corresponding Supabase photo record
  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id)

  if (deleteError) {
    redirect(
      "/admin?error=" +
        encodeURIComponent("Failed to delete database record: " + deleteError.message)
    )
  }

  revalidatePath("/admin")
  revalidatePath("/")
  redirect(
    "/admin?message=" +
      encodeURIComponent("Photograph and Cloudinary asset deleted successfully.")
  )
}

export async function updatePhoto(id: string, formData: FormData) {
  const supabase = await requireAdmin()
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
  const supabase = await requireAdmin()
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
  const supabase = await requireAdmin()
  await supabase.from("series").delete().eq("id", id)
  revalidatePath("/admin")
}

export async function approveGuestbookEntry(id: string) {
  const supabase = await requireAdmin()
  await supabase
    .from("guestbook_entries")
    .update({ approved: true })
    .eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/about")
}

export async function hideGuestbookEntry(id: string) {
  const supabase = await requireAdmin()
  await supabase
    .from("guestbook_entries")
    .update({ approved: false })
    .eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/about")
}

export async function deleteGuestbookEntry(id: string) {
  const supabase = await requireAdmin()
  await supabase.from("guestbook_entries").delete().eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/about")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
