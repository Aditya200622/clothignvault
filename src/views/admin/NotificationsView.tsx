import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { Bell } from 'lucide-react';

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Bell size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        {notifications.map(n => (
          <div key={n.id} className="p-4 border-b border-zinc-800/50 flex justify-between items-center hover:bg-zinc-900/40">
            <div>
              <p className={`font-medium ${n.read ? 'text-zinc-400' : 'text-white'}`}>{n.message}</p>
              <p className="text-xs text-zinc-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
            </div>
            {!n.read && (
              <button 
                onClick={() => apiClient.markNotificationRead(n.id).then(() => setNotifications(prev => prev.map(p => p.id === n.id ? {...p, read: true} : p)))}
                className="text-xs px-3 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700 text-zinc-300"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-12 text-center text-zinc-500">No notifications found.</div>
        )}
      </div>
    </div>
  );
}
