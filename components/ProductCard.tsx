import Link from "next/link";
import type { Product } from "@/types/product";
import { formatUSD } from "@/lib/money";

function productEmoji(slug: string) {
  switch (slug) {
    case "v-bucks":
      return "💎";
    case "ranked-boost":
      return "🏆";
    case "level-boost":
      return "📈";
    case "win-boost":
    case "wins-boost":
      return "👑";
    default:
      return "🎮";
  }
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/fortnite/${p.slug}`}
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition",
        "hover:bg-white/10 hover:border-white/20",
        "hover:shadow-[0_22px_70px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* ✅ premium glow/shine layers */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        {/* top highlight line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {/* subtle purple glow */}
        <div className="absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-500/14 blur-3xl" />
        {/* shine sweep */}
        <div className="absolute -left-24 top-0 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:left-[120%]" />
      </div>

      {/* ✅ Header row (icon + title) */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {/* icon bubble */}
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10",
                "bg-black/30 text-lg",
                "shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
                "transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10",
              ].join(" ")}
              aria-hidden="true"
            >
              {productEmoji(p.slug)}
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">{p.title}</div>
              <div className="mt-0.5 truncate text-sm text-white/60">{p.subtitle}</div>
            </div>
          </div>
        </div>

        {/* price pill */}
        <div className="shrink-0 text-right">
          <div
            className={[
              "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1",
              "text-xs font-bold text-white/70",
              "transition group-hover:border-violet-300/25 group-hover:bg-violet-500/10",
            ].join(" ")}
          >
            <span className="text-white/55">from</span>
            <span className="text-white">{formatUSD(p.basePrice)}</span>
          </div>
        </div>
      </div>

      {/* badges */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {p.heroBadges.map((b) => (
          <span
            key={b}
            className={[
              "rounded-full px-3 py-1 text-xs text-white/80",
              "border border-white/10 bg-white/10",
              "transition",
              "group-hover:border-violet-300/20 group-hover:bg-violet-500/10",
            ].join(" ")}
          >
            {b}
          </span>
        ))}
      </div>

      {/* footer row */}
      <div className="relative mt-4 flex items-center justify-between text-xs text-white/60">
        <span className="inline-flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 font-semibold text-white/75">
            ⭐ {p.rating.score.toFixed(1)}
          </span>
          <span className="text-white/55">({p.rating.count})</span>
        </span>

        <span className="inline-flex items-center gap-2 text-white/70 transition group-hover:text-white">
          Open
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
