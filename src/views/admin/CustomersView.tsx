import React, { useState, useMemo } from "react";
import { Search, Mail, Phone, MapPin, ChevronLeft, ChevronRight, X, History, RefreshCcw, HeadphonesIcon, CreditCard } from "lucide-react";

export default function CustomersView({ customers }: { customers: any[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const itemsPerPage = 15;

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase();
      return (c.fullName || "").toLowerCase().includes(q) || 
             (c.email || "").toLowerCase().includes(q) ||
             (c.phone || "").includes(q);
    });
  }, [customers, search]);

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
            placeholder="Search customers by name, email, phone..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold text-right">Total Orders</th>
                <th className="p-4 font-semibold text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedCustomer(c)}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-black text-lg border border-rose-500/20">
                        {(c.fullName || "U")[0].toUpperCase()}
                      </div>
                      <p className="font-bold text-white">{c.fullName || "Unknown"}</p>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Mail size={12} /> {c.email || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Phone size={12} /> {c.phone || "—"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2 text-zinc-400 text-xs max-w-[200px]">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{c.address ? `${c.address}, ${c.city}` : "—"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold">{c.orderCount}</td>
                  <td className="p-4 text-right font-bold text-emerald-400">₹{c.totalSpent?.toLocaleString("en-IN") || 0}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No customers found.
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

      {/* Customer Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-md bg-[#0a0a0c] h-full shadow-2xl border-l border-zinc-800 overflow-y-auto">
            <div className="sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-md p-6 border-b border-zinc-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-white">Customer Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-black text-3xl border border-rose-500/20">
                  {(selectedCustomer.fullName || "U")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedCustomer.fullName || "Unknown"}</h3>
                  <p className="text-sm text-zinc-400">Customer since {new Date().getFullYear()}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Lifetime Value</p>
                  <p className="text-xl font-bold text-emerald-400">₹{selectedCustomer.totalSpent?.toLocaleString("en-IN") || 0}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Orders</p>
                  <p className="text-xl font-bold text-white">{selectedCustomer.orderCount}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2">Contact Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Mail size={16} className="text-zinc-500" /> {selectedCustomer.email || "No email"}
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Phone size={16} className="text-zinc-500" /> {selectedCustomer.phone || "No phone"}
                  </div>
                  <div className="flex items-start gap-3 text-zinc-300 text-sm">
                    <MapPin size={16} className="text-zinc-500 mt-0.5 shrink-0" /> 
                    <span>{selectedCustomer.address ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state} - ${selectedCustomer.pincode}` : "No address"}</span>
                  </div>
                </div>
              </div>

              {/* Activity Overview */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-2">Activity Overview</h4>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <History size={16} className="text-zinc-500" /> Recent Orders
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-md text-white">{selectedCustomer.orderCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <RefreshCcw size={16} className="text-zinc-500" /> Returns
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-md text-white">0</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <HeadphonesIcon size={16} className="text-zinc-500" /> Support Tickets
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-md text-white">0</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
