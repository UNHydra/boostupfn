"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, Variant } from "@/types/product";
import { formatUSD } from "@/lib/money";
import { calculateRankedPrice } from "@/lib/pricing";
import { calculateWinBoostPrice } from "@/lib/pricing";

const DISCORD_INVITE = "https://discord.gg/g4UyGv7Smj";
const BRAND = "BoostUP";

function percentOff(msrp: number, price: number) {
  if (!msrp || msrp <= 0) return 0;
  const off = Math.round(((msrp - price) / msrp) * 100);
  return off < 0 ? 0 : off;
}

type PaymentInfo = {
  network: string;
  address: string;
  amount: number;
};

type PaymentMethod = "crypto" | "paypal";

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function rankLabel(rankKey?: string, div?: string | null) {
  if (!rankKey) return "";
  const pretty = rankKey.charAt(0).toUpperCase() + rankKey.slice(1);
  return div ? `${pretty} ${div}` : pretty;
}

/* ✅ Level Boost types + helpers */
type LevelPlatformKey = "pc" | "playstation" | "xbox" | "switch";
export type LevelConfigValue = {
  currentLevel: number;
  desiredLevel: number;
  platform: LevelPlatformKey;
};

/**
 * 1 -> 100 = $10 (matematiksel esit dagitim)
 * delta = desired - current
 */
function calculateLevelPrice(cfg: LevelConfigValue) {
  const cur = Math.max(1, Math.min(200, Number(cfg.currentLevel || 1)));
  const des = Math.max(1, Math.min(200, Number(cfg.desiredLevel || 1)));
  const delta = Math.max(0, des - cur);
  const perLevel = 10 / 99;
  const raw = delta * perLevel;
  return Math.round(raw * 100) / 100;
}

