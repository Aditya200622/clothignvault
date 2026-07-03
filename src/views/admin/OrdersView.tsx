import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Order } from "../../types";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../apiClient";

const formatCurrency = (amount: number) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const formatDate = (ts: any): string => {
  if (!ts) return "—";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Processing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Shipped: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };
  const s = styles[status] || styles["Processing"];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s}`}>
      {status}
    </span>
  );
};

// --- Drawer ---
const OrderDrawer = ({ order, isOpen, onClose, onUpdateStatus }: { order: Order | null, isOpen: boolean, onClose: () => void, onUpdateStatus: (id: string, status: string) => void }) => {
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (order) setTracking(order.trackingNumber || "");
  }, [order]);

  const handleSaveTracking = async () => {
    if (!order) return;
    setSaving(true);
    try {
      // For tracking number, we can still use firestore direct update for now or 
      // ideally add it to apiClient, but the user explicitly requested "admin write operation must go through Railway"
      // Wait, let's create a small wrapper in apiClient or just keep it simple if I didn't add the tracking endpoint.
      // I will just add the tracking endpoint in apiClient now, wait, no, I'll update it via apiClient.updateOrderStatus and modify backend later, or just do it via firebase if it's not a status. The prompt says "Remove every remaining direct Firestore write from the frontend admin." So I MUST NOT use updateDoc. 
      // Let's add updateOrder endpoint in apiClient implicitly or use a fetch directly here just for tracking.
      
      // I'll assume I can use a generic updateOrder method if I add it. But for now, let's do a direct fetch since I am replacing updateDoc.
      const headers = { 'Content-Type': 'application/json' }; 
      // Need token, but we are inside a component, can't easily await getAuthHeaders without importing auth. 
      // I'll create apiClient.updateOrder(order.id, { trackingNumber: tracking })
      await apiClient.updateOrderTracking(order.id, tracking);
      // let's do the proper thing: Add updateOrder to apiClient.
      alert("Tracking updated");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0c] shadow-2xl border-l border-zinc-800 z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {order && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Order Details</p>
                <h2 className="text-xl font-black text-white mt-0.5">{order.id}</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Status Management</h3>
                <div className="flex flex-wrap gap-2">
                  {["Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                    <button 
                      key={s} 
                      onClick={() => onUpdateStatus(order.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${order.status === s ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Customer Info</h3>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 space-y-1">
                  <p className="font-bold text-white">{order.shippingAddress?.fullName}</p>
                  <p className="text-sm text-zinc-400">{order.shippingAddress?.email}</p>
                  <p className="text-sm text-zinc-400">{order.shippingAddress?.phone}</p>
                  <p className="text-sm text-zinc-500 mt-2">{order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Items ({order.items?.length || 0})</h3>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 bg-zinc-900/50 rounded-xl p-3 border border-zinc-800">
                      <img src={item.product?.images?.[0]} alt="" className="w-16 h-16 object-cover rounded-lg bg-zinc-800" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{item.product?.name}</p>
                        <p className="text-xs text-zinc-500">{item.product?.category}</p>
                        <p className="text-xs text-zinc-400 mt-1">Size: {item.selectedSize} | Color: {item.selectedColor?.name}</p>
                        <p className="text-sm font-bold text-emerald-400 mt-1">{formatCurrency(item.product?.price)} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials */}
              <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 space-y-2">
                <div className="flex justify-between text-sm text-zinc-400"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between text-sm text-zinc-400"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
                <div className="flex justify-between text-sm text-zinc-400"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
                <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400 text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Tracking */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Tracking Information</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tracking} 
                    onChange={e => setTracking(e.target.value)}
                    placeholder="Enter Tracking ID"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                  <button 
                    onClick={handleSaveTracking}
                    disabled={saving}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-600 transition-colors"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default function OrdersView({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || o.status === filter;
      return matchSearch && matchFilter;
    });
  }, [orders, search, filter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiClient.updateOrderStatus(id, status);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: status as any });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/40 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-bold text-white">{order.id}</td>
                  <td className="p-4 text-zinc-400">{formatDate(order.date)}</td>
                  <td className="p-4 font-medium">{order.shippingAddress?.fullName}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-zinc-800 rounded text-xs">{order.paymentMethod || "COD"}</span></td>
                  <td className="p-4"><StatusBadge status={order.status} /></td>
                  <td className="p-4 text-right font-bold text-emerald-400">{formatCurrency(order.total)}</td>
                </tr>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-semibold">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-400 disabled:opacity-50 hover:text-white border border-zinc-800"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-400 disabled:opacity-50 hover:text-white border border-zinc-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <OrderDrawer 
        order={selectedOrder} 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
