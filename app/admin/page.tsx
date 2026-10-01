import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { cldUrl } from "@/lib/cloudinary"
import {
  togglePublish,
  deletePhoto,
  createSeries,
  deleteSeries,
} from "./actions"

export default async function Dashboard() {
  const supabase = await createClient()

  const [{ data: photos }, { data: series }] = await Promise.all([
    supabase.from("photos").select("*").order("created_at", { ascending: false }),
    supabase.from("series").select("*").order("created_at"),
  ])

  const list = photos ?? []
  const stats = [
    { label: "Total photos", value: list.length },
    { label: "Published", value: list.filter((p) => p.published).length },
    { label: "Series", value: (series ?? []).length },
  ]

  return (
    <div className="space-y-14">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-cream" style={{ fontSize: 56 }}>
          Dashboard
        </h1>
        <Link
          href="/admin/upload"
          className="border border-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-base"
        >
          Upload photo
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-surface p-6">
            <p className="font-display text-cream" style={{ fontSize: 44 }}>
              {s.value}
            </p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-5 text-[11px] uppercase tracking-[0.2em] text-muted">
          Photographs
        </h2>

        {list.length === 0 ? (
          <p className="text-sm text-muted">Nothing uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-line border border-line">
            {list.map((p) => (
              <li key={p.id} className="flex items-center gap-5 p-4">
                <img
                  src={cldUrl(p.cloudinary_url, { width: 160, height: 120, crop: "fill" })}
                  alt=""
                  className="h-16 w-20 shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cream">
                    {p.title ?? "Untitled"}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {p.series ?? "No series"} · /{p.slug}
                  </p>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-[0.15em] ${
                    p.published ? "text-gold" : "text-muted"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>

                <form action={togglePublish.bind(null, p.id, !p.published)}>
                  <button className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-cream hover:border-gold">
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                </form>

                <Link
                  href={`/work/${p.slug}`}
                  className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-cream hover:border-gold"
                >
                  View
                </Link>

                <form action={deletePhoto.bind(null, p.id)}>
                  <button className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-sienna hover:border-sienna">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-[11px] uppercase tracking-[0.2em] text-muted">
          Series
        </h2>

        <form action={createSeries} className="mb-5 flex flex-wrap gap-3">
          <input
            name="name"
            required
            placeholder="Series name"
            className="border border-line bg-surface px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="flex-1 border border-line bg-surface px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <button className="border border-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-base">
            Add
          </button>
        </form>

        <ul className="divide-y divide-line border border-line">
          {(series ?? []).map((s) => (
            <li key={s.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-cream">{s.name}</p>
                <p className="text-xs text-muted">/series/{s.slug}</p>
              </div>
              <form action={deleteSeries.bind(null, s.id)}>
                <button className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-sienna hover:border-sienna">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
