"use client";

import Link from "next/link";

const DISCORD_INVITE = "https://discord.gg/g4UyGv7Smj";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/40">
      {/* top glow line */}
      <div className="pointer-events-none relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
        <div className="absolute inset-x-0 top-[-10px] h-10 bg-gradient-to-r from-transparent via-violet-500/15 to-transparent blur-[16px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Trust strip */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
              ✅ Money-back guarantee
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
              🔒 Account-safety process
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/80">
              ⚡ Fast delivery
            </span>
          </div>

          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className={[
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-extrabold text-white",
              "border border-violet-300/25 bg-gradient-to-r from-violet-600/70 to-fuchsia-600/40",
              "shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
              "hover:shadow-[0_14px_40px_rgba(139,92,246,0.28)] hover:border-violet-200/40",
              "transition",
            ].join(" ")}
          >
            Discord Support
          </a>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Column 1 */}
          <div>
            <div className="text-sm font-extrabold text-white">BoostUP</div>
            <p className="mt-2 text-sm text-white/60">
              Premium Fortnite services for Global players. Pro players, safe process, fast delivery.
            </p>

            {/* Payment icons (text-based, clean) */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/55">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">PayPal</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Visa</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Mastercard</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Crypto</span>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div className="text-sm font-extrabold text-white">Services</div>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <Link className="hover:text-white" href="/fortnite/v-bucks">
                V-Bucks
              </Link>
              <Link className="hover:text-white" href="/fortnite/ranked-boost">
                Ranked Boost
              </Link>
              <Link className="hover:text-white" href="/fortnite/level-boost">
                Level Boost
              </Link>
              <Link className="hover:text-white" href="/fortnite/win-boost">
                Win Boost
              </Link>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div className="text-sm font-extrabold text-white">Support</div>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <a className="hover:text-white" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
                Discord Support
              </a>
              <span className="text-white/55">Response time: usually under 15 min</span>
              <span className="text-white/55">24/7 moderation</span>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} BoostUP. All rights reserved.</div>
          <div className="max-w-2xl">
            BoostUP is not affiliated with Epic Games. Fortnite is a trademark of Epic Games, Inc. All trademarks
            belong to their respective owners.
          </div>
        </div>
      </div>
    </footer>
  );
}
