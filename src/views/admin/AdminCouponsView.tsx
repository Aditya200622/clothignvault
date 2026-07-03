import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Ticket } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../apiClient";

export default function AdminCouponsView() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", discount: 0, minOrder: 0, expiry: "", usageLimit: 0, status: "active" });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "coupons"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCoupons(data);
    } catch (e) {
      console.error(e);
      setCoupons([]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.code) return;
    try {
      if (editingId) {
        await apiClient.updateCoupon(editingId, form);
      } else {
        await apiClient.addCoupon(form);
      }
      setIsAdding(false);
      setEditingId(null);
      fetchCoupons();
    } catch (e) {
      console.error(e);
      alert("Error saving coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiClient.deleteCoupon(id);
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-lg font-bold text-white">Discount Coupons</h2>
        <button 
          onClick={() => {
            setForm({ code: "", discount: 0, minOrder: 0, expiry: "", usageLimit: 0, status: "active" });
            setEditingId(null);
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="text-white font-bold">{editingId ? "Edit Coupon" : "New Coupon"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Coupon Code</label>
              <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Discount (%)</label>
              <input type="number" value={form.discount} onChange={e => setForm({...form, discount: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Minimum Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Expiry Date</label>
              <input type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" style={{colorScheme: 'dark'}} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">Save Coupon</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c, i) => (
          <div key={c.id || i} className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-zinc-800/50 transform rotate-12 transition-transform group-hover:scale-110"><Ticket size={100} /></div>
            <div className="relative z-10 flex justify-between items-start mb-4">
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg font-mono font-black tracking-widest">{c.code}</span>
              <div className="flex gap-2">
                <button onClick={() => { setForm(c); setEditingId(c.id); setIsAdding(false); }} className="text-zinc-500 hover:text-white"><Edit size={16} /></button>
                <button onClick={() => handleDelete(c.id)} className="text-zinc-500 hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-3xl font-black text-white">{c.discount}% OFF</p>
              <p className="text-xs text-zinc-400">Min. order ₹{c.minOrder}</p>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/50 flex justify-between text-xs text-zinc-500 font-semibold">
              <span>Limit: {c.usageLimit}</span>
              <span>Expires: {c.expiry}</span>
            </div>
          </div>
        ))}
        {coupons.length === 0 && !loading && (
          <div className="col-span-full p-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            No coupons created yet.
          </div>
        )}
      </div>
    </div>
  );
}
