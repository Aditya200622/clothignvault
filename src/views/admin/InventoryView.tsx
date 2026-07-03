import React, { useState, useMemo } from "react";
import { Search, AlertTriangle, PackageSearch, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Product } from "../../types";

const formatCurrency = (amount: number) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function InventoryView({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
      
      let matchFilter = true;
      if (filter === "Out of Stock") matchFilter = p.stock === 0;
      else if (filter === "Low Stock") matchFilter = p.stock > 0 && p.stock <= 10;
      else if (filter === "In Stock") matchFilter = p.stock > 10;

      return matchSearch && matchFilter;
    });
  }, [products, search, filter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-rose-500/30 bg-[#0f0f0f] p-5 flex items-center gap-4 hover:border-rose-500/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
            <PackageSearch size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{outOfStockCount}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Out of Stock</p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-[#0f0f0f] p-5 flex items-center gap-4 hover:border-amber-500/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{lowStockCount}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Low Stock (&le; 10)</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search inventory by name, SKU..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "Out of Stock", "Low Stock", "In Stock"].map(f => (
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
                <th className="p-4 font-semibold w-16">Item</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold text-right">Price</th>
                <th className="p-4 font-semibold text-right">Stock Level</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
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
                    <p className="font-mono text-xs text-zinc-500 mt-1">SKU: {p.sku || "—"}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-white">{formatCurrency(p.price)}</td>
                  <td className="p-4 text-right font-bold text-zinc-300">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${p.stock === 0 ? 'bg-rose-500' : p.stock <= 10 ? 'bg-amber-500' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{p.stock}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {p.stock === 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-rose-500/10 text-rose-400 border-rose-500/30">
                        Out of Stock
                      </span>
                    ) : p.stock <= 10 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-amber-500/10 text-amber-400 border-amber-500/30">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No inventory records found.
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
