"use client";

import { useMemo } from "react";

/** ✅ FIX: DIVS const + type-safe Division/DivOnly */
const DIVS = ["I", "II", "III"] as const;
type DivOnly = (typeof DIVS)[number];
type Division = DivOnly | null;

type RankKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "elite"
  | "champion"
  | "unreal";

type Rank = {
  key: RankKey;
  label: string;
  hasDivisions: boolean;
};

const RANKS: Rank[] = [
  { key: "bronze", label: "Bronze", hasDivisions: true },
  { key: "silver", label: "Silver", hasDivisions: true },
  { key: "gold", label: "Gold", hasDivisions: true },
  { key: "platinum", label: "Platinum", hasDivisions: true },
  { key: "diamond", label: "Diamond", hasDivisions: true },
  { key: "elite", label: "Elite", hasDivisions: false },
  { key: "champion", label: "Champion", hasDivisions: false },
  { key: "unreal", label: "Unreal", hasDivisions: false },
];

// ✅ Rank ikonları (public/ranks içine koy)
const RANK_ICONS: Record<RankKey, string> = {
  bronze: "/ranks/bronze.png",
  silver: "/ranks/silver.png",
  gold: "/ranks/gold.png",
  platinum: "/ranks/platinum.png",
  diamond: "/ranks/diamond.png",
  elite: "/ranks/elite.png",
  champion: "/ranks/champion.png",
  unreal: "/ranks/unreal.png",
};

// ✅ Yeni alanlar
type RegionKey = "europe" | "na-east" | "na-west" | "asia" | "oce" | "br";

// ✅ MODE: Yenileri eklendi
export type ModeKey =
  | "battle-royale"
  | "zero-build"
  | "reload-build"
  | "reload-zero-build"
  | "ballistic";

type PlatformKey = "pc" | "xbox" | "playstation" | "switch";

export type RankedConfigValue = {
  currentRank: RankKey;
  currentDiv: Division;
  desiredRank: RankKey;
  desiredDiv: Division;

  region: RegionKey;
  mode: ModeKey;
  platform: PlatformKey;

  options: {
    playOffline: boolean;
    streaming: boolean;
    expressDelivery: boolean;
    coachingDuo: boolean; // Duo Queue
  };
};

function rankGlow(rank: RankKey) {
  switch (rank) {
    case "bronze":
      return "from-amber-500/20 via-transparent to-transparent ring-amber-500/20";
    case "silver":
      return "from-slate-200/15 via-transparent to-transparent ring-slate-200/20";
    case "gold":
      return "from-yellow-400/15 via-transparent to-transparent ring-yellow-400/20";
    case "platinum":
      return "from-cyan-400/15 via-transparent to-transparent ring-cyan-400/20";
    case "diamond":
      return "from-sky-400/15 via-transparent to-transparent ring-sky-400/20";
    case "elite":
      return "from-emerald-400/15 via-transparent to-transparent ring-emerald-400/20";
    case "champion":
      return "from-orange-400/15 via-transparent to-transparent ring-orange-400/20";
    case "unreal":
      return "from-violet-400/15 via-transparent to-transparent ring-violet-400/20";
    default:
      return "from-white/10 via-transparent to-transparent ring-white/10";
  }
}

function getRank(key: RankKey) {
  return RANKS.find((r) => r.key === key)!;
}

/* ✅ ADDED: desired < current olmasın helpers */
const DIV_ORDER: Record<DivOnly, number> = { I: 0, II: 1, III: 2 };

function rankIndex(rank: RankKey, div: Division) {
  const rankPos = RANKS.findIndex((r) => r.key === rank);
  const hasDiv = getRank(rank).hasDivisions;

  // elite/champion/unreal: tek seviye
  if (!hasDiv) return rankPos * 10;

  const d: DivOnly = (div ?? "I") as DivOnly;
  return rankPos * 10 + DIV_ORDER[d];
}

function isHigher(fromRank: RankKey, fromDiv: Division, toRank: RankKey, toDiv: Division) {
  return rankIndex(toRank, toDiv) > rankIndex(fromRank, fromDiv);
}

// current -> desired geçersizse, desired'ı en az current+1 yap
function clampDesiredUp(value: RankedConfigValue): RankedConfigValue {
  const curRank = value.currentRank;
  const curDiv: Division = value.currentDiv ?? (getRank(curRank).hasDivisions ? "I" : null);

  // Eğer zaten geçerliyse dokunma
  if (isHigher(curRank, curDiv, value.desiredRank, value.desiredDiv)) return value;

  // Desired'ı current rank'ın bir üst rankına al (yoksa unreal)
  const curPos = RANKS.findIndex((r) => r.key === curRank);
  const nextPos = Math.min(curPos + 1, RANKS.length - 1);
  const nextRank = RANKS[nextPos]!.key;

  const nextHasDiv = getRank(nextRank).hasDivisions;
  return {
    ...value,
    currentDiv: getRank(curRank).hasDivisions ? curDiv : null,
    desiredRank: nextRank,
    desiredDiv: nextHasDiv ? "I" : null,
  };
}

