import fs from "fs";
import path from "path";
import type { Order } from "@/types/order";


const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

// read/write helpers
function readFileSafe(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_PATH)) return [];
    const raw = fs.readFileSync(ORDERS_PATH, "utf8");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFileSafe(orders: Order[]) {
  fs.mkdirSync(path.dirname(ORDERS_PATH), { recursive: true });
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
}

// ✅ her API çağrısında expire kontrolü
export function expireOrdersNow() {
  const now = Date.now();
  const orders = readFileSafe();
  let changed = false;

  for (const o of orders) {
    if (o.status === "waiting_payment" && now > o.expiresAt) {
      o.status = "expired";
      o.rejectReason = "Payment proof not submitted within time limit.";
      o.updatedAt = now;
      changed = true;
    }
  }

  if (changed) writeFileSafe(orders);
  return { changed, orders };
}

export function createOrder(order: Order) {
  const { orders } = expireOrdersNow();
  orders.unshift(order);
  writeFileSafe(orders);
  return order;
}

export function updateOrder(orderId: string, patch: Partial<Order>) {
  const { orders } = expireOrdersNow();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  orders[idx] = { ...orders[idx], ...patch, updatedAt: Date.now() };
  writeFileSafe(orders);
  return orders[idx];
}

export function getOrder(orderId: string) {
  const { orders } = expireOrdersNow();
  return orders.find((o) => o.id === orderId) ?? null;
}
// ✅ admin panel için: tüm siparişleri getir
export function getOrders(): Order[] {
  const { orders } = expireOrdersNow(); // her çağrıda expire kontrolü de yapar
  return orders;
}

// ✅ admin panel için: sipariş status güncelle
export function setOrdersStatus(
  orderId: string,
  status: Order["status"],
  reason?: string
) {
  // rejected ise reason yaz, değilse temizle
  const patch: Partial<Order> = {
    status,
    rejectReason: status === "rejected" ? (reason?.trim() || "Rejected by admin.") : undefined,
  };

  return updateOrder(orderId, patch);
}

// (opsiyonel ama iyi) iki isim de çalışsın diye alias:
export const setOrderStatus = setOrdersStatus;

