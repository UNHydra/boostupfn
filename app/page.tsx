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
        "@id": "https://www.boostupfn.com/#organization",
        name: "BoostUP",
        url: "https://www.boostupfn.com",
        logo: "https://www.boostupfn.com/brand/boostup-logo4.png",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.boostupfn.com/#website",
        url: "https://www.boostupfn.com",
        name: "BoostUP",
        publisher: { "@id": "https://www.boostupfn.com/#organization" },
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
                <span className="text-white/50 font-semibold">(2500+)</span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                ✅ Money-back guarantee
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
                🔒 Account-safety process
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
              ⚡ Fast • 🔒 Safety • 💬 Support
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
            <div className="mt-2 font-bold">Account Safety</div>
            <p className="mt-1 text-sm text-white/60">
              Offline play, no bans, no risky methods.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="text-lg">⚡</div>
            <div className="mt-2 font-bold">Fast Delivery</div>
            <p className="mt-1 text-sm text-white/60">
              Average completion time: 1–24 hours.
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
      {/* ✅ TRUST SECTION */}
<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8">
  {/* subtle premium glow */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
  <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-violet-500/10 blur-3xl" />

  <h2 className="text-2xl font-extrabold tracking-tight">
    Why Players Choose{" "}
    <span className="text-violet-400 drop-shadow-[0_0_12px_rgba(139,92,246,0.7)]">
      BoostUP
    </span>
  </h2>

  <p className="mt-2 max-w-2xl text-sm text-white/65">
    We focus on safety, speed, and real human support — not empty promises.
  </p>

  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {/* Card 1 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="text-lg">🛡️</div>
      <div className="mt-2 font-bold">Account Safe</div>
      <p className="mt-1 text-sm text-white/60">
        VPN protected boosting with human gameplay.
      </p>
    </div>

    {/* Card 2 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="text-lg">⚡</div>
      <div className="mt-2 font-bold">Fast Delivery</div>
      <p className="mt-1 text-sm text-white/60">
        Most boosts are completed within hours.
      </p>
    </div>

    {/* Card 3 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="text-lg">🎮</div>
      <div className="mt-2 font-bold">Real Players</div>
      <p className="mt-1 text-sm text-white/60">
        No bots. No scripts. Only skilled boosters.
      </p>
    </div>

    {/* Card 4 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="text-lg">💬</div>
      <div className="mt-2 font-bold">24/7 Support</div>
      <p className="mt-1 text-sm text-white/60">
        Instant help from real moderators on Discord.
      </p>
    </div>
  </div>
</section>

{/* ✅ REVIEWS / TESTIMONIALS */}
<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8">
  {/* subtle top line + glow */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-[520px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">What Players Say</h2>
      <p className="mt-1 text-sm text-white/65">
        Real feedback from customers who boosted with BoostUP.
      </p>
    </div>

    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
      ⭐ 4.9 <span className="text-white/50 font-semibold">(1400+ reviews)</span>
    </div>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-3">
    {/* Review 1 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">A****</div>
        <div className="text-xs text-white/50">Ranked Boost</div>
      </div>
      <div className="mt-2 text-sm text-white/80">
        “Super fast delivery. Communication on Discord was instant. 10/10.”
      </div>
      <div className="mt-3 text-xs text-white/50">⭐⭐⭐⭐⭐</div>
    </div>

    {/* Review 2 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">E****</div>
        <div className="text-xs text-white/50">V-Bucks</div>
      </div>
      <div className="mt-2 text-sm text-white/80">
        “Cheap and safe. Got my V-Bucks in minutes. Looks very professional.”
      </div>
      <div className="mt-3 text-xs text-white/50">⭐⭐⭐⭐⭐</div>
    </div>

    {/* Review 3 */}
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold">*****</div>
        <div className="text-xs text-white/50">Level Boost</div>
      </div>
      <div className="mt-2 text-sm text-white/80">
        “Smooth process, no issues. Support helped me instantly.”
      </div>
      <div className="mt-3 text-xs text-white/50">⭐⭐⭐⭐⭐</div>
    </div>
  </div>

  {/* bottom trust strip */}
  <div className="mt-6 flex flex-wrap items-center gap-2">
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
      ✅ Verified orders
    </span>
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
      🔒 Secure checkout
    </span>
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
      💬 Discord support
    </span>
  </div>
</section>

{/* ✅ FAQ (Premium) */}
<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8">
  {/* subtle top line + glow */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
  <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-[520px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

  <h2 className="text-2xl font-extrabold tracking-tight">FAQ</h2>
  <p className="mt-2 max-w-2xl text-sm text-white/65">
    Quick answers about delivery, safety, and how the process works.
  </p>

  <div className="mt-6 space-y-3">
    <details className="group rounded-2xl border border-white/10 bg-black/30 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-sm font-bold text-white/90">How fast is delivery?</span>
        <span className="text-white/60 transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm text-white/70">
        Most orders start within minutes. Typical completion time is shown inside the Order box.
      </p>
    </details>

    <details className="group rounded-2xl border border-white/10 bg-black/30 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-sm font-bold text-white/90">Is this safe for my account?</span>
        <span className="text-white/60 transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm text-white/70">
        Yes. We use safe methods like offline play options (when available) and never use cheats or bots.
      </p>
    </details>

    <details className="group rounded-2xl border border-white/10 bg-black/30 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-sm font-bold text-white/90">How do payments work?</span>
        <span className="text-white/60 transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm text-white/70">
        You create an order, then you’ll receive the payment address and instructions. After payment, you submit proof.
      </p>
    </details>

    <details className="group rounded-2xl border border-white/10 bg-black/30 p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-sm font-bold text-white/90">Where do I contact support?</span>
        <span className="text-white/60 transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm text-white/70">
        Discord support is available 24/7. Click the Discord Support button in the navbar to open a ticket.
      </p>
    </details>
  </div>

  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
    <div className="text-sm font-bold text-white/90">Still have questions?</div>
    <p className="mt-1 text-sm text-white/70">
      Message us on Discord and we’ll reply fast.
    </p>
  </div>
</section>

{/* ✅ REVIEWS (Premium Social Proof) */}
<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8">
  {/* subtle top line + glow */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
  <div className="pointer-events-none absolute -top-10 right-10 h-24 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Recent Reviews</h2>
      <p className="mt-2 max-w-2xl text-sm text-white/65">
        Real customer feedback from BoostUP orders.
      </p>
    </div>

    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-white/80">
      ⭐ 4.9 <span className="text-white/50 font-semibold">(1400+)</span>
    </div>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-3">
    {[
      {
        name: "E****",
        tag: "V-Bucks",
        text: "Delivery was super fast. Support answered instantly on Discord.",
      },
      {
        name: "M****",
        tag: "Ranked Boost",
        text: "Rank up was smooth and safe. Exactly as described.",
      },
      {
        name: "D*********",
        tag: "Level Boost",
        text: "Great price, finished quicker than expected. Would order again.",
      },
      {
        name: "A*********",
        tag: "Win Boost",
        text: "Clean communication + fast queue. Very professional.",
      },
      {
        name: "C***",
        tag: "Ranked",
        text: "No stress, no weird stuff. Legit experience.",
      },
      {
        name: "K*******",
        tag: "Support",
        text: "They guided me step-by-step. Premium service.",
      },
    ].map((r, i) => (
      <div
        key={i}
        className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="font-bold text-white/90">{r.name}</div>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-bold text-white/75">
            {r.tag}
          </span>
        </div>

        <div className="mt-2 text-sm text-white/70">{r.text}</div>

        <div className="mt-3 text-xs text-white/45">⭐ ⭐ ⭐ ⭐ ⭐</div>
      </div>
    ))}
  </div>

  {/* bottom CTA */}
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
    <div className="text-sm font-bold text-white/90">Want your review here?</div>
    <p className="mt-1 text-sm text-white/70">
      Order any service and our team will assist you 24/7 on Discord.
    </p>
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
