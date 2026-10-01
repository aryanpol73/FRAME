"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UploadZone from "@/components/admin/UploadZone"
import ExifReader from "@/components/admin/ExifReader"
import CaptionGenerator from "@/components/admin/CaptionGenerator"
import { uploadToCloudinary, type UploadResult } from "@/lib/cloudinary"
import { createClient } from "@/lib/supabase/client"
import { createPhoto } from "../actions"
import type { ExifData } from "@/lib/exif"

const EMPTY_EXIF: ExifData = { location: "", date: "", time: "", shotAt: null }

export default function UploadPage() {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [uploaded, setUploaded] = useState<UploadResult | null>(null)
  const [progress, setProgress] = useState(0)

  const [exif, setExif] = useState<ExifData>(EMPTY_EXIF)
  const [caption, setCaption] = useState("")
  const [title, setTitle] = useState("")
  const [series, setSeries] = useState("")
  const [newSeries, setNewSeries] = useState("")
  const [published, setPublished] = useState(false)

  const [options, setOptions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    createClient()
      .from("series")
      .select("name")
      .then(({ data }) => setOptions((data ?? []).map((s) => s.name)))
  }, [])

  // Upload to Cloudinary immediately, so the AI has a real URL to read.
  async function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError("")
    try {
      const result = await uploadToCloudinary(f, setProgress)
      setUploaded(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.")
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!uploaded) return setError("Wait for the image upload to finish.")

    setSaving(true)
    const res = await createPhoto({
      title,
      caption,
      series,
      newSeries,
      published,
      location: exif.location,
      shotAt: exif.shotAt,
      publicId: uploaded.public_id,
      url: uploaded.secure_url,
    })
    setSaving(false)

    if (res?.error) setError(res.error)
    else router.push("/admin")
  }

  const displaySrc = uploaded?.secure_url || preview

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-10 font-display text-cream" style={{ fontSize: 56 }}>
        New photograph
      </h1>

      {!file ? (
        <UploadZone onFile={handleFile} />
      ) : (
        <form onSubmit={submit} className="space-y-10">
          <div className="relative overflow-hidden border border-line">
            <img src={displaySrc} alt="" className="max-h-[420px] w-full object-cover" />
            {!uploaded && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-line">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <ExifReader file={file} value={exif} onChange={setExif} />

          <CaptionGenerator
            imageUrl={uploaded?.secure_url ?? null}
            value={caption}
            onChange={setCaption}
          />

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none focus:border-gold"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">
                Series
              </span>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none focus:border-gold"
              >
                <option value="">None</option>
                {options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">
                Or new series
              </span>
              <input
                value={newSeries}
                onChange={(e) => setNewSeries(e.target.value)}
                className="w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none focus:border-gold"
              />
            </label>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#E8C170]"
            />
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Publish immediately
            </span>
          </label>

          {error && <p className="text-xs text-sienna">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !uploaded}
              className="border border-gold px-6 py-3 text-[11px] uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-base disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save photograph"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setUploaded(null)
                setPreview("")
                setExif(EMPTY_EXIF)
                setCaption("")
              }}
              className="border border-line px-6 py-3 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-cream"
            >
              Start over
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
