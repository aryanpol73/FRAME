import exifr from "exifr"

export type ExifData = {
  location: string
  date: string // yyyy-mm-dd
  time: string // HH:mm
  shotAt: string | null // ISO
}

const EMPTY: ExifData = { location: "", date: "", time: "", shotAt: null }

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const coordFallback = `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)
    if (!res.ok) return coordFallback
    const data = await res.json()
    const parts = [
      data.locality || data.city || data.principalSubdivision,
      data.countryName,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : coordFallback
  } catch {
    return coordFallback
  }
}

export async function readExif(file: File): Promise<ExifData> {
  try {
    const data = await exifr.parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      pick: ["DateTimeOriginal", "CreateDate", "latitude", "longitude"],
    })
    if (!data) return EMPTY

    const taken: Date | undefined = data.DateTimeOriginal ?? data.CreateDate
    const location =
      typeof data.latitude === "number" && typeof data.longitude === "number"
        ? await reverseGeocode(data.latitude, data.longitude)
        : ""

    if (!taken) return { ...EMPTY, location }

    const pad = (n: number) => String(n).padStart(2, "0")
    return {
      location,
      date: `${taken.getFullYear()}-${pad(taken.getMonth() + 1)}-${pad(taken.getDate())}`,
      time: `${pad(taken.getHours())}:${pad(taken.getMinutes())}`,
      shotAt: taken.toISOString(),
    }
  } catch {
    return EMPTY
  }
}

export function formatExifDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatExifTime(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
