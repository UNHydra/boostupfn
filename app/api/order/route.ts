import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";
import { createOrder } from "@/lib/orders";
import type { Order } from "@/types/order";
import { sendDiscord } from "@/lib/discord";

function getExpireMinutes() {
  const v = Number(process.env.ORDER_EXPIRES_MINUTES ?? "5");
  return Number.isFinite(v) && v > 0 ? v : 5;
}

function formatRankLabel(rank?: string, div?: string | null) {
  if (!rank) return "";
  const pretty = rank.charAt(0).toUpperCase() + rank.slice(1);
  return div ? `${pretty} ${div}` : pretty;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productSlug, variantId, email, paymentMethod, coin, rankedConfig } = body ?? {};

    if (!productSlug || !variantId || !email || !String(email).includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    // PayPal is Discord-only for now (do not create order via API)
    if (paymentMethod === "paypal") {
      return NextResponse.json(
        { ok: false, error: "PayPal is currently available via Discord only." },
        { status: 400 }
      );
    }

    const product = PRODUCTS.find((p) => p.slug === String(productSlug));
    const variant = product?.variants?.find((v) => v.id === String(variantId));
    if (!product || !variant) {
      return NextResponse.json({ ok: false, error: "Product/variant not found" }, { status: 404 });
    }

    const selectedCoin = String(coin ?? "USDT").toUpperCase();
    const baseNetwork = process.env.NEXT_PUBLIC_PAYMENT_NETWORK ?? "TRC20";
    const baseAddress = process.env.NEXT_PUBLIC_PAYMENT_ADDRESS ?? "YOUR_WALLET_ADDRESS";

    const expiresAt = Date.now() + getExpireMinutes() * 60 * 1000;
    const orderId = `ORD-${Date.now()}`;

    const isRanked = String(productSlug) === "ranked-boost";

    // ✅ Ranked summary
    const rankedSummary =
      isRanked && rankedConfig
        ? `${formatRankLabel(rankedConfig.currentRank, rankedConfig.currentDiv)} -> ${formatRankLabel(
            rankedConfig.desiredRank,
            rankedConfig.desiredDiv
          )}`
        : null;

    // ✅ Ranked meta
    const rankedMeta =
      isRanked && rankedConfig
        ? `Region: ${rankedConfig.region}\nMode: ${rankedConfig.mode}\nPlatform: ${rankedConfig.platform}\nOptions: ${JSON.stringify(
            rankedConfig.options
          )}`
        : null;

    // ✅ PRICE: şimdilik 30$
    const finalPrice = isRanked ? 30 : variant.price;
    const finalMsrp = isRanked ? 30 : variant.msrp;

    const order: Order = {
      id: orderId,
      email: String(email).trim(),
      status: "waiting_payment",
      item: {
        productSlug: String(productSlug),
        variantId: String(variantId),
        // ✅ Ranked ise label summary olsun
        label: isRanked ? `Ranked Boost (${rankedSummary ?? "Config missing"})` : variant.label ?? (variant.amount ? `${variant.amount} V-Bucks` : "Item"),
        price: finalPrice,
        msrp: finalMsrp,
      },
      payment: {
        network: `${selectedCoin} (${baseNetwork})`,
        address: baseAddress,
        amount: finalPrice,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt,
    };

    createOrder(order);

    // ✅ Discord message: ranked bilgisi burada doğru gidecek
    const discordText = [
      "🟢 NEW ORDER",
      `ID: ${orderId}`,
      `Email: ${order.email}`,
      `Product: ${order.item.productSlug}`,
      `Item: ${order.item.label}`,
      `Price: $${order.payment.amount}`,
      `Pay: ${order.payment.network}`,
      `Address: ${order.payment.address}`,
      `Expires: ${new Date(expiresAt).toLocaleString()}`,
      rankedSummary ? `\n🎮 Ranked: ${rankedSummary}` : "",
      rankedMeta ? `\n${rankedMeta}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await sendDiscord(discordText);

    return NextResponse.json({
      ok: true,
      orderId,
      expiresAt,
      payment: order.payment,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
