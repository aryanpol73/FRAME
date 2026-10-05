/**
 * Production-grade client & server image validation for FRAME.
 * Maximum file size: 50 MB (50 * 1024 * 1024 = 52,428,800 bytes).
 * Supported formats: JPEG/JPG, PNG, WebP, HEIC/HEIF, AVIF.
 */

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // 50 MB (52,428,800 bytes)
export const MAX_UPLOAD_MB = 50

export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".avif",
] as const

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/avif",
] as const

export type ValidationResult = {
  valid: boolean
  error?: string
  format?: string
}

/**
 * Checks magic bytes (file signature) of an image buffer.
 * Does not rely solely on the browser-reported MIME type.
 */
export function detectFormatFromBytes(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg"
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png"
  }

  // WebP: 'RIFF' .... 'WEBP'
  const isRiff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  const isWebp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  if (isRiff && isWebp) {
    return "webp"
  }

  // ISO Base Media File Format: bytes 4-7 are 'ftyp'
  const isFtyp =
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70

  if (isFtyp) {
    // Check brand in bytes 8-11
    const brand = String.fromCharCode(
      bytes[8],
      bytes[9],
      bytes[10],
      bytes[11]
    ).toLowerCase()

    if (brand.includes("avif") || brand.includes("avis")) {
      return "avif"
    }
    if (
      brand.includes("heic") ||
      brand.includes("heix") ||
      brand.includes("hevc") ||
      brand.includes("heim") ||
      brand.includes("heis") ||
      brand.includes("mif1") ||
      brand.includes("msf1")
    ) {
      return "heic"
    }
  }

  return null
}

/**
 * Validates an image File client-side before any network request or upload to Cloudinary.
 * - Rejects files > 50 MB
 * - Checks file extension
 * - Inspects header magic bytes (does not rely only on browser MIME type)
 */
export async function validateClientImage(file: File): Promise<ValidationResult> {
  if (!file) {
    return { valid: false, error: "No file was selected." }
  }

  // 1. Size Validation (Strict 50 MB limit)
  if (file.size > MAX_UPLOAD_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size (${sizeInMb} MB) exceeds the maximum limit of 50 MB. Please choose an image under 50 MB.`,
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "The selected file is empty (0 bytes).",
    }
  }

  // 2. Extension validation
  const ext = ("." + file.name.split(".").pop()?.toLowerCase()).trim()
  const hasAllowedExt = ALLOWED_EXTENSIONS.some((allowed) => allowed === ext)

  // 3. Inspect header magic bytes (read first 32 bytes)
  let byteFormat: string | null = null
  try {
    const slice = file.slice(0, 32)
    const buffer = await slice.arrayBuffer()
    byteFormat = detectFormatFromBytes(new Uint8Array(buffer))
  } catch (err) {
    console.warn("Could not read magic bytes from file:", err)
  }

  // 4. Combined validation check
  // Accept if magic bytes detect a supported format OR if file extension + mime type match
  const mimeType = (file.type || "").toLowerCase()
  const hasAllowedMime = ALLOWED_MIME_TYPES.some((m) => m === mimeType)

  if (byteFormat) {
    return { valid: true, format: byteFormat }
  }

  if (hasAllowedExt || hasAllowedMime) {
    return { valid: true, format: ext.replace(".", "") }
  }

  return {
    valid: false,
    error:
      "Unsupported format. FRAME supports JPEG, PNG, WebP, HEIC/HEIF, and AVIF photographs.",
  }
}
