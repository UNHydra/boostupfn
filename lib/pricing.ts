// lib/pricing.ts
// Anchors:
// 1) Bronze -> Unreal total = 30$
// 2) Elite  -> Unreal total = 15$
// => Bronze -> Elite total = 15$
//
// Division fix:
// Treat every division as a step in a ladder (Bronze I -> Bronze II -> ... -> Diamond III -> Elite -> Champion -> Unreal)

const RANKS_WITH_DIVS = ["bronze", "silver", "gold", "platinum", "diamond"] as const;
const RANKS_NO_DIVS = ["elite", "champion", "unreal"] as const;

type RankWithDiv = (typeof RANKS_WITH_DIVS)[number];
type RankNoDiv = (typeof RANKS_NO_DIVS)[number];
export type RankKey = RankWithDiv | RankNoDiv;
export type Division = "I" | "II" | "III" | null;

// ✅ Config side types (match your RankedConfigurator)
export type RegionKey = "europe" | "na-east" | "na-west" | "asia" | "oce" | "br";
export type ModeKey = "battle-royale" | "zero-build";
export type PlatformKey = "pc" | "xbox" | "playstation" | "switch";

const PRICE_BRONZE_TO_UNREAL = 30;
const PRICE_ELITE_TO_UNREAL = 15;
const PRICE_BRONZE_TO_ELITE = PRICE_BRONZE_TO_UNREAL - PRICE_ELITE_TO_UNREAL; // 15

// Base difficulty per rank (tweak later if needed)
const RANK_WEIGHT: Record<RankKey, number> = {
  bronze: 1.0,
  silver: 1.1,
  gold: 1.2,
  platinum: 1.35,
  diamond: 1.55,
  elite: 2.0,
  champion: 2.3,
  unreal: 2.8,
};

// How we split a rank's difficulty across division steps vs promotion step:
// I -> II, II -> III, III -> nextRank(I)
const DIV_STEP_FACTOR = 0.28; // each division step weight = rankWeight * this
const PROMO_STEP_FACTOR = 0.44; // promotion step (III -> next rank I) = rankWeight * this
// Total for a div rank ~= rankWeight*(0.28+0.28+0.44) = rankWeight*1.0

type NodeKey = string;

function nodeKey(rank: RankKey, div: Division): NodeKey {
  if (rank === "elite" || rank === "champion" || rank === "unreal") return rank;
  return `${rank}-${div ?? "I"}`;
}

function isDivRank(rank: RankKey): rank is RankWithDiv {
  return (RANKS_WITH_DIVS as readonly string[]).includes(rank);
}

function normalizeRankDiv(rank: RankKey, div: Division): { rank: RankKey; div: Division } {
  if (isDivRank(rank)) return { rank, div: div ?? "I" };
  return { rank, div: null };
}

function buildLadder(): { nodes: NodeKey[]; stepWeights: number[] } {
  const nodes: NodeKey[] = [];
  const stepWeights: number[] = [];
  const divs: Exclude<Division, null>[] = ["I", "II", "III"];

  // bronze..diamond with divisions
  for (let rIndex = 0; rIndex < RANKS_WITH_DIVS.length; rIndex++) {
    const r = RANKS_WITH_DIVS[rIndex];
    for (let dIndex = 0; dIndex < divs.length; dIndex++) nodes.push(nodeKey(r, divs[dIndex]));

    // I->II, II->III
    stepWeights.push(RANK_WEIGHT[r] * DIV_STEP_FACTOR);
    stepWeights.push(RANK_WEIGHT[r] * DIV_STEP_FACTOR);

    // III->next rank I (or Elite after diamond)
    stepWeights.push(RANK_WEIGHT[r] * PROMO_STEP_FACTOR);
  }

  // after diamond-III comes elite
  nodes.push("elite");

  // elite -> champion -> unreal (single steps)
  nodes.push("champion");
  stepWeights.push(RANK_WEIGHT["elite"]); // elite->champion

  nodes.push("unreal");
  stepWeights.push(RANK_WEIGHT["champion"]); // champion->unreal

  return { nodes, stepWeights };
}

