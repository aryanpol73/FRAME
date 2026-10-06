const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

type Transform = {
  width?: number
  height?: number
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb"
  quality?: string | number
  dpr?: string | number | "auto"
}

function getClientQuality(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("frame-quality")
      if (saved === "high") return "auto:best"
      if (saved === "eco") return "auto:eco"
    } catch {
      // Ignore storage errors
    }
  }
  return "auto"
}

export function cldUrl(src: string, t: Transform = {}) {
  if (!src) return ""
  const quality = t.quality ?? getClientQuality()
  const parts = [
    "f_auto",
    `q_${quality}`,
    `dpr_${t.dpr ?? "auto"}`,
    t.width && `w_${t.width}`,
    t.height && `h_${t.height}`,
    t.crop && `c_${t.crop}`,
  ].filter(Boolean).join(",")

  // Works whether we store a full URL or a bare public_id.
  if (src.includes("/upload/")) {
    return src.replace("/upload/", `/upload/${parts}/`)
  }
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${parts}/${src}`
}

export type UploadResult = {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  if (!CLOUD || !PRESET) {
    throw new Error("Cloudinary env vars missing.")
  }

  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", PRESET)

  // XHR rather than fetch, because fetch has no upload progress event.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status < 300) resolve(JSON.parse(xhr.responseText))
      else reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`))
    }
    xhr.onerror = () => reject(new Error("Cloudinary network error"))
    xhr.send(form)
  })
}
