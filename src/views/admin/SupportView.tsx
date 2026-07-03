import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { HeadphonesIcon } from 'lucide-react';

export default function SupportView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getSupportTickets().then(data => {
      setTickets(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading support tickets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <HeadphonesIcon size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Support Tickets</h2>
        </div>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                <td className="p-4 text-white font-medium">{t.customer}</td>
                <td className="p-4">{t.subject}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {t.status || 'Open'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs px-3 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700">View</button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-zinc-500">No support tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