const LADDER = buildLadder();

function idxOfNode(rank: RankKey, div: Division) {
  const n = normalizeRankDiv(rank, div);
  const key = nodeKey(n.rank, n.div);
  return LADDER.nodes.indexOf(key);
}

function sumStepWeights(fromIndex: number, toIndex: number) {
  if (toIndex <= fromIndex) return 0;
  let s = 0;
  for (let i = fromIndex; i < toIndex; i++) s += LADDER.stepWeights[i] ?? 0;
  return s;
}

function clamp2(n: number) {
  return Math.round(n * 100) / 100;
}

// -------------------------
// ✅ Multipliers
// -------------------------

// Region multipliers (tweak freely)
const REGION_MULT: Record<RegionKey, number> = {
  europe: 1.0,
  "na-east": 1.05,
  "na-west": 1.05,
  asia: 1.07,
  oce: 1.08,
  br: 1.06,
};

// Mode multipliers (example: Zero Build a bit harder)
const MODE_MULT: Record<ModeKey, number> = {
  "battle-royale": 1.0,
  "zero-build": 1.05,
};

// Platform multipliers (console slightly harder)
const PLATFORM_MULT: Record<PlatformKey, number> = {
  pc: 1.0,
  xbox: 1.08,
  playstation: 1.08,
  switch: 1.1,
};

function applyMultipliers(price: number, config: any) {
  let p = price;

  // region/mode/platform
  const region = config?.region as RegionKey | undefined;
  const mode = config?.mode as ModeKey | undefined;
  const platform = config?.platform as PlatformKey | undefined;

  if (region && REGION_MULT[region]) p *= REGION_MULT[region];
  if (mode && MODE_MULT[mode]) p *= MODE_MULT[mode];
  if (platform && PLATFORM_MULT[platform]) p *= PLATFORM_MULT[platform];

  // options
  const opts = config?.options;
  if (opts?.streaming) p *= 1.1;
  if (opts?.expressDelivery) p *= 1.2;
  if (opts?.coachingDuo) p *= 1.2;
  // playOffline = free (no multiplier)

  return p;
}

// -------------------------
// ✅ Main price
// -------------------------

export function calculateRankedPrice(config: {
  currentRank: RankKey;
  currentDiv: Division;
  desiredRank: RankKey;
  desiredDiv: Division;

  region?: RegionKey;
  mode?: ModeKey;
  platform?: PlatformKey;
  options?: {
    playOffline?: boolean;
    streaming?: boolean;
    expressDelivery?: boolean;
    coachingDuo?: boolean;
  };
}) {
  const from = normalizeRankDiv(config.currentRank, config.currentDiv);
  const to = normalizeRankDiv(config.desiredRank, config.desiredDiv);

  const fromIdx = idxOfNode(from.rank, from.div);
  const toIdx = idxOfNode(to.rank, to.div);

  if (fromIdx === -1 || toIdx === -1) return 0;
  if (toIdx <= fromIdx) return 0;

  // anchor split point: Elite node index
  const eliteIdx = LADDER.nodes.indexOf("elite");
  const unrealIdx = LADDER.nodes.indexOf("unreal");

  // total weights for each anchor segment
  const wBronzeEliteTotal = sumStepWeights(0, eliteIdx); // bronze-I -> elite
  const wEliteUnrealTotal = sumStepWeights(eliteIdx, unrealIdx); // elite -> unreal

  function segmentPrice(segFrom: number, segTo: number, segTotalWeight: number, segTotalPrice: number) {
    const w = sumStepWeights(segFrom, segTo);
    if (segTotalWeight <= 0) return 0;
    return (w / segTotalWeight) * segTotalPrice;
  }

  let basePrice = 0;

  // A) both below Elite
  if (toIdx <= eliteIdx) {
    basePrice = segmentPrice(fromIdx, toIdx, wBronzeEliteTotal, PRICE_BRONZE_TO_ELITE);
  }
  // B) below Elite -> above Elite
  else if (fromIdx < eliteIdx && toIdx > eliteIdx) {
    const p1 = segmentPrice(fromIdx, eliteIdx, wBronzeEliteTotal, PRICE_BRONZE_TO_ELITE);
    const p2 = segmentPrice(eliteIdx, toIdx, wEliteUnrealTotal, PRICE_ELITE_TO_UNREAL);
    basePrice = p1 + p2;
  }
  // C) both in Elite->Unreal
  else {
    basePrice = segmentPrice(fromIdx, toIdx, wEliteUnrealTotal, PRICE_ELITE_TO_UNREAL);
  }

  // ✅ apply region/mode/platform/options multipliers
  const final = applyMultipliers(basePrice, config);

  return clamp2(final);
}
// -------------------------
// ✅ Level Boost Pricing (linear)
// -------------------------

export type LevelBoostConfig = {
  currentLevel: number; // 1..200
  desiredLevel: number; // 1..200 (must be > currentLevel)
};

/**
 * Pricing rule:
 * 1 -> 100 costs $10 (linear distribution).
 * For any range: price = (desired-current)/(100-1) * 10
 * So 1->100 exactly = 10
 */
export function calculateLevelPrice(cfg: LevelBoostConfig) {
  const cur = Math.max(1, Math.min(200, Math.floor(cfg.currentLevel)));
  const des = Math.max(1, Math.min(200, Math.floor(cfg.desiredLevel)));

  if (des <= cur) return 0;

  const BASE_FROM = 1;
  const BASE_TO = 100;
  const BASE_PRICE = 10;

  const steps = des - cur;
  const baseSteps = BASE_TO - BASE_FROM; // 99 (so 1->100 = 99 steps)

  const raw = (steps / baseSteps) * BASE_PRICE;

  // round to 2 decimals
  return Math.round(raw * 100) / 100;
}

// =========================
// WIN BOOST PRICING (ADD)
// =========================

export type WinTypeKey = "regular" | "pub" | "blitz";
export type WinPlatformKey = "pc" | "xbox" | "playstation" | "switch";

export type WinBoostConfig = {
  currentWins: number;   // örn 0
  desiredWins: number;   // örn 10
  platform: WinPlatformKey;

  winType: WinTypeKey;   // regular | pub | blitz
  options: {
    duo: boolean;        // +$1 / win
    selfPlay: boolean;   // $6 / win (override)
  };
};

const WIN_BASE_PRICE: Record<WinTypeKey, number> = {
  regular: 4,
  pub: 3,
  blitz: 2,
};

function clampInt(n: any, min: number, max: number) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

// Bulk discount: örneğe göre 10 win = %10 indirim
function winBulkMultiplier(wins: number) {
  if (wins >= 50) return 0.8;
  if (wins >= 20) return 0.85;
  if (wins >= 10) return 0.9;   // ✅ 10 win -> %10 off
  if (wins >= 5) return 0.95;
  return 1;
}

function clamp2b(n: number) {
  return Math.round(n * 100) / 100;
}

export function calculateWinBoostPrice(cfg: WinBoostConfig) {
  const currentWins = clampInt(cfg.currentWins, 0, 9999);
  const desiredWins = clampInt(cfg.desiredWins, 0, 9999);

  const wins = Math.max(0, desiredWins - currentWins);
  if (wins <= 0) return 0;

  // base per win
  let perWin = WIN_BASE_PRICE[cfg.winType] ?? 4;

  // selfPlay override
  
  if (cfg.options?.selfPlay) perWin += 1;


  // duo add-on
  if (cfg.options?.duo) perWin += 1;

  const raw = wins * perWin;
  const discounted = raw * winBulkMultiplier(wins);

  return clamp2(discounted);
}

