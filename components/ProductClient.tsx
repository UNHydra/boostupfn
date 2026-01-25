"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import OrderBox, { type LevelConfigValue } from "@/components/OrderBox";
import LevelConfigurator from "@/components/LevelConfigurator";
import RankedConfigurator, { type RankedConfigValue } from "@/components/RankedConfigurator";
import WinConfigurator from "@/components/WinsConfigurator";
import type { WinBoostConfig } from "@/lib/pricing";

export type RankedConfig = {
  currentRank: string;
  currentDiv: string | null;
  desiredRank: string;
  desiredDiv: string | null;
};

export default function ProductClient({ product }: { product: Product }) {
  const isRanked = product.slug === "ranked-boost";
  const isWinBoost = product.slug === "win-boost";
  const isLevel = product.slug === "level-boost";

  const [rankedConfig, setRankedConfig] = useState<RankedConfigValue>({
    currentRank: "bronze",
    currentDiv: "I",
    desiredRank: "unreal",
    desiredDiv: null,

    region: "europe",
    mode: "battle-royale",
    platform: "pc",
    options: {
      playOffline: true,
      streaming: false,
      expressDelivery: false,
      coachingDuo: false,
    },
  });

  const [winConfig, setWinConfig] = useState<WinBoostConfig>({
    currentWins: 0,
    desiredWins: 10,
    winType: "regular",
    platform: "pc",
    options: {
      duo: false,
      selfPlay: false,
    },
  });

  // ✅ Level Boost state
  const [levelConfig, setLevelConfig] = useState<LevelConfigValue>({
    currentLevel: 1,
    desiredLevel: 100,
    platform: "pc",
  });

  const levelError = useMemo(() => {
    if (!isLevel) return null;
    const cur = Number(levelConfig.currentLevel || 1);
    const des = Number(levelConfig.desiredLevel || 1);
    if (des <= cur) return "Desired level must be higher than current level.";
    return null;
  }, [isLevel, levelConfig]);

  // ✅ Ranked Boost + Level Boost: iki kolon (sol panel + sağ order)
  if (isRanked || isLevel) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold">{product.title}</h1>

            {product.subtitle ? <p className="text-white/70">{product.subtitle}</p> : null}

            {/* ✅ Ranked configurator */}
            {isRanked ? (
              <div className="mt-6">
                <RankedConfigurator value={rankedConfig} onChange={setRankedConfig} />
              </div>
            ) : null}

            {/* ✅ Level configurator (DUAL SLIDER COMPONENT) */}
            {isLevel ? (
              <div className="mt-6">
                <LevelConfigurator value={levelConfig} onChange={setLevelConfig} />
                {levelError ? <div className="mt-3 text-sm font-semibold text-red-300">{levelError}</div> : null}
              </div>
            ) : null}

            {product.description?.length ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
                {product.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* RIGHT */}
          <div>
            <OrderBox
              product={product}
              rankedConfig={isRanked ? rankedConfig : undefined}
              levelConfig={isLevel ? levelConfig : undefined}
            />
          </div>
        </div>
      </main>
    );
  }

  // ✅ Win Boost: sol configurator + sağ order
  if (isWinBoost) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold">{product.title}</h1>
            {product.subtitle ? <p className="text-white/70">{product.subtitle}</p> : null}

            <div className="mt-6">
              <WinConfigurator value={winConfig} onChange={setWinConfig} />
            </div>

            {product.description?.length ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
                {product.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* RIGHT */}
          <div>
            <OrderBox product={product} winConfig={winConfig} />
          </div>
        </div>
      </main>
    );
  }

  // ✅ V-Bucks / Crew: OrderBox tam genişlikte (kendi içinde grid yapsın)
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">{product.title}</h1>
        {product.subtitle ? <p className="text-white/70">{product.subtitle}</p> : null}

        {product.description?.length ? (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
            {product.description.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-8">
        <OrderBox product={product} />
      </div>
    </main>
  );
}
