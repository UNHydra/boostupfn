"use client";

import { useMemo } from "react";
import type { WinBoostConfig, WinPlatformKey, WinTypeKey } from "@/lib/pricing";

function OptionCard(props: {
  title: string;
  badge?: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onToggle}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{props.title}</div>
          {props.badge ? (
            <div className="mt-1 inline-flex rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-bold text-cyan-200">
              {props.badge}
            </div>
          ) : null}
        </div>

        <div
          className={[
            "h-6 w-11 rounded-full border border-white/10 p-0.5 transition",
            props.value ? "bg-lime-500/40" : "bg-black/30",
          ].join(" ")}
        >
          <div
            className={[
              "h-5 w-5 rounded-full bg-white transition",
              props.value ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </div>
      </div>
    </button>
  );
}

function clampInt(n: any, min: number, max: number) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

export default function WinConfigurator({
  value,
  onChange,
}: {
  value: WinBoostConfig;
  onChange: (v: WinBoostConfig) => void;
}) {
  // burada “wins” aslında “kaç win istiyor” olsun diye sadece delta kullanıyoruz:
  const maxWins = 20;

  const currentWins = clampInt(value.currentWins ?? 0, 0, maxWins);
  const desiredWins = clampInt(value.desiredWins ?? 0, 0, maxWins);

  const winsToBoost = useMemo(() => Math.max(0, desiredWins - currentWins), [desiredWins, currentWins]);

  // slider: direkt "desiredWins" oynatsın, currentWins 0 kalsın istiyorsan söyle (tek tıkla değiştiririm)
  const sliderValue = clampInt(desiredWins, 0, maxWins);

  const marks = [1, 5, 10, 15, 20]; // resimdeki gibi

  const pct = Math.min(100, Math.max(0, (sliderValue / maxWins) * 100));

  return (
    <div className="space-y-6">
      {/* Wins slider (premium single) */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-sm font-semibold text-white/80">Wins</div>

        <div className="mt-3">
          <input
            type="number"
            min={0}
            max={maxWins}
            value={sliderValue}
            onChange={(e) => {
              const v = clampInt(e.target.value, 0, maxWins);
              // currentWins sabit kalsın, desiredWins güncellensin
              onChange({ ...value, currentWins, desiredWins: v });
            }}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
          />

          {/* Premium slider */}
          <div className="mt-4">
            <div className="relative">
              {/* Track background */}
              <div className="h-2 w-full rounded-full bg-white/10" />

              {/* Filled */}
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-lime-400/80 to-cyan-400/60"
                style={{ width: `${pct}%` }}
              />

              {/* Real range (transparent) */}
              <input
                type="range"
                min={0}
                max={maxWins}
                value={sliderValue}
                onChange={(e) => {
                  const v = clampInt(e.target.value, 0, maxWins);
                  onChange({ ...value, currentWins, desiredWins: v });
                }}
                className="absolute left-0 top-[-8px] h-8 w-full cursor-pointer opacity-0"

              />

              {/* Thumb (fake, premium) */}
              <div
  className="pointer-events-none absolute top-[-10px] h-6 w-6 rounded-full border border-white/20 bg-black shadow-[0_0_0_6px_rgba(132,204,22,0.12)]"
  style={{ left: `calc(${pct}% - 12px)` }}
/>

            </div>

            {/* Marks */}
            <div className="mt-3 flex items-center justify-between text-xs text-white/45">
              {marks.map((m) => (
                <span key={m} className={sliderValue === m ? "text-white/80 font-semibold" : ""}>
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-3 text-xs text-white/60">
              Total wins to boost: <b className="text-white/90">{winsToBoost}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Type + Platform */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm font-semibold text-white/80">Win Type</div>
          <select
            value={value.winType}
            onChange={(e) => onChange({ ...value, winType: e.target.value as WinTypeKey })}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
          >
            <option value="regular">Ranked Win ($4 / win)</option>
            <option value="pub">Pub Game Win ($3 / win)</option>
            <option value="blitz">Blitz Royale Win ($2 / win)</option>
          </select>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm font-semibold text-white/80">Select Platform</div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {(
              [
                ["pc", "PC"],
                ["xbox", "Xbox"],
                ["playstation", "PS"],
                ["switch", "NS"],
              ] as const
            ).map(([key, label]) => {
              const active = value.platform === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChange({ ...value, platform: key as WinPlatformKey })}
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-bold transition",
                    active
                      ? "border-cyan-300/40 bg-cyan-500/10"
                      : "border-white/10 bg-black/20 hover:bg-white/10",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xl font-extrabold">Customize</div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <OptionCard
            title="Duo Queue"
            badge="+$1 / win"
            value={value.options.duo}
            onToggle={() => onChange({ ...value, options: { ...value.options, duo: !value.options.duo } })}
          />
        </div>

        <div className="mt-3 text-xs text-white/60">
          Bulk discount applies automatically (example: 10 wins = 10% off).
        </div>
      </div>
    </div>
  );
}
