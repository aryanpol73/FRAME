import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { cldUrl } from "@/lib/cloudinary"
import {
  togglePublish,
  deletePhoto,
  createSeries,
  deleteSeries,
  approveGuestbookEntry,
  hideGuestbookEntry,
  deleteGuestbookEntry,
} from "./actions"

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const [{ data: photos }, { data: series }, { data: guestbook }] =
    await Promise.all([
      supabase.from("photos").select("*").order("created_at", { ascending: false }),
      supabase.from("series").select("*").order("created_at"),
      supabase
        .from("guestbook_entries")
        .select("*")
        .order("created_at", { ascending: false }),
    ])

  const list = photos ?? []
  const guestbookList = guestbook ?? []
  const pendingCount = guestbookList.filter((g) => !g.approved).length

  const stats = [
    { label: "Total photos", value: list.length },
    { label: "Published", value: list.filter((p) => p.published).length },
    { label: "Series", value: (series ?? []).length },
    { label: "Guestbook thoughts", value: guestbookList.length, highlight: pendingCount > 0 ? `${pendingCount} pending` : undefined },
  ]

  return (
    <div className="space-y-16">
      {/* Operation Status Banners */}
      {params?.error && (
        <div className="flex items-center justify-between rounded-2xl border border-sienna/40 bg-sienna/10 px-5 py-3.5 text-xs text-sienna font-medium">
          <span>{params.error}</span>
          <Link
            href="/admin"
            className="ml-4 text-sienna/70 hover:text-sienna"
          >
            ✕
          </Link>
        </div>
      )}
      {params?.message && (
        <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3.5 text-xs text-gold font-medium">
          <span>{params.message}</span>
          <Link
            href="/admin"
            className="ml-4 text-gold/70 hover:text-gold"
          >
            ✕
          </Link>
        </div>
      )}

      {/* Header with Modern Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="font-display text-cream" style={{ fontSize: 56 }}>
            Dashboard
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
            Portfolio Administration & Moderation
          </p>
        </div>

        <Link
          href="/admin/upload"
          data-cursor="link"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold text-gold shadow-[0_0_15px_rgba(232,193,112,0.18)] transition-all duration-300 hover:border-gold hover:bg-gold hover:text-base hover:shadow-[0_0_22px_rgba(232,193,112,0.35)] active:scale-95 w-fit"
        >
          <span>+ Upload photo</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-line hover:bg-surface"
          >
            <div className="flex items-baseline justify-between">
              <p className="font-display text-cream" style={{ fontSize: 44 }}>
                {s.value}
              </p>
              {s.highlight && (
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-gold animate-pulse">
                  {s.highlight}
                </span>
              )}
            </div>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.16em] text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Photographs Section */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Photographs ({list.length})
          </h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80">
            Archive Manager
          </span>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-sm text-muted">Nothing uploaded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line/60 rounded-2xl border border-line bg-surface/40 overflow-hidden">
            {list.map((p) => (
              <li
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                    <img
                      src={cldUrl(p.cloudinary_url, { width: 160, height: 120, crop: "fill" })}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cream">
                      {p.title ?? "Untitled"}
                    </p>
                    <p className="truncate text-xs text-muted mt-0.5">
                      {p.series ?? "No series"} · /{p.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9.5px] uppercase tracking-[0.15em] font-mono ${
                      p.published
                        ? "border border-gold/30 bg-gold/10 text-gold"
                        : "border border-white/10 bg-white/5 text-muted"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>

                  <form action={togglePublish.bind(null, p.id, !p.published)}>
                    <button
                      type="submit"
                      data-cursor="link"
                      className="rounded-full border border-white/10 bg-surface/70 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-cream transition-all duration-300 hover:border-gold/40 hover:text-gold active:scale-90"
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>

                  <Link
                    href={`/work/${p.slug}`}
                    data-cursor="link"
                    className="rounded-full border border-white/10 bg-surface/70 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-cream transition-all duration-300 hover:border-white/30 hover:bg-surface active:scale-90"
                  >
                    View
                  </Link>

                  <form action={deletePhoto.bind(null, p.id)}>
                    <button
                      type="submit"
                      data-cursor="link"
                      className="rounded-full border border-sienna/30 bg-sienna/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-sienna transition-all duration-300 hover:border-sienna hover:bg-sienna hover:text-base active:scale-90"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Guestbook Moderation Section */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Guestbook Moderation ({guestbookList.length})
            </h2>
            {pendingCount > 0 && (
              <span className="rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.16em] font-semibold text-gold">
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80">
            About Page Notes
          </span>
        </div>

        {guestbookList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-sm text-muted">No guestbook entries received yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line/60 rounded-2xl border border-line bg-surface/40 overflow-hidden">
            {guestbookList.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="font-display tracking-[0.16em] text-sm text-cream">
                      {entry.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-[0.15em] ${
                        entry.approved
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border border-gold/30 bg-gold/10 text-gold"
                      }`}
                    >
                      {entry.approved ? "Approved" : "Pending"}
                    </span>
                    <span className="text-[10px] text-muted/60">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-serif italic text-cream/90 text-sm leading-relaxed">
                    “{entry.message}”
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto">
                  {!entry.approved ? (
                    <form action={approveGuestbookEntry.bind(null, entry.id)}>
                      <button
                        type="submit"
                        data-cursor="link"
                        className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500 hover:text-base active:scale-90"
                      >
                        ✓ Approve
                      </button>
                    </form>
                  ) : (
                    <form action={hideGuestbookEntry.bind(null, entry.id)}>
                      <button
                        type="submit"
                        data-cursor="link"
                        className="rounded-full border border-white/10 bg-surface/70 px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:border-white/30 hover:text-cream active:scale-90"
                      >
                        Hide
                      </button>
                    </form>
                  )}

                  <form action={deleteGuestbookEntry.bind(null, entry.id)}>
                    <button
                      type="submit"
                      data-cursor="link"
                      className="rounded-full border border-sienna/30 bg-sienna/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-sienna transition-all duration-300 hover:border-sienna hover:bg-sienna hover:text-base active:scale-90"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Series Management Section */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Series Categories ({(series ?? []).length})
          </h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80">
            Taxonomy
          </span>
        </div>

        <form action={createSeries} className="mb-6 flex flex-wrap gap-3">
          <input
            name="name"
            required
            placeholder="Series name"
            className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold placeholder:text-muted/60"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="flex-1 min-w-[200px] rounded-xl border border-line bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold placeholder:text-muted/60"
          />
          <button
            type="submit"
            data-cursor="link"
            className="rounded-full border border-gold/40 bg-gold/15 px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold text-gold shadow-[0_0_12px_rgba(232,193,112,0.15)] transition-all duration-300 hover:border-gold hover:bg-gold hover:text-base hover:shadow-[0_0_18px_rgba(232,193,112,0.3)] active:scale-95"
          >
            Add series
          </button>
        </form>

        <ul className="divide-y divide-line/60 rounded-2xl border border-line bg-surface/40 overflow-hidden">
          {(series ?? []).map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02]"
            >
              <div>
                <p className="text-sm font-medium text-cream">{s.name}</p>
                <p className="text-xs text-muted mt-0.5">/series/{s.slug}</p>
              </div>
              <form action={deleteSeries.bind(null, s.id)}>
                <button
                  type="submit"
                  data-cursor="link"
                  className="rounded-full border border-sienna/30 bg-sienna/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-sienna transition-all duration-300 hover:border-sienna hover:bg-sienna hover:text-base active:scale-90"
                >
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
