import { NextResponse } from "next/server";
import { getOrder, updateOrder, expireOrdersNow } from "@/lib/orders";
import { sendDiscord } from "@/lib/discord";

export async function POST(req: Request) {
  try {
    // Süresi dolanları otomatik expire et
    expireOrdersNow();

    const body = await req.json().catch(() => ({}));
    const { orderId, txHash, proofLink, contact } = body ?? {};

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "expired") {
      return NextResponse.json(
        { ok: false, error: "Order expired" },
        { status: 400 }
      );
    }

    if (order.status === "completed") {
      return NextResponse.json(
        { ok: false, error: "Order already completed" },
        { status: 400 }
      );
    }

    if (
      !String(txHash ?? "").trim() &&
      !String(proofLink ?? "").trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "Provide tx hash or proof link" },
        { status: 400 }
      );
    }

    // Order'ı güncelle
    const updated = updateOrder(orderId, {
      status: "proof_submitted",
      proof: {
        txHash: String(txHash ?? "").trim() || undefined,
        proofLink: String(proofLink ?? "").trim() || undefined,
        contact: String(contact ?? "").trim() || undefined,
        submittedAt: Date.now(),
      },
    });

    // Discord mesajı (detaylı)
    const lines = [
      "✅ **PROOF SUBMITTED**",
      `🆔 Order: **${orderId}**`,
      `📧 Email: ${order.email}`,
      `📦 Item: ${order.item?.label ?? "-"}`,
      `💰 Price: $${order.item?.price}`,
      `💳 Method: ${order.payment?.network ?? "-"}`,
    ];

    if (order.payment?.network === "PayPal") {
      lines.push(
        "",
        "⚠️ **PAYPAL RULES**",
        "- NO NOTES or NOTE AS GIFT",
        "- Send as **Friends & Family** only",
        "- If sent as **Goods & Services → USER WILL BE BANNED**"
      );
    }

    if (txHash) lines.push(`🔗 TX Hash: ${txHash}`);
    if (proofLink) lines.push(`🔗 Proof Link: ${proofLink}`);
    if (contact) lines.push(`👤 Contact: ${contact}`);

    await sendDiscord(lines.join("\n"));

    return NextResponse.json({ ok: true, order: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
