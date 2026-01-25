import { NextResponse } from "next/server";
import { getOrders, setOrdersStatus, expireOrdersNow } from "@/lib/orders";
import { sendDiscord } from "@/lib/discord";

function isAuthed(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;

  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${token}`;
}

export async function GET(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // her admin refresh’te expire kontrolü
  try {
    expireOrdersNow();
  } catch {}

  const orders = getOrders();
  return NextResponse.json({ ok: true, orders });
}

export async function PATCH(req: Request) {
  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const orderId = String(body?.orderId ?? "").trim();
  const status = String(body?.status ?? "").trim(); // completed | rejected | expired
  const reason = typeof body?.reason === "string" ? body.reason.trim() : undefined;

  if (!orderId || !status) {
    return NextResponse.json({ ok: false, error: "Missing orderId/status" }, { status: 400 });
  }

  const allowed = ["completed", "rejected", "expired"] as const;
  if (!allowed.includes(status as any)) {
    return NextResponse.json(
      { ok: false, error: `Invalid status. Use: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }

  // expire’ı önce güncelle (admin işlem yapmadan)
  try {
    expireOrdersNow();
  } catch {}

  // ✅ senin lib fonksiyonun: setOrdersStatus(orderId, status, reason?)
  const updated =
    status === "rejected"
      ? setOrdersStatus(orderId, "rejected", reason || "Rejected by admin.")
      : status === "expired"
      ? setOrdersStatus(orderId, "expired", reason || "Expired by admin.")
      : setOrdersStatus(orderId, "completed");

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  // discord bildirimi (patlamasın diye try/catch)
  try {
    const msg =
      status === "completed"
        ? `✅ **COMPLETED**\n**Order:** ${updated.id}\n**Email:** ${updated.email}\n**Item:** ${updated.item?.label ?? "-"}\n**Price:** $${updated.item?.price ?? "-"}`
        : status === "expired"
        ? `⏳ **EXPIRED**\n**Order:** ${updated.id}\n**Email:** ${updated.email}\n**Item:** ${updated.item?.label ?? "-"}\n**Reason:** ${updated.rejectReason ?? "Expired"}`
        : `❌ **REJECTED**\n**Order:** ${updated.id}\n**Email:** ${updated.email}\n**Item:** ${updated.item?.label ?? "-"}\n**Reason:** ${updated.rejectReason ?? "Rejected"}`;

    await sendDiscord(msg);
  } catch {}

  return NextResponse.json({ ok: true, order: updated });
}
