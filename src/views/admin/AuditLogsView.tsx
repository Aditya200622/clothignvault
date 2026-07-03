import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { Activity } from 'lucide-react';

export default function AuditLogsView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading audit logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Activity size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">System Audit Logs</h2>
        </div>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Admin</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                <td className="p-4 whitespace-nowrap text-xs text-zinc-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4 text-white font-medium">{log.adminEmail}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {log.action}
                  </span>
                </td>
                <td className="p-4">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-zinc-500">No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
