import { v2 as cloudinary } from "cloudinary"

/**
 * Server-only Cloudinary client configuration.
 *
 * IMPORTANT:
 * - Uses SERVER-ONLY environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).
 * - Never import this file into client components or files marked with 'use client'.
 * - Never expose CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET to the browser.
 */

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

export type DeleteAssetResult = {
  success: boolean
  error?: string
  result?: string
}

/**
 * Deletes a photo asset from Cloudinary using Cloudinary's authenticated server-side API.
 *
 * Handling:
 * - If asset does not exist ("not found"), treats it as successfully cleaned up.
 * - If credentials are missing or API fails, returns an error without exposing secrets.
 */
export async function deleteCloudinaryAsset(
  publicId: string
): Promise<DeleteAssetResult> {
  if (!publicId || publicId.trim() === "") {
    return { success: true, result: "no_public_id" }
  }

  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      "[Cloudinary Server] Missing server-side credentials. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be configured."
    )
    return {
      success: false,
      error:
        "Cloudinary server credentials missing. Deletion aborted to prevent orphaned records.",
    }
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })

    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    })

    // Cloudinary returns { result: "ok" } or { result: "not found" }
    // If "not found", the asset is already missing, so cleanup is considered complete.
    if (response.result === "ok" || response.result === "not found") {
      return {
        success: true,
        result: response.result,
      }
    }

    console.error("[Cloudinary Server] Unexpected destroy response:", response)
    return {
      success: false,
      error: "Cloudinary returned an unsuccessful status during deletion.",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[Cloudinary Server] Deletion error:", message)
    return {
      success: false,
      error: "Failed to delete asset from Cloudinary storage.",
    }
  }
}

export type VerifyAssetResult = {
  valid: boolean
  error?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

/**
 * Server-side validation of a Cloudinary asset:
 * - Confirms the asset exists in Cloudinary.
 * - Verifies resource_type is "image".
 * - Verifies format is one of JPEG, PNG, WebP, HEIC/HEIF, AVIF.
 * - Verifies size <= 50 MB (50 * 1024 * 1024 = 52,428,800 bytes).
 * - Verifies dimensions (width > 0, height > 0).
 */
export async function verifyCloudinaryAsset(
  publicId: string
): Promise<VerifyAssetResult> {
  if (!publicId || publicId.trim() === "") {
    return { valid: false, error: "Missing Cloudinary public ID." }
  }

  // If server API credentials are not yet configured, allow graceful passthrough
  // but log a warning.
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "[Cloudinary Server] API credentials not set; skipping remote resource inspection."
    )
    return { valid: true }
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })

    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    })

    if (!resource || resource.resource_type !== "image") {
      return { valid: false, error: "The uploaded file is not a valid image." }
    }

    const format = String(resource.format || "").toLowerCase()
    const ALLOWED_FORMATS = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "heic",
      "heif",
      "avif",
    ]

    if (!ALLOWED_FORMATS.includes(format)) {
      return {
        valid: false,
        error: `Unsupported image format (${format}). Allowed formats: JPEG, PNG, WebP, HEIC, and AVIF.`,
      }
    }

    const MAX_BYTES = 50 * 1024 * 1024 // 52,428,800 bytes
    if (resource.bytes && resource.bytes > MAX_BYTES) {
      return {
        valid: false,
        error: `File size (${(resource.bytes / (1024 * 1024)).toFixed(1)} MB) exceeds the 50 MB limit.`,
      }
    }

    const width = Number(resource.width)
    const height = Number(resource.height)
    if (!width || !height || width <= 0 || height <= 0) {
      return { valid: false, error: "Image dimensions are invalid or corrupted." }
    }

    return {
      valid: true,
      width,
      height,
      format,
      bytes: resource.bytes,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[Cloudinary Server] verifyCloudinaryAsset error:", message)
    return {
      valid: false,
      error: "Unable to verify photograph with Cloudinary storage.",
    }
  }
}