export default function OrderBox({
  product,
  rankedConfig,
  levelConfig,
  winConfig,
}: {
  product: Product;
  rankedConfig?: any;
  levelConfig?: LevelConfigValue;
  winConfig?: any;
}) {
  const isRanked = product.slug === "ranked-boost";
  const isLevel = product.slug === "level-boost";
  const isWinBoost = product.slug === "win-boost";

  const variants = product.variants ?? [];
  const defaultVariant = variants[0];

  const [selectedId, setSelectedId] = useState<string>(defaultVariant?.id ?? "");
  const [email, setEmail] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [coin, setCoin] = useState("USDT");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);

  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  const [txHash, setTxHash] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [contact, setContact] = useState("");
  const [proofSent, setProofSent] = useState(false);

  // ✅ NEW: Payment/Proof modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const selected: Variant | undefined = useMemo(() => {
    return variants.find((v) => v.id === selectedId) ?? defaultVariant;
  }, [variants, selectedId, defaultVariant]);

  const rankedSummary =
    isRanked && rankedConfig
      ? `${rankLabel(rankedConfig.currentRank, rankedConfig.currentDiv)} → ${rankLabel(
          rankedConfig.desiredRank,
          rankedConfig.desiredDiv
        )}`
      : null;

  const levelSummary =
    isLevel && levelConfig ? `Level ${levelConfig.currentLevel} → Level ${levelConfig.desiredLevel}` : null;

  const winSummary =
    isWinBoost && winConfig ? `${Number(winConfig.currentWins ?? 0)} → ${Number(winConfig.desiredWins ?? 0)} wins` : null;

  const isCrewSelected = !!selected?.id?.startsWith("crew");
  const selectedLabel =
    isRanked
      ? "Fortnite Ranked Boost"
      : isLevel
      ? "Fortnite Level Boost"
      : isWinBoost
      ? "Fortnite Win Boost"
      : isCrewSelected
      ? "Fortnite Crew - 1 Month"
      : `${selected?.amount ?? ""} V-Bucks`;

  const rankedPrice = useMemo(() => {
    if (!isRanked) return null;
    if (!rankedConfig) return null;
    return calculateRankedPrice(rankedConfig);
  }, [isRanked, rankedConfig]);

  const levelPrice = useMemo(() => {
    if (!isLevel) return null;
    if (!levelConfig) return null;
    return calculateLevelPrice(levelConfig);
  }, [isLevel, levelConfig]);

  const winPrice = useMemo(() => {
    if (!isWinBoost) return null;
    if (!winConfig) return null;
    return calculateWinBoostPrice(winConfig);
  }, [isWinBoost, winConfig]);

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const timeLeftMs = expiresAt ? expiresAt - now : null;
  const isExpiredClient = !!(expiresAt && timeLeftMs !== null && timeLeftMs <= 0);

  if (!selected) {
    return (
      <div className="premium-transition premium-card relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="premium-transition premium-card pointer-events-none absolute inset-x-0 top-[-40px] h-24 bg-violet-500/10 blur-[40px]" />
        <div className="premium-transition premium-card text-lg font-bold">Order</div>
        <div className="premium-transition premium-card mt-4 text-sm text-white/70">This product has no selectable options yet.</div>
      </div>
    );
  }

  const off = percentOff(selected.msrp, selected.price);
  const save = Math.max(0, selected.msrp - selected.price);

  const displayPrice = isRanked ? rankedPrice : isLevel ? levelPrice : isWinBoost ? winPrice : selected.price;

  async function createOrder() {
    setServerError(null);
    setProofSent(false);

    if (paymentMethod === "paypal") return;

    if (!selectedId) {
      setServerError("Please select an option.");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setServerError("Please enter a valid email.");
      return;
    }

    if (!coin) {
      setServerError("Please select a coin.");
      return;
    }

    if (isRanked && (!rankedConfig || rankedPrice === null || rankedPrice <= 0)) {
      setServerError("Please select valid ranks first.");
      return;
    }

    if (isLevel) {
      if (!levelConfig) {
        setServerError("Please select valid levels first.");
        return;
      }
      const cur = Number(levelConfig.currentLevel || 1);
      const des = Number(levelConfig.desiredLevel || 1);
      if (!Number.isFinite(cur) || !Number.isFinite(des) || des <= cur) {
        setServerError("Desired level must be higher than current level.");
        return;
      }
      if (levelPrice === null || levelPrice <= 0) {
        setServerError("Please select valid levels first.");
        return;
      }
    }

    if (isWinBoost) {
      if (!winConfig) {
        setServerError("Please select valid wins first.");
        return;
      }
      const curW = Number(winConfig.currentWins ?? 0);
      const desW = Number(winConfig.desiredWins ?? 0);
      if (!Number.isFinite(curW) || !Number.isFinite(desW) || desW <= curW) {
        setServerError("Desired wins must be higher than current wins.");
        return;
      }
      if (winPrice === null || winPrice <= 0) {
        setServerError("Please select valid wins first.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          variantId: selectedId,
          email: cleanEmail,
          paymentMethod,
          coin: paymentMethod === "crypto" ? coin : undefined,
          rankedConfig: isRanked ? rankedConfig : undefined,
          levelConfig: isLevel ? levelConfig : undefined,
          winConfig: isWinBoost ? winConfig : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setServerError(data?.error ?? "Order failed");
        return;
      }

      setOrderId(data.orderId);
      setPayment(data.payment);
      setExpiresAt(typeof data.expiresAt === "number" ? data.expiresAt : null);

      setTxHash("");
      setProofLink("");
      setContact("");

      // ✅ NEW: open modal instead of expanding page
      setShowPaymentModal(true);
    } catch {
      setServerError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function sendProof() {
    setServerError(null);

    if (!orderId) {
      setServerError("Create an order first.");
      return;
    }

    if (isExpiredClient) {
      setServerError("Order expired. Please create a new order.");
      return;
    }

    if (!txHash.trim() && !proofLink.trim()) {
      setServerError("Please provide tx hash or proof link.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/order/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          txHash: txHash.trim() || undefined,
          proofLink: proofLink.trim() || undefined,
          contact: contact.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setServerError(data?.error ?? "Failed to submit proof");
        return;
      }

      setProofSent(true);
    } catch {
      setServerError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const disableBuyNow =
    loading ||
    paymentMethod === "paypal" ||
    (isRanked && (!rankedConfig || rankedPrice === null || rankedPrice <= 0)) ||
    (isLevel && (!levelConfig || levelPrice === null || levelPrice <= 0)) ||
    (isWinBoost && (!winConfig || winPrice === null || winPrice <= 0));

  return (
    <>
      {/* ✅ NEW: Payment/Proof MODAL (prevents page from getting super tall) */}
      {showPaymentModal && orderId && payment ? (
        <div className="fixed inset-0 z-[999]">
          {/* backdrop */}
          <div
            className="premium-transition premium-card absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />

          {/* panel */}
          <div className="relative mx-auto mt-10 w-[92vw] max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="text-sm font-extrabold text-white">Payment & Proof</div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="premium-transition premium-hover rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/80 hover:bg-white/10"
              >
                Close ✕
              </button>
            </div>

            {/* ✅ scroll inside modal */}
            <div className="max-h-[78vh] overflow-y-auto p-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-bold">Payment</div>

                <div className="mt-2 space-y-1 text-sm text-white/80">
                  <div>
                    <span className="text-white/60">Order:</span> <b>{orderId}</b>
                  </div>
                  <div>
                    <span className="text-white/60">Item:</span> <b>{selectedLabel}</b>
                  </div>

                  {rankedSummary ? (
                    <div>
                      <span className="text-white/60">Ranks:</span> <b>{rankedSummary}</b>
                    </div>
                  ) : null}

                  {levelSummary ? (
                    <div>
                      <span className="text-white/60">Levels:</span> <b>{levelSummary}</b>
                    </div>
                  ) : null}

                  {winSummary ? (
                    <div>
                      <span className="text-white/60">Wins:</span> <b>{winSummary}</b>
                    </div>
                  ) : null}

                  {expiresAt ? (
                    <div>
                      <span className="text-white/60">Time left:</span>{" "}
                      <b className={isExpiredClient ? "text-red-300" : ""}>
                        {isExpiredClient ? "Expired" : formatCountdown(timeLeftMs ?? 0)}
                      </b>
                      <div className="text-xs text-white/50">Submit proof before the timer ends.</div>
                    </div>
                  ) : null}

                  <div className="pt-2">
                    Send exactly <b>${payment.amount}</b> via <b>{payment.network}</b> to:
                  </div>
                </div>

                <div className="mt-2 break-all rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs">
                  {payment.address}
                </div>

                {/* Discord “come join” box */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-bold">Need help?</div>
                  <div className="mt-1 text-xs text-white/70">
                    Join <b>{BRAND}</b> Discord and open a ticket with your <b>Order ID</b>.
                  </div>
                  <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  >
                    Join Discord
                  </a>
                </div>

                <div className="mt-4 text-xs text-white/60">
                  After sending payment, submit TX hash or explorer link (and optionally your Discord).
                </div>

                <div className="mt-3 space-y-2">
                  <input
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="TX hash (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
                  />
                  <input
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    placeholder="Explorer link / screenshot link (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
                  />
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Discord username or email (optional)"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
                  />

                  <button
                    onClick={sendProof}
                    disabled={loading || isExpiredClient}
                    className="premium-transition premium-hover w-full rounded-2xl bg-white/15 py-3 font-extrabold text-white disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "I sent payment (Submit proof)"}
                  </button>

                  {proofSent ? (
                    <div className="text-sm font-semibold text-green-300">
                      ✅ Proof received. To speed up verification, please message us on Discord with your Order ID:{" "}
                      <b>{orderId}</b>.{" "}
                      <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="underline text-green-200">
                        Join Discord
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* SELECT AMOUNT (V-Bucks / Crew) */}
        {!isRanked && !isLevel && !isWinBoost ? (
          <div className="w-full min-w-0 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white/80">Select amount</div>

            <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3">
              {variants.map((v) => {
                const vOff = percentOff(v.msrp, v.price);
                const active = v.id === selectedId;

                const isCrew = v.id.startsWith("crew");
                const topTitle = isCrew ? "Fortnite Crew" : String(v.amount || "");
                const subTitle = isCrew ? "Crew Pack" : "V-Bucks";
                const displayLabel = isCrew ? "1 Month" : "";

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(v.id);
                      setOrderId(null);
                      setPayment(null);
                      setExpiresAt(null);
                      setTxHash("");
                      setProofLink("");
                      setContact("");
                      setProofSent(false);
                      setServerError(null);

                      // ✅ NEW: close modal on option change
                      setShowPaymentModal(false);
                    }}
                    className={[
                      "premium-transition premium-hover min-w-0 overflow-hidden rounded-2xl border p-4 text-left transition",
                      "hover:-translate-y-[1px] active:translate-y-0",
                      "active:scale-[0.99]",
                      active ? "border-white/30 bg-white/10" : "border-white/10 bg-black/10 hover:bg-white/10",
                      isCrew ? "md:col-span-2" : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold leading-tight">{topTitle}</div>
                      <div className="truncate text-xs text-white/60 leading-tight">{subTitle}</div>
                      {displayLabel ? <div className="truncate text-xs text-white/60 leading-tight">{displayLabel}</div> : null}
                    </div>

                    <div className="mt-3 min-w-0">
                      <div className="truncate text-sm line-through text-white/40">{formatUSD(v.msrp)}</div>
                      <div className="mt-1 truncate text-lg font-extrabold">{formatUSD(v.price)}</div>
                    </div>

                    <div className="mt-3 inline-flex max-w-full items-center rounded-full bg-green-500/15 px-2 py-1 text-xs font-bold text-green-300">
                      <span className="truncate">{vOff}% OFF</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* ORDER */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 lg:min-w-[360px] overflow-hidden">
  {/* ✅ premium top line + glow */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    <div className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-violet-500/12 blur-3xl" />
    <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-[90px]" />
  </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">Order</div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70">
              Premium Service
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-4">
  <div className="flex items-end justify-between gap-4">
    <div>
      <div className="text-xs font-semibold text-white/60">Price</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight">
        {formatUSD(displayPrice ?? 0)}
      </div>
      <div className="mt-1 text-xs text-white/45">excl VAT</div>
    </div>

    {/* ✅ small badge */}
    <div className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[11px] font-extrabold text-violet-200">
      Secure Checkout
    </div>
  </div>
</div>


          {/* Trust bar */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-white/80">
              ✅ Guaranteed service
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-white/80">
              🔒 Safety method
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-white/80">
              ⚡ Fast start
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-white/80">
              💬 Live support
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Delivery time</span>
              <span className="font-semibold">{selected.deliveryTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Delivery method</span>
              <span className="font-semibold text-blue-300">{selected.deliveryMethod}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total</span>

              <div className="text-right">
                {!isRanked && !isLevel && !isWinBoost ? (
                  <>
                    <div className="text-sm line-through text-white/40">{formatUSD(selected.msrp)}</div>

                    <div className="flex items-center justify-end gap-2">
                      <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs font-bold text-green-300">
                        {off}% OFF
                      </span>
                      <span className="text-xl font-extrabold">{formatUSD(selected.price)}</span>
                    </div>

                    <div className="mt-1 text-xs font-semibold text-green-300">You save {formatUSD(save)}</div>
                  </>
                ) : (
                  <div className="text-xl font-extrabold">{formatUSD(displayPrice ?? 0)}</div>
                )}
              </div>
            </div>

            {rankedSummary ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                <div className="font-bold text-white/90">Selected ranks</div>
                <div className="mt-1">{rankedSummary}</div>
              </div>
            ) : null}

            {levelSummary ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                <div className="font-bold text-white/90">Selected levels</div>
                <div className="mt-1">{levelSummary}</div>
              </div>
            ) : null}

            {winSummary ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
                <div className="font-bold text-white/90">Selected wins</div>
                <div className="mt-1">{winSummary}</div>
              </div>
            ) : null}

            {/* Payment method */}
            <div className="mt-4">
              <label className="text-xs text-white/60">Payment method</label>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={[
                    "premium-transition premium-hover premium-cta rounded-2xl border px-4 py-3 text-sm font-bold transition",
                    paymentMethod === "crypto" ? "border-white/30 bg-white/10" : "border-white/10 bg-black/30 hover:bg-white/10",
                  ].join(" ")}
                >
                  Crypto
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={[
                    "premium-transition premium-hover premium-cta rounded-2xl border px-4 py-3 text-sm font-bold transition",
                    paymentMethod === "paypal" ? "border-white/30 bg-white/10" : "border-white/10 bg-black/30 hover:bg-white/10",
                  ].join(" ")}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === "crypto" ? (
                <div className="mt-3">
                  <label className="text-xs text-white/60">Select coin</label>

                  <select
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25"
                  >
                    <option value="USDT">USDT</option>
                    <option value="TRX">TRX</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="LTC">LTC</option>
                    <option value="BNB">BNB</option>
                    <option value="SOL">SOL</option>
                    <option value="TON">TON</option>
                    <option value="XRP">XRP</option>
                    <option value="DOGE">DOGE</option>
                  </select>
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <div className="font-bold">PayPal orders</div>
                  <p className="mt-1 text-white/70">
                    PayPal payments are currently available <b>via Discord only</b>.
                    <br />
                    Please join our Discord server and send us a message to place your order.
                  </p>

                  <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-[0.99] shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                  >
                    Join {BRAND} Discord
                  </a>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="text-xs text-white/60">Your email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                disabled={paymentMethod === "paypal"}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-white/25 disabled:opacity-60"
              />
            </div>

            {/* Buy now */}
            <button
              onClick={createOrder}
              disabled={disableBuyNow}
              className="premium-transition premium-hover premium-cta mt-4 w-full rounded-2xl bg-lime-500 py-3 font-extrabold text-black transition hover:brightness-110 active:scale-[0.99] active:brightness-95 shadow-[0_10px_30px_rgba(0,0,0,0.35)] disabled:opacity-60"
            >
              {loading ? "Processing..." : "Buy now"}
            </button>

            <div className="mt-3 space-y-1 text-xs text-white/60">
              <div>🔒 Secure checkout • Price locked for 30 minutes</div>
              <div>⚡ Fast start after proof • Average response: 5-15 min on Discord</div>
              <div>💬 Need help? Open a ticket on Discord with your Order ID</div>
            </div>

            {serverError ? <div className="mt-3 text-sm font-semibold text-red-300">{serverError}</div> : null}

            {/* ✅ NEW: compact “payment created” box instead of huge section */}
            {orderId && payment ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">Payment created</div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="premium-transition premium-hover text-xs font-bold text-violet-200 underline underline-offset-2 hover:text-violet-100"
                  >
                    Open details
                  </button>
                </div>
                <div className="mt-2 text-xs text-white/70">
                  Order: <b className="text-white/90">{orderId}</b>
                  {expiresAt ? (
                    <>
                      {" "}
                      • Time left:{" "}
                      <b className={isExpiredClient ? "text-red-300" : "text-white/90"}>
                        {isExpiredClient ? "Expired" : formatCountdown(timeLeftMs ?? 0)}
                      </b>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-4 space-y-1 text-xs text-white/55">
              <div>✅ Money-back Guarantee</div>
              <div>⚡ Fast Checkout Options</div>
              <div>💬 24/7 Discord Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
