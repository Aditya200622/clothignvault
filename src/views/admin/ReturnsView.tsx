import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { RefreshCcw } from 'lucide-react';

export default function ReturnsView() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getReturns().then(data => {
      setReturns(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading returns...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <RefreshCcw size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Returns & Refunds</h2>
        </div>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Reason</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                <td className="p-4 font-mono text-xs">{r.orderId}</td>
                <td className="p-4 text-white font-medium">{r.customerName}</td>
                <td className="p-4">{r.reason}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {r.status || 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs px-3 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700">Manage</button>
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-zinc-500">No returns requested.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
