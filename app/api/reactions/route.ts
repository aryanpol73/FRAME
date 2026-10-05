import { createClient } from "@/lib/supabase/server"
import type { ReactionType } from "@/lib/supabase/types"

const VALID_REACTIONS: ReactionType[] = [
  "appreciate",
  "beautiful",
  "peaceful",
  "caught_my_eye",
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const photoId = searchParams.get("photoId")
  const clientId = searchParams.get("clientId")

  if (!photoId) {
    return Response.json({ error: "photoId is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: rows, error } = await supabase
    .from("photo_reactions")
    .select("reaction_type, client_id")
    .eq("photo_id", photoId)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const counts: Record<ReactionType, number> = {
    appreciate: 0,
    beautiful: 0,
    peaceful: 0,
    caught_my_eye: 0,
  }

  let userReaction: ReactionType | null = null

  for (const r of rows ?? []) {
    const type = r.reaction_type as ReactionType
    if (counts[type] !== undefined) {
      counts[type]++
    }
    if (clientId && r.client_id === clientId) {
      userReaction = type
    }
  }

  return Response.json({ counts, userReaction })
}

export async function POST(request: Request) {
  let body: { photoId?: string; reactionType?: string; clientId?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { photoId, reactionType, clientId } = body
  if (!photoId || !reactionType || !clientId) {
    return Response.json(
      { error: "photoId, reactionType, and clientId are required" },
      { status: 400 }
    )
  }

  if (!VALID_REACTIONS.includes(reactionType as ReactionType)) {
    return Response.json({ error: "Invalid reaction type" }, { status: 400 })
  }

  const supabase = await createClient()

  // Check if visitor already reacted to this photo
  const { data: existing } = await supabase
    .from("photo_reactions")
    .select("id, reaction_type")
    .eq("photo_id", photoId)
    .eq("client_id", clientId)
    .maybeSingle()

  if (existing) {
    if (existing.reaction_type === reactionType) {
      // Toggle off
      await supabase
        .from("photo_reactions")
        .delete()
        .eq("id", existing.id)
    } else {
      // Switch reaction
      await supabase
        .from("photo_reactions")
        .update({ reaction_type: reactionType as ReactionType })
        .eq("id", existing.id)
    }
  } else {
    // New reaction
    await supabase.from("photo_reactions").insert({
      photo_id: photoId,
      reaction_type: reactionType as ReactionType,
      client_id: clientId,
    })
  }

  // Return fresh counts
  const { data: updatedRows } = await supabase
    .from("photo_reactions")
    .select("reaction_type, client_id")
    .eq("photo_id", photoId)

  const counts: Record<ReactionType, number> = {
    appreciate: 0,
    beautiful: 0,
    peaceful: 0,
    caught_my_eye: 0,
  }

  let finalUserReaction: ReactionType | null = null

  for (const r of updatedRows ?? []) {
    const type = r.reaction_type as ReactionType
    if (counts[type] !== undefined) {
      counts[type]++
    }
    if (r.client_id === clientId) {
      finalUserReaction = type
    }
  }

  return Response.json({ counts, userReaction: finalUserReaction })
}
