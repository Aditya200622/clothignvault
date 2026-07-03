import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { apiClient } from "../../apiClient";

export default function AdminCategoriesView() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "", status: "active", order: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "categories"));
      const cats = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => a.order - b.order);
      setCategories(cats);
    } catch (e) {
      console.error(e);
      // Remove fallback demo data completely as requested
      setCategories([]);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      if (editingId) {
        await apiClient.updateCategory(editingId, form);
      } else {
        await apiClient.addCategory(form);
      }
      setIsAdding(false);
      setEditingId(null);
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert("Error saving category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiClient.deleteCategory(id);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-lg font-bold text-white">Categories</h2>
        <button 
          onClick={() => {
            setForm({ name: "", slug: "", image: "", status: "active", order: categories.length + 1 });
            setEditingId(null);
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="text-white font-bold">{editingId ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Image URL</label>
              <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Display Order</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500">
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-rose-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">Save</button>
          </div>
        </div>
      )}

      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 w-12"></th>
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4 text-center">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id || i} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                <td className="p-4 text-zinc-600"><GripVertical size={16} className="cursor-grab" /></td>
                <td className="p-4 flex items-center gap-3">
                  {c.image ? <img src={c.image} alt="" className="w-10 h-10 object-cover rounded-lg" /> : <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-700"><ImageIcon size={16} /></div>}
                  <span className="font-bold text-white">{c.name}</span>
                </td>
                <td className="p-4 font-mono text-zinc-500">{c.slug}</td>
                <td className="p-4 text-center font-bold">{c.order}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>{c.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setForm(c); setEditingId(c.id); setIsAdding(false); }} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-rose-950/30 rounded-lg text-rose-500 border border-rose-900/50"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