function OptionCard(props: {
  title: string;
  badge?: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => !props.disabled && props.onToggle()}
      className={[
        "w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition",
        props.disabled ? "cursor-not-allowed opacity-50" : "hover:bg-white/[0.07]",
      ].join(" ")}
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

function RankCard(props: {
  title: string;
  valueLabel: string;
  selectedRank: RankKey;
  selectedDiv: Division;
  onPickRank: (r: RankKey) => void;

  /** ✅ FIX: onPickDiv / isDivDisabled DivOnly olsun */
  onPickDiv: (d: DivOnly) => void;

  /* ✅ ADDED */
  isRankDisabled?: (r: RankKey) => boolean;
  isDivDisabled?: (d: DivOnly) => boolean;
}) {
  const rankObj = useMemo(() => getRank(props.selectedRank), [props.selectedRank]);

  return (
    <div
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.04] p-6",
        "ring-1",
        `bg-gradient-to-br ${rankGlow(props.selectedRank)}`,
      ].join(" ")}
    >
      <div>
        <div className="text-sm font-semibold text-white/70">{props.title}</div>
        <div className="mt-1 text-lg font-bold text-white">{props.valueLabel}</div>
      </div>

      {/* ✅ Rank ikonları (KOLON = 4, BOYUTLAR AYNI) */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {RANKS.map((r) => {
          const active = r.key === props.selectedRank;
          const disabled = props.isRankDisabled ? props.isRankDisabled(r.key) : false;

          return (
            <button
              key={r.key}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && props.onPickRank(r.key)}
              title={r.label}
              aria-label={r.label}
              className={[
                "group relative flex h-14 w-14 items-center justify-center rounded-2xl border transition",
                "overflow-hidden",
                disabled
                  ? "cursor-not-allowed opacity-40 border-white/10 bg-black/20"
                  : active
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-black/20 hover:bg-white/10",
              ].join(" ")}
            >
              {/* ✅ Premium glow layer */}
              <span
                className={[
                  "pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-md transition",
                  active ? "opacity-100" : "group-hover:opacity-70",
                  `bg-gradient-to-br ${rankGlow(r.key)}`,
                ].join(" ")}
              />

              {/* ✅ Shine sweep */}
              <span
                className={[
                  "pointer-events-none absolute -left-10 top-0 h-full w-10 rotate-12",
                  "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                  "opacity-0 transition duration-300",
                  "group-hover:opacity-100 group-hover:left-[120%]",
                ].join(" ")}
              />

              <img
                src={RANK_ICONS[r.key]}
                alt={r.label}
                draggable={false}
                className={[
                  "relative z-10 h-9 w-9 select-none object-contain transition-transform duration-200",
                  active ? "opacity-100 scale-110" : "opacity-85 group-hover:opacity-100 group-hover:scale-110",
                ].join(" ")}
              />

              {active ? (
                <span className="absolute -right-1 -top-1 z-20 h-2.5 w-2.5 rounded-full bg-white/80" />
              ) : null}
            </button>
          );
        })}
      </div>

      {rankObj.hasDivisions ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {DIVS.map((d) => {
            const active = d === props.selectedDiv;
            const disabled = props.isDivDisabled ? props.isDivDisabled(d) : false;

            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && props.onPickDiv(d)}
                className={[
                  "rounded-2xl border py-2 text-sm font-bold transition",
                  disabled
                    ? "cursor-not-allowed opacity-40 border-white/10 bg-black/20"
                    : active
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/20 hover:bg-white/10",
                ].join(" ")}
              >
                {d}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function RankedConfigurator({
  value,
  onChange,
}: {
  value: RankedConfigValue;
  onChange: (v: RankedConfigValue) => void;
}) {
  const currentRank = value.currentRank;
  const desiredRank = value.desiredRank;
  const currentDiv = value.currentDiv ?? null;
  const desiredDiv = value.desiredDiv ?? null;

  function pickCurrentRank(r: RankKey) {
    const has = getRank(r).hasDivisions;

    const next: RankedConfigValue = {
      ...value,
      currentRank: r,
      currentDiv: has ? (currentDiv ?? "I") : null,
    };

    onChange(clampDesiredUp(next));
  }

  function pickDesiredRank(r: RankKey) {
  const has = getRank(r).hasDivisions;

  // default div
  let nextDesiredDiv: Division = has ? (desiredDiv ?? "I") : null;

  // ✅ Aynı rank seçiliyorsa: currentDiv'e göre en küçük geçerli division'a it
  if (r === value.currentRank && has) {
    const cur = (value.currentDiv ?? "I") as Exclude<Division, null>;

    // current I -> desired II, current II -> desired III, current III -> rank zaten yükselmeli
    if (cur === "I") nextDesiredDiv = "II";
    else if (cur === "II") nextDesiredDiv = "III";
    else {
      // current III ise aynı rank'ta ilerleme yok; bir üst ranka zorla
      const curPos = RANKS.findIndex((x) => x.key === value.currentRank);
      const nextPos = Math.min(curPos + 1, RANKS.length - 1);
      const nextRank = RANKS[nextPos]!.key;
      const nextHasDiv = getRank(nextRank).hasDivisions;

      onChange({
        ...value,
        desiredRank: nextRank,
        desiredDiv: nextHasDiv ? "I" : null,
      });
      return;
    }
  }

  // ✅ final güvenlik: hala higher değilse hiçbir şey yapma
  if (!isHigher(value.currentRank, value.currentDiv, r, nextDesiredDiv)) return;

  onChange({
    ...value,
    desiredRank: r,
    desiredDiv: nextDesiredDiv,
  });
}


  const currentLabel = useMemo(() => {
    const base = getRank(currentRank).label;
    return currentDiv ? `${base} ${currentDiv}` : base;
  }, [currentRank, currentDiv]);

  const desiredLabel = useMemo(() => {
    const base = getRank(desiredRank).label;
    return desiredDiv ? `${base} ${desiredDiv}` : base;
  }, [desiredRank, desiredDiv]);

  return (
    <div className="space-y-6">
      {/* RANKS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RankCard
          title="Current Rank"
          valueLabel={currentLabel}
          selectedRank={currentRank}
          selectedDiv={currentDiv}
          onPickRank={pickCurrentRank}
          /** ✅ FIX: d DivOnly */
          onPickDiv={(d: DivOnly) => onChange(clampDesiredUp({ ...value, currentDiv: d }))}
        />

        <RankCard
          title="Desired Rank"
          valueLabel={desiredLabel}
          selectedRank={desiredRank}
          selectedDiv={desiredDiv}
          onPickRank={pickDesiredRank}
          /** ✅ FIX: d DivOnly */
          onPickDiv={(d: DivOnly) => {
            if (!isHigher(value.currentRank, value.currentDiv, value.desiredRank, d)) return;
            onChange({ ...value, desiredDiv: d });
          }}
          isRankDisabled={(r) => {
  const has = getRank(r).hasDivisions;

  // ✅ aynı rank ise division'a göre karar verilecek, rank'ı disable etme
  if (r === value.currentRank) return false;

  // ✅ diğer rank'larda en düşük division ile kıyasla (I)
  const d: Division = has ? "I" : null;
  return !isHigher(value.currentRank, value.currentDiv, r, d);
}}
          isDivDisabled={(d) => {
            return !isHigher(value.currentRank, value.currentDiv, value.desiredRank, d);
          }}
        />
      </div>

      {/* Region + Mode */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm font-semibold text-white/80">Region</div>
          <select
            value={value.region}
            onChange={(e) => onChange({ ...value, region: e.target.value as RegionKey })}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
          >
            <option value="europe">Europe</option>
            <option value="na-east">NA-East</option>
            <option value="na-west">NA-West</option>
            <option value="asia">Asia</option>
            <option value="oce">Oceania</option>
            <option value="br">Brazil</option>
          </select>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="text-sm font-semibold text-white/80">Mode</div>
          <select
            value={value.mode}
            onChange={(e) => onChange({ ...value, mode: e.target.value as ModeKey })}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
          >
            <option value="battle-royale">Battle Royale</option>
            <option value="zero-build">Zero Build</option>

            <option value="reload-build">Reload (Build)</option>
            <option value="reload-zero-build">Reload (Zero Build)</option>

            <option value="ballistic">Ballistic</option>
          </select>
        </div>
      </div>

      {/* Platform */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xl font-extrabold">Select Platform</div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {(
            [
              ["pc", "PC"],
              ["xbox", "Xbox"],
              ["playstation", "PlayStation"],
              ["switch", "Nintendo Switch"],
            ] as const
          ).map(([key, label]) => {
            const active = value.platform === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...value, platform: key })}
                className={[
                  "rounded-2xl border px-4 py-3 text-sm font-bold transition",
                  active ? "border-cyan-300/40 bg-cyan-500/10" : "border-white/10 bg-black/20 hover:bg-white/10",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Options */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-xl font-extrabold">Customize</div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <OptionCard
            title="Play Offline"
            badge="FREE"
            value={value.options.playOffline}
            onToggle={() =>
              onChange({
                ...value,
                options: { ...value.options, playOffline: !value.options.playOffline },
              })
            }
          />

          <OptionCard
            title="Streaming"
            badge="+10%"
            value={value.options.streaming}
            onToggle={() =>
              onChange({
                ...value,
                options: { ...value.options, streaming: !value.options.streaming },
              })
            }
          />

          <OptionCard
            title="Express Delivery"
            badge="+20%"
            value={value.options.expressDelivery}
            onToggle={() =>
              onChange({
                ...value,
                options: { ...value.options, expressDelivery: !value.options.expressDelivery },
              })
            }
          />

          <div className="lg:col-span-1">
            <OptionCard
              title="Duo Queue"
              badge="+20%"
              value={value.options.coachingDuo}
              onToggle={() =>
                onChange({
                  ...value,
                  options: { ...value.options, coachingDuo: !value.options.coachingDuo },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
