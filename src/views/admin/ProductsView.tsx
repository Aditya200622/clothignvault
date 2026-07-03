import React, { useState, useMemo } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, CheckSquare } from "lucide-react";
import { Product } from "../../types";

const formatCurrency = (amount: number) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductsView({ 
  products, 
  onAdd, 
  onEdit, 
  onDelete 
}: { 
  products: Product[], 
  onAdd: () => void, 
  onEdit: (p: Product) => void, 
  onDelete: (id: string) => void 
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 15;

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             (p.sku && p.sku.toLowerCase().includes(q)) || 
             p.category.toLowerCase().includes(q);
    });
  }, [products, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search products by name, SKU, category..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm text-zinc-400 font-bold">{selectedIds.length} selected</span>
              <select className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
                <option value="">Bulk Actions</option>
                <option value="delete">Delete Selected</option>
                <option value="status">Update Status</option>
                <option value="category">Change Category</option>
              </select>
            </div>
          )}
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 whitespace-nowrap justify-center"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-700 bg-zinc-900 checked:bg-rose-500 focus:ring-rose-500/20"
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(paginated.map(p => p.id));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="p-4 font-semibold w-16">Image</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Stock</th>
                <th className="p-4 font-semibold text-right">Price</th>
                <th className="p-4 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-zinc-700 bg-zinc-900 checked:bg-rose-500 focus:ring-rose-500/20"
                      checked={selectedIds.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(prev => [...prev, p.id]);
                        else setSelectedIds(prev => prev.filter(id => id !== p.id));
                      }}
                    />
                  </td>
                  <td className="p-4">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-md bg-zinc-800" />
                    ) : (
                      <div className="w-10 h-12 rounded-md bg-zinc-900 flex items-center justify-center text-zinc-600">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white line-clamp-1">{p.name}</p>
                    {p.tag && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold font-mono mt-1 inline-block">{p.tag}</span>}
                  </td>
                  <td className="p-4 font-mono text-zinc-500">{p.sku || "—"}</td>
                  <td className="p-4 uppercase text-xs font-bold text-zinc-400">{p.category}</td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${p.stock === 0 ? 'text-rose-500' : p.stock <= 10 ? 'text-amber-500' : 'text-emerald-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-white">{formatCurrency(p.price)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(p)} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800 transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => onDelete(p.id)} className="p-2 bg-rose-950/30 rounded-lg text-rose-500 hover:bg-rose-900/50 hover:text-rose-400 border border-rose-900/50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500">
                    No products found.
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
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
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
    </div>
  );
}
