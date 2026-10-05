import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const SYSTEM_PROMPT =
  "You are a photography caption writer for FRAME, an intimate editorial photography journal by Aryan Pol. " +
  "Analyze this photograph and write a concise, thoughtful, natural, first-person editorial caption in 2 to 3 sentences. " +
  "Tone: reflective, quiet, observant, like a personal journal entry. " +
  "Avoid generic stock descriptions, social media clichés, hashtags, emojis, or mentioning camera gear and technical settings. " +
  "Output only the caption text directly."

export async function POST(request: Request) {
  // 1. Verify user authentication via Supabase
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aryan.pol737@gmail.com"
  if (!user || user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Forbidden: Admin access required." }, { status: 403 })
  }

  // 2. Validate server-side GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || !apiKey.trim()) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  // 3. Parse and validate request body
  let body: { imageUrl?: string; imageBase64?: string; mimeType?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { imageUrl, imageBase64, mimeType } = body
  if (!imageUrl && !imageBase64) {
    return Response.json(
      { error: "Image input required (imageUrl or imageBase64)." },
      { status: 400 }
    )
  }

  // 4. Prepare image as multimodal base64 input
  let base64Data: string
  let detectedMimeType: string

  if (imageUrl) {
    try {
      new URL(imageUrl)
    } catch {
      return Response.json({ error: "Invalid image URL format." }, { status: 400 })
    }

    let imgRes: Response
    try {
      imgRes = await fetch(imageUrl)
    } catch {
      return Response.json(
        { error: "Unable to retrieve the image from the provided URL." },
        { status: 400 }
      )
    }

    if (!imgRes.ok) {
      return Response.json(
        { error: `Failed to download image (HTTP ${imgRes.status}).` },
        { status: 400 }
      )
    }

    const rawMime = imgRes.headers.get("content-type") || "image/jpeg"
    detectedMimeType = rawMime.split(";")[0].trim().toLowerCase()
    if (!detectedMimeType.startsWith("image/")) {
      detectedMimeType = "image/jpeg"
    }

    const buffer = await imgRes.arrayBuffer()
    if (buffer.byteLength === 0) {
      return Response.json({ error: "Retrieved image file is empty." }, { status: 400 })
    }
    base64Data = Buffer.from(buffer).toString("base64")
  } else {
    base64Data = (imageBase64 as string).replace(/^data:image\/[a-zA-Z+]+;base64,/, "")
    detectedMimeType = (mimeType || "image/jpeg").split(";")[0].trim().toLowerCase()
  }

  // 5. Call Google Gemini API with gemini-3.8-flash
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`

  const geminiPayload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: detectedMimeType,
              data: base64Data,
            },
          },
          {
            text: "Write a reflective, concise editorial caption for this photograph.",
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
    },
  }

  let geminiRes: Response
  try {
    geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiPayload),
    })
  } catch {
    return Response.json(
      { error: "Failed to connect to Google Gemini API." },
      { status: 502 }
    )
  }

  // 6. Handle Gemini error states (Rate limit, Auth, or upstream error)
  if (!geminiRes.ok) {
    if (geminiRes.status === 429) {
      return Response.json(
        { error: "Gemini API rate limit reached. Please try again in a moment." },
        { status: 429 }
      )
    }

    let detail = "Gemini API error"
    try {
      const errJson = await geminiRes.json()
      if (errJson.error?.message) {
        detail = errJson.error.message
      }
    } catch {
      // Fallback detail
    }

    return Response.json(
      { error: `Gemini API failure (${geminiRes.status}): ${detail}` },
      { status: geminiRes.status >= 500 ? 502 : 400 }
    )
  }

  // 7. Parse response and extract caption
  try {
    const data = await geminiRes.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return Response.json(
        { error: "Gemini returned an empty or invalid response." },
        { status: 502 }
      )
    }

    const caption = rawText.trim()

    // 8. Return clean JSON
    return Response.json({ caption }, { status: 200 })
  } catch {
    return Response.json(
      { error: "Failed to parse Gemini API response." },
      { status: 502 }
    )
  }
}
