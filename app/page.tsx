import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";


function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD safe stringify
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


export default function Home() {
  return (
    <div className="space-y-10" >
            <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://YOURDOMAIN.COM/#organization",
              name: "BoostUP",
              url: "https://YOURDOMAIN.COM",
              logo: "https://YOURDOMAIN.COM/brand/boostup-logo2.png",
            },
            {
              "@type": "WebSite",
              "@id": "https://YOURDOMAIN.COM/#website",
              url: "https://YOURDOMAIN.COM",
              name: "BoostUP",
              publisher: { "@id": "https://YOURDOMAIN.COM/#organization" },
              inLanguage: "en",
            },
          ],
        }}
      />

      {/* ✅ HERO (premium 2-column) */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
        {/* premium glow layers */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute -top-24 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-violet-500/12 blur-3xl" />
          <div className="absolute -right-24 -top-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_0%_0%,rgba(139,92,246,0.10),transparent_55%)]" />
        </div>

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          {/* LEFT */}
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
              Trusted by 10,000+ Fortnite players
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight">
              The Most Trusted Fortnite Store
            </h1>

            <p className="mt-3 max-w-xl text-white/70">
              Secure boosts, fast delivery, and 24/7 support for global players.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                ⭐ 4.9 Rating
                <span className="text-white/50 font-semibold">(1400+)</span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                ✅ Money-back guarantee
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                🔒 Account-safe process
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                ⚡ Fast delivery
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                💬 24/7 Discord support
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black"
                href="/fortnite"
              >
                Browse Fortnite
              </Link>

              <Link
                className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 transition"
                href="/fortnite/v-bucks"
              >
                Cheap V-Bucks
              </Link>
            </div>
          </div>

          {/* RIGHT (Hero Image) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
              <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-500/18 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 top-0 h-full w-16 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />

              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/hero-fortnite2.png"
                  alt="BoostUP Fortnite services"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-3 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold text-white/80 backdrop-blur">
              ⚡ Fast • 🔒 Safe • 💬 Support
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-violet-500/10 blur-3xl" />

        <h2 className="text-2xl font-extrabold tracking-tight">
          Why Players Trust{" "}
          <span className="text-violet-400 drop-shadow-[0_0_14px_rgba(139,92,246,0.75)]">
            BoostUP
          </span>
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-white/65">
          We focus on safety, speed, and real human support — not empty promises.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-lg">🛡️</div>
            <div className="mt-2 font-bold">Account Safe</div>
            <p className="mt-1 text-sm text-white/60">
              Offline play, no bans, no risky methods.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-lg">⚡</div>
            <div className="mt-2 font-bold">Fast Delivery</div>
            <p className="mt-1 text-sm text-white/60">
              Average completion time: 1–3 hours.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-lg">🎮</div>
            <div className="mt-2 font-bold">Real Players</div>
            <p className="mt-1 text-sm text-white/60">
              No bots. No scripts. Only skilled human boosters.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-lg">💬</div>
            <div className="mt-2 font-bold">24/7 Discord Support</div>
            <p className="mt-1 text-sm text-white/60">
              Instant help from real moderators.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">Popular services</h2>
          <Link className="text-sm text-white/70 hover:text-white" href="/fortnite">
            See all →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
