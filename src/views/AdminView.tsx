import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ProductColor {
  name: string;
  hex?: string;
}

interface OrderItem {
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
  product: {
    name: string;
    images: string[];
    price: number;
    category: string;
  };
}

interface Order {
  firestoreId: string;
  id: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: any;
  trackingNumber?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

type StatusType = "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

const formatDate = (ts: any): string => {
  if (!ts) return "—";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const isToday = (ts: any): boolean => {
  if (!ts) return false;
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  } catch {
    return false;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch(() => {});
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Processing: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  Shipped: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
  },
  Delivered: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Processing"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  accent: string;
  icon: React.ReactNode;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border bg-[#0f0f0f] p-5 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${accent}`}
    style={{ backdropFilter: "blur(12px)" }}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="opacity-60">{icon}</span>
    </div>
    <span className="text-3xl font-black tracking-tight text-white leading-none">
      {value}
    </span>
    <div
      className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-5 blur-2xl"
      style={{ background: "white" }}
    />
  </div>
);

// ─── Order Details Modal ───────────────────────────────────────────────────────

const OrderModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-[#0f0f0f] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-[#0f0f0f] px-6 py-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
              Order Details
            </p>
            <h2 className="text-xl font-black text-white mt-0.5">{order.id}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={order.status} />
            <span className="text-xs text-zinc-500">{formatDate(order.createdAt)}</span>
            {order.paymentMethod && (
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                {order.paymentMethod}
              </span>
            )}
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">
              Customer
            </p>
            <p className="text-white font-semibold">{order.shippingAddress?.fullName}</p>
            <p className="text-zinc-400 text-sm">{order.shippingAddress?.email}</p>
            <p className="text-zinc-400 text-sm">{order.shippingAddress?.phone}</p>
            <p className="text-zinc-400 text-sm">
              {order.shippingAddress?.address}, {order.shippingAddress?.city} —{" "}
              {order.shippingAddress?.postalCode}
            </p>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">
              Items ({order.items?.length || 0})
            </p>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg border border-zinc-700 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='%23333'%3E%3Crect width='64' height='64'/%3E%3C/svg%3E";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {item.product?.name}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {item.product?.category}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        Color: {item.selectedColor?.name}
                      </span>
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-sm">
                      {formatCurrency((item.product?.price || 0) * item.quantity)}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {formatCurrency(item.product?.price || 0)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">
              Amount Breakdown
            </p>
            <div className="space-y-2">
              {[
                { label: "Subtotal", value: order.subtotal },
                { label: "Shipping", value: order.shipping },
                { label: "Tax", value: order.tax },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-zinc-300">{formatCurrency(value)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between">
                <span className="text-white font-bold">Grand Total</span>
                <span className="text-emerald-400 font-black text-lg">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                Tracking Number
              </p>
              <p className="text-sky-300 font-mono font-bold">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Order Row ────────────────────────────────────────────────────────────────

const OrderRow = React.memo(
  ({
    order,
    onUpdateStatus,
    onOpenModal,
  }: {
    order: Order;
    onUpdateStatus: (id: string, status: string) => void;
    onOpenModal: (order: Order) => void;
  }) => {
    const [trackingInput, setTrackingInput] = useState(order.trackingNumber || "");
    const [savingTracking, setSavingTracking] = useState(false);
    const [trackingSaved, setTrackingSaved] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const handleCopy = (text: string, field: string) => {
      copyToClipboard(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    };

    const handleSaveTracking = async () => {
      setSavingTracking(true);
      try {
        const orderRef = doc(db, "orders", order.firestoreId);
        await updateDoc(orderRef, { trackingNumber: trackingInput });
        setTrackingSaved(true);
        setTimeout(() => setTrackingSaved(false), 2000);
      } finally {
        setSavingTracking(false);
      }
    };

    const statusButtons: { label: string; status: string; cls: string }[] = [
      {
        label: "Processing",
        status: "Processing",
        cls: "bg-amber-600/80 hover:bg-amber-500 border-amber-500/40",
      },
      {
        label: "Shipped",
        status: "Shipped",
        cls: "bg-sky-600/80 hover:bg-sky-500 border-sky-500/40",
      },
      {
        label: "Delivered",
        status: "Delivered",
        cls: "bg-emerald-600/80 hover:bg-emerald-500 border-emerald-500/40",
      },
      {
        label: "Cancelled",
        status: "Cancelled",
        cls: "bg-rose-600/80 hover:bg-rose-500 border-rose-500/40",
      },
    ];

    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden transition-all duration-200 hover:border-zinc-700">
        {/* Main Row */}
        <div className="p-5">
          <div className="flex flex-col xl:flex-row xl:items-start gap-5">
            {/* Left: Order Info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Row 1 */}
              <div className="flex items-center flex-wrap gap-3">
                <span className="font-black text-white text-base tracking-tight">
                  {order.id}
                </span>
                <StatusBadge status={order.status} />
                <span className="text-xs text-zinc-600 ml-auto">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Row 2: Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-sm">
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Customer</p>
                  <p className="text-zinc-200 font-medium truncate">
                    {order.shippingAddress?.fullName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Email</p>
                  <p className="text-zinc-400 truncate">{order.shippingAddress?.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Phone</p>
                  <p className="text-zinc-400">{order.shippingAddress?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">City</p>
                  <p className="text-zinc-400">{order.shippingAddress?.city || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Postal</p>
                  <p className="text-zinc-400">{order.shippingAddress?.postalCode || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Payment</p>
                  <p className="text-zinc-400">{order.paymentMethod || "—"}</p>
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-zinc-600 truncate">
                {order.shippingAddress?.address}
              </p>

              {/* Amount + Items toggle */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-emerald-400 font-black text-lg">
                  {formatCurrency(order.total)}
                </span>
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                  <span className="ml-1">{expanded ? "▲" : "▼"}</span>
                </button>
              </div>

              {/* Items (expanded) */}
              {expanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
                    >
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-14 h-14 object-cover rounded-lg border border-zinc-700 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' fill='%23222'%3E%3Crect width='56' height='56'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-xs truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-zinc-500 text-[10px]">{item.product?.category}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            {item.selectedSize}
                          </span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            {item.selectedColor?.name}
                          </span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                            ×{item.quantity}
                          </span>
                        </div>
                        <p className="text-emerald-400 text-xs font-bold mt-1">
                          {formatCurrency((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-3 xl:w-56 flex-shrink-0">
              {/* Status Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {statusButtons.map((btn) => (
                  <button
                    key={btn.status}
                    onClick={() => onUpdateStatus(order.firestoreId, btn.status)}
                    disabled={order.status === btn.status}
                    className={`px-3 py-2 rounded-lg text-xs font-bold text-white border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${btn.cls} ${
                      order.status === btn.status ? "ring-1 ring-white/20" : ""
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Tracking */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Tracking number..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSaveTracking}
                    disabled={savingTracking}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all disabled:opacity-50"
                  >
                    {savingTracking ? "Saving…" : trackingSaved ? "✓ Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => handleCopy(trackingInput, "tracking")}
                    disabled={!trackingInput}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all disabled:opacity-40"
                  >
                    {copiedField === "tracking" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Customer tools */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() =>
                    handleCopy(order.shippingAddress?.phone || "", "phone")
                  }
                  className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
                  title="Copy Phone"
                >
                  {copiedField === "phone" ? "✓" : "📞 Phone"}
                </button>
                <button
                  onClick={() =>
                    handleCopy(order.shippingAddress?.email || "", "email")
                  }
                  className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
                  title="Copy Email"
                >
                  {copiedField === "email" ? "✓" : "✉ Email"}
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      `${order.shippingAddress?.address}, ${order.shippingAddress?.city} ${order.shippingAddress?.postalCode}`,
                      "addr"
                    )
                  }
                  className="px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
                  title="Copy Address"
                >
                  {copiedField === "addr" ? "✓" : "🏠 Addr"}
                </button>
              </div>

              {/* WhatsApp + View */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${(order.shippingAddress?.phone || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 transition-all"
                >
                  <span className="text-sm">💬</span> WhatsApp
                </a>
                <button
                  onClick={() => onOpenModal(order)}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-violet-600/80 hover:bg-violet-500 text-white border border-violet-500/40 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OrderRow.displayName = "OrderRow";

// ─── Export CSV ───────────────────────────────────────────────────────────────

const exportCSV = (orders: Order[]) => {
  const headers = [
    "Order ID",
    "Date",
    "Status",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "Postal Code",
    "Payment Method",
    "Subtotal",
    "Shipping",
    "Tax",
    "Total",
    "Tracking Number",
    "Items",
  ];

  const rows = orders.map((o) => [
    o.id,
    formatDate(o.createdAt),
    o.status,
    o.shippingAddress?.fullName || "",
    o.shippingAddress?.email || "",
    o.shippingAddress?.phone || "",
    o.shippingAddress?.address || "",
    o.shippingAddress?.city || "",
    o.shippingAddress?.postalCode || "",
    o.paymentMethod || "",
    o.subtotal || 0,
    o.shipping || 0,
    o.tax || 0,
    o.total || 0,
    o.trackingNumber || "",
    (o.items || [])
      .map((i) => `${i.product?.name} x${i.quantity}`)
      .join("; "),
  ]);

  const csv = [headers, ...rows]
    .map((r) =>
      r
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ORDERS_PER_PAGE = 20;

export default function AdminView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusType>("All");
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const updateStatus = async (
  firestoreId: string,
  newStatus: string
) => {
  try {
    const orderRef = doc(
      db,
      "orders",
      firestoreId
    );

    await updateDoc(orderRef, {
      status: newStatus,
    });
    const currentOrder = orders.find(
  (o) => o.firestoreId === firestoreId
);

if (currentOrder) {
  await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: currentOrder.shippingAddress?.email,
      customerName:
        currentOrder.shippingAddress?.fullName,
      orderId: currentOrder.id,
      status: newStatus,
    }),
  });
}

    setOrders((prev) =>
      prev.map((order) =>
        order.firestoreId === firestoreId
          ? {
              ...order,
              status: newStatus as Order["status"],
            }
          : order
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "orders"));
      const data: Order[] = snap.docs.map((d: any) => ({
        firestoreId: d.id,
        ...(d.data() as Omit<Order, "firestoreId">),
      }));
      data.sort((a, b) => {
        const ta = a.createdAt?.toDate?.()?.getTime?.() ?? 0;
        const tb = b.createdAt?.toDate?.()?.getTime?.() ?? 0;
        return tb - ta;
      });
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {

  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {

      const data = snapshot.docs.map((d) => ({
        firestoreId: d.id,
        ...d.data(),
      }));

      setOrders(data as Order[]);
      setLoading(false);
    }
  );

  return () => unsubscribe();

}, []);
  // ── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = orders.length;
    const processing = orders.filter((o) => o.status === "Processing").length;
    const shipped = orders.filter((o) => o.status === "Shipped").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const revenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    const aov = total - cancelled > 0 ? revenue / (total - cancelled) : 0;
    const todayOrders = orders.filter((o) => isToday(o.createdAt)).length;
    return { total, processing, shipped, delivered, cancelled, revenue, aov, todayOrders };
  }, [orders]);

  const statusCounts = useMemo(
    () => ({
      All: orders.length,
      Processing: stats.processing,
      Shipped: stats.shipped,
      Delivered: stats.delivered,
      Cancelled: stats.cancelled,
    }),
    [orders.length, stats]
  );

  // ── Filtering ────────────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      const matchFilter =
        activeFilter === "All" || o.status === activeFilter;
      if (!matchFilter) return false;
      if (!q) return true;
      return (
        (o.id || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.email || "").toLowerCase().includes(q) ||
        (o.shippingAddress?.phone || "").includes(q) ||
        (o.shippingAddress?.city || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search, activeFilter]);

  // ── Pagination ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const safePageNumber = Math.min(page, totalPages);

  const pagedOrders = useMemo(
    () =>
      filteredOrders.slice(
        (safePageNumber - 1) * ORDERS_PER_PAGE,
        safePageNumber * ORDERS_PER_PAGE
      ),
    [filteredOrders, safePageNumber]
  );

  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePageNumber > 3) pages.push("…");
      for (
        let i = Math.max(2, safePageNumber - 1);
        i <= Math.min(totalPages - 1, safePageNumber + 1);
        i++
      )
        pages.push(i);
      if (safePageNumber < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePageNumber]);

  // ── Render ───────────────────────────────────────────────────────────────

  const statCards = [
    {
      label: "Total Orders",
      value: stats.total,
      accent: "border-zinc-700/60",
      icon: <span className="text-xl">📦</span>,
    },
    {
      label: "Processing",
      value: stats.processing,
      accent: "border-amber-500/20",
      icon: <span className="text-xl">⏳</span>,
    },
    {
      label: "Shipped",
      value: stats.shipped,
      accent: "border-sky-500/20",
      icon: <span className="text-xl">🚚</span>,
    },
    {
      label: "Delivered",
      value: stats.delivered,
      accent: "border-emerald-500/20",
      icon: <span className="text-xl">✅</span>,
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      accent: "border-rose-500/20",
      icon: <span className="text-xl">❌</span>,
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      accent: "border-violet-500/20",
      icon: <span className="text-xl">💰</span>,
    },
    {
      label: "Avg. Order Value",
      value: formatCurrency(stats.aov),
      accent: "border-fuchsia-500/20",
      icon: <span className="text-xl">📊</span>,
    },
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      accent: "border-teal-500/20",
      icon: <span className="text-xl">🗓</span>,
    },
  ];

  const filterTabs: StatusType[] = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#080808",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <div className="border-b border-zinc-800/80 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-xs font-black">
            A
          </div>
          <span className="font-black text-white text-lg tracking-tight">
            Admin
          </span>
          <span className="text-zinc-700 text-lg font-thin select-none">|</span>
          <span className="text-zinc-500 text-sm">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV(filteredOrders)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
          >
            <span>⬇</span> Export CSV
          </button>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/40 transition-all disabled:opacity-60"
          >
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Search + Filter row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by Order ID, Name, Email, Phone, City…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 bg-[#0f0f0f] border border-zinc-800 rounded-xl p-1.5 overflow-x-auto flex-shrink-0">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeFilter === tab
                      ? "bg-white/10 text-white"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {statusCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <span className="text-zinc-200 font-semibold">
              {filteredOrders.length}
            </span>{" "}
            orders
            {search && (
              <>
                {" "}
                for{" "}
                <span className="text-violet-400 font-semibold">
                  "{search}"
                </span>
              </>
            )}
          </p>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-zinc-900/50 animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : pagedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-zinc-400 font-semibold">No orders found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pagedOrders.map((order) => (
              <OrderRow
                key={order.firestoreId}
                order={order}
                onUpdateStatus={updateStatus}
                onOpenModal={setModalOrder}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePageNumber === 1}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {pageNumbers.map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="px-2 text-zinc-600 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
                    safePageNumber === p
                      ? "bg-violet-600 text-white border-violet-500/50"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePageNumber === totalPages}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOrder && (
        <OrderModal order={modalOrder} onClose={() => setModalOrder(null)} />
      )}
    </div>
  );
}