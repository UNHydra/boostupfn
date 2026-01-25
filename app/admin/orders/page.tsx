"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/types/order";

export default function AdminOrdersPage() {
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setErr(data?.error ?? "Failed");
        setOrders([]);
        return;
      }
      setOrders(data.orders ?? []);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(orderId: string, status: "delivered" | "rejected") {
    const reason =
      status === "rejected" ? prompt("Reject reason? (optional)") ?? "" : "";

    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, status, reason }),
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) {
      alert(data?.error ?? "Failed");
      return;
    }
    await load();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 text-white">
      <h1 className="text-3xl font-extrabold">Admin Orders</h1>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-white/70">ADMIN_TOKEN</div>
        <div className="mt-2 flex gap-2">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste ADMIN_TOKEN"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
          />
          <button
            onClick={load}
            className="rounded-xl bg-lime-500 px-5 py-3 font-extrabold text-black"
          >
            Load
          </button>
        </div>
        {err ? <div className="mt-2 text-sm font-semibold text-red-300">{err}</div> : null}
      </div>

      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm text-white/60">{o.id}</div>
                <div className="text-lg font-bold">{o.item.label} — ${o.item.price}</div>
                <div className="text-sm text-white/70">{o.email}</div>
              </div>

              <div className="text-right">
                <div className="text-sm">
                  Status:{" "}
                  <span className="font-bold">{o.status}</span>
                </div>
                <div className="text-xs text-white/60">
                  Expires: {new Date(o.expiresAt).toLocaleString()}
                </div>
              </div>
            </div>

            {o.proof ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                <div className="text-xs text-white/60">Proof</div>
                <div className="mt-1 break-all">TX: {o.proof.txHash || "-"}</div>
                <div className="break-all">Link: {o.proof.proofLink || "-"}</div>
                <div className="break-all">Contact: {o.proof.contact || "-"}</div>
              </div>
            ) : null}

            {o.rejectReason ? (
              <div className="mt-2 text-sm text-red-300">
                Reason: {o.rejectReason}
              </div>
            ) : null}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setStatus(o.id, "delivered")}
                className="rounded-xl bg-green-500 px-4 py-2 font-bold text-black"
              >
                Mark Delivered
              </button>
              <button
                onClick={() => setStatus(o.id, "rejected")}
                className="rounded-xl bg-red-500 px-4 py-2 font-bold text-black"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {!loading && orders.length === 0 ? (
          <div className="text-white/60">No orders.</div>
        ) : null}
      </div>
    </div>
  );
}
