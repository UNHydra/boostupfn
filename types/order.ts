export type OrderStatus =
  | "waiting_payment"
  | "proof_submitted"
  | "expired"
  | "rejected"
  | "completed";

export type OrderItem = {
  productSlug: string;
  variantId: string;
  label: string;
  price: number;
  msrp?: number;
};

export type PaymentInfo = {
  network: string;
  address: string;
  amount: number;
};

export type OrderProof = {
  txHash?: string;
  proofLink?: string;
  contact?: string;
  submittedAt?: number;
};

export type Order = {
  id: string;
  email: string;
  status: OrderStatus;

  item: OrderItem;
  payment: PaymentInfo;

  createdAt: number;
  updatedAt: number;

  expiresAt: number; // ✅ 5dk deadline

  proof?: OrderProof;
  rejectReason?: string;
};
