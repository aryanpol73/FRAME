// Deno edge function. ANTHROPIC_API_KEY lives in Supabase secrets, never the client.

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void
  env: {
    get: (key: string) => string | undefined
  }
}

const SYSTEM_PROMPT =
  "You are a photography caption writer for a personal editorial blog called FRAME by Aryan Pol. Look at this photo and write a reflective, first-person caption in 2-4 sentences. Tone: thoughtful and personal, like a journal entry. Not generic. Not social media. Do not mention camera gear. Do not use hashtags. Start directly with the caption."

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS })
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS })
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY")
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500, headers: CORS })
  }

  let imageUrl: string
  try {
    ;({ imageUrl } = await req.json())
  } catch {
    return new Response("Invalid JSON body", { status: 400, headers: CORS })
  }

  if (!imageUrl) {
    return new Response("imageUrl required", { status: 400, headers: CORS })
  }

  const anthropic = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: imageUrl } },
            { type: "text", text: "Write the caption for this photograph." },
          ],
        },
      ],
    }),
  })

  if (!anthropic.ok || !anthropic.body) {
    return new Response(await anthropic.text(), {
      status: anthropic.status,
      headers: CORS,
    })
  }

  // Convert Anthropic's SSE into a plain-text delta stream.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        if (!line.startsWith("data:")) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === "[DONE]") continue
        try {
          const event = JSON.parse(payload)
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        } catch {
          // Ignore partial or non-JSON keepalive lines.
        }
      }
    },
  })

  return new Response(anthropic.body.pipeThrough(transform), {
    headers: {
      ...CORS,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
})
