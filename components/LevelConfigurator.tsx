"use client";

import { useMemo, useRef, useState } from "react";

type LevelPlatformKey = "pc" | "playstation" | "xbox" | "switch";

type LevelConfigValue = {
  currentLevel: number;
  desiredLevel: number;
  platform: LevelPlatformKey;
};

function clampInt(n: any, min: number, max: number) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function LevelConfigurator({
  value,
  onChange,
}: {
  value: LevelConfigValue;
  onChange: (v: LevelConfigValue) => void;
}) {
  const min = 1;
  const max = 200;

  const cur = clampInt(value.currentLevel ?? 1, min, max);
  const des = clampInt(value.desiredLevel ?? 2, min, max);

  function setCurrent(next: number) {
    const c = clampInt(next, min, max);
    const fixedDesired = Math.max(des, c + 1);
    onChange({ ...value, currentLevel: c, desiredLevel: clampInt(fixedDesired, min, max) });
  }

  function setDesired(next: number) {
    const d = clampInt(next, min, max);
    const fixed = Math.max(d, cur + 1);
    onChange({ ...value, desiredLevel: clampInt(fixed, min, max) });
  }

  const curPct = ((cur - min) / (max - min)) * 100;
  const desPct = ((des - min) / (max - min)) * 100;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<"cur" | "des" | null>(null);

  const valueFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return cur;
    const rect = el.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const pct = rect.width === 0 ? 0 : x / rect.width;
    const raw = min + pct * (max - min);
    return clampInt(raw, min, max);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const v = valueFromClientX(e.clientX);

    if (drag === "cur") {
      // current desired'i gecmesin
      const fixed = Math.min(v, des - 1);
      setCurrent(fixed);
    } else {
      // desired current'in altina dusmesin
      const fixed = Math.max(v, cur + 1);
      setDesired(fixed);
    }
  };

  const stopDrag = () => setDrag(null);

  const onTrackClick = (e: React.MouseEvent) => {
    const v = valueFromClientX(e.clientX);
    // en yakın noktayı seç
    const distCur = Math.abs(v - cur);
    const distDes = Math.abs(v - des);

    if (distCur <= distDes) {
      const fixed = Math.min(v, des - 1);
      setCurrent(fixed);
    } else {
      const fixed = Math.max(v, cur + 1);
      setDesired(fixed);
    }
  };

  // hangi thumb üstte (yakınsa)
  const curOnTop = useMemo(() => {
    const gap = Math.abs(desPct - curPct);
    return gap < 1 ? curPct > desPct : false;
  }, [curPct, desPct]);

  return (
    <div className="space-y-6">
      {/* Premium dual slider (single card) */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xl font-extrabold">Level Boost</div>
        <div className="mt-1 text-sm text-white/70">Select current and desired level (1 - 200).</div>

        {/* Inputs row */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold text-white/70">Current LVL</div>
            <input
              type="number"
              min={min}
              max={max}
              value={cur}
              onChange={(e) => setCurrent(clampInt(e.target.value, min, max))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
            />
          </div>

          <div>
            <div className="text-xs font-semibold text-white/70">Desired LVL</div>
            <input
              type="number"
              min={min}
              max={max}
              value={des}
              onChange={(e) => setDesired(clampInt(e.target.value, min, max))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
            />
          </div>
        </div>

        {/* Dual slider track */}
        <div className="mt-6">
          <div
            ref={trackRef}
            onMouseDown={onTrackClick}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onPointerLeave={stopDrag}
            className="relative h-2 w-full rounded-full bg-white/10"
          >
            {/* selected range fill */}
            <div
              className="absolute top-0 h-2 rounded-full bg-violet-500/70"
              style={{
                left: `${curPct}%`,
                width: `${Math.max(0, desPct - curPct)}%`,
              }}
            />

            {/* Draggable Current Thumb */}
            <button
              type="button"
              onPointerDown={(e) => {
                (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId);
                setDrag("cur");
              }}
              className={[
                "absolute top-[-11px] h-6 w-6 rounded-full border border-white/20 bg-black shadow-[0_0_0_6px_rgba(139,92,246,0.18)]",
                "cursor-grab active:cursor-grabbing",
                curOnTop ? "z-20" : "z-10",
              ].join(" ")}
              style={{ left: `calc(${curPct}% - 12px)` }}
              aria-label="Current level"
            />

            {/* Draggable Desired Thumb */}
            <button
              type="button"
              onPointerDown={(e) => {
                (e.currentTarget as HTMLButtonElement).setPointerCapture?.(e.pointerId);
                setDrag("des");
              }}
              className={[
                "absolute top-[-11px] h-6 w-6 rounded-full border border-white/20 bg-black shadow-[0_0_0_6px_rgba(139,92,246,0.18)]",
                "cursor-grab active:cursor-grabbing",
                curOnTop ? "z-10" : "z-20",
              ].join(" ")}
              style={{ left: `calc(${desPct}% - 12px)` }}
              aria-label="Desired level"
            />
          </div>

          {/* Marks */}
          <div className="mt-3 flex items-center justify-between text-xs text-white/45">
            {[1, 44, 87, 130, 173, 200].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Platform */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xl font-extrabold">Select Your Platform:</div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {(
            [
              ["pc", "PC"],
              ["playstation", "PS"],
              ["xbox", "XBOX"],
              ["switch", "Switch"],
            ] as const
          ).map(([key, label]) => {
            const active = value.platform === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...value, platform: key as LevelPlatformKey })}
                className={[
                  "rounded-2xl border px-4 py-3 text-sm font-bold transition",
                  active ? "border-violet-300/40 bg-violet-500/15" : "border-white/10 bg-black/20 hover:bg-white/10",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
