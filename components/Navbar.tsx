"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const DISCORD_INVITE = "https://discord.gg/g4UyGv7Smj";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "group relative text-[15px] font-semibold transition md:text-base",
        active ? "text-white" : "text-white/70 hover:text-white",
      ].join(" ")}
    >
      {label}

      {/* premium underline */}
      <span
        className={[
          "pointer-events-none absolute -bottom-2 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full",
          "bg-gradient-to-r from-transparent via-violet-400 to-transparent",
          "transition-all duration-300 ease-out",
          active
            ? "w-full opacity-100"
            : "group-hover:w-full group-hover:opacity-100 opacity-0",
        ].join(" ")}
      />

      {/* glow */}
      <span
        className={[
          "pointer-events-none absolute -bottom-3 left-1/2 h-4 w-0 -translate-x-1/2",
          "bg-gradient-to-r from-transparent via-violet-500/40 to-transparent blur-xl",
          "transition-all duration-300 ease-out",
          active
            ? "w-full opacity-100"
            : "group-hover:w-full group-hover:opacity-100 opacity-0",
        ].join(" ")}
      />
    </Link>
  );
}


export default function Navbar() {
  return (
    <header className=" sticky top-0 z-50 border-b border-white/10 bg-black/65 backdrop-blur">
      {/* ✅ Premium glows (logo + nav altı mor yansıma) */}
      <div className="pointer-events-none absolute inset-0">
        {/* üst hafif ışık çizgisi */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* logo çevresinde mor glow */}
        <div className="absolute left-6 top-[-24px] h-24 w-64 rounded-full bg-violet-500/20 blur-[55px]" />

        {/* navbar altına mor reflection */}
        <div className="absolute inset-x-0 bottom-[-18px] h-10 bg-gradient-to-r from-transparent via-violet-500/25 to-transparent blur-[14px]" />

        {/* menülerin altına ince mor çizgi */}
        
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />
        {/* ✅ center line (ortadan sağ/sola uzayıp sönme) */}
<div className="absolute inset-x-0 bottom-[-2px] mx-auto h-[2px] w-[72%] bg-gradient-to-r from-transparent via-violet-400/55 to-transparent blur-[0.2px]" />
<div className="absolute inset-x-0 bottom-[-6px] mx-auto h-6 w-[72%] bg-gradient-to-r from-transparent via-violet-500/18 to-transparent blur-[16px]" />

      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* ✅ Brand (logo) */}
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/brand/boostup-logo4.png" // <- logo dosyanın adı /public içindeki yol
            alt="BoostUP"
            width={140}
            height={44}
            priority
            className="h-16 w-auto select-none drop-shadow-[0_0_18px_rgba(139,92,246,0.20)]"
          />
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/70 sm:inline-flex">
            Fortnite
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-9 md:flex">
          <NavItem href="/fortnite/v-bucks" label="V-Bucks" />
          <NavItem href="/fortnite/ranked-boost" label="Ranked Boost" />
          <NavItem href="/fortnite/level-boost" label="Level Boost" />
          <NavItem href="/fortnite/win-boost" label="Win Boost" />
          <NavItem href="/faq" label="FAQ" />

        </nav>

        {/* ✅ Right CTA (premium purple pill like örnek) */}
        <div className="flex items-center gap-2">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className={[
              "group inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold text-white",
              "border border-violet-300/25 bg-gradient-to-r from-violet-600/70 to-fuchsia-600/40",
              "shadow-[0_10px_30px_rgba(139,92,246,0.18)]",
              "hover:shadow-[0_14px_40px_rgba(139,92,246,0.28)] hover:border-violet-200/40",
              "transition",
            ].join(" ")}
          >
            {/* icon (inline svg) */}
            <svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="currentColor"
  className="opacity-95 drop-shadow-[0_0_10px_rgba(139,92,246,0.35)]"
  aria-hidden="true"
>
  {/* basit discord mark-like icon */}
  <path d="M19.5 6.5a14.6 14.6 0 0 0-3.6-1.2l-.2.4a12.6 12.6 0 0 1 2.9 1.1c-1.2-.6-2.6-1-4.1-1.2a15.4 15.4 0 0 0-5 0c-1.5.2-2.9.6-4.1 1.2a12.6 12.6 0 0 1 2.9-1.1l-.2-.4a14.6 14.6 0 0 0-3.6 1.2C2 9.1 1.5 11.8 1.7 14.5c1.5 1.1 3.2 1.9 5 2.3l.6-.8a9.8 9.8 0 0 1-1.6-.8l.4-.3c3 1.4 6.5 1.4 9.5 0l.4.3c-.5.3-1 .6-1.6.8l.6.8c1.8-.4 3.5-1.2 5-2.3.2-2.7-.3-5.4-1.7-8zm-10 7.4c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6zm5 0c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6z" />
</svg>


            <span className="relative">
              Discord Support
              <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-white/70 transition-all duration-300 group-hover:w-full" />
            </span>
          </a>
        </div>
      </div>

      {/* mobile nav */}
      <div className="relative border-t border-white/10 bg-black/40 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-x-auto px-4 py-3">
          <div className="flex items-center gap-5 whitespace-nowrap">
            <NavItem href="/fortnite/v-bucks" label="V-Bucks" />
            <NavItem href="/fortnite/ranked-boost" label="Ranked Boost" />
            <NavItem href="/fortnite/level-boost" label="Level Boost" />
            <NavItem href="/fortnite/win-boost" label="Win Boost" />
          </div>
        </div>
      </div>
    </header>
  );
}