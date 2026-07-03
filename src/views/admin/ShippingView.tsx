import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { Truck } from 'lucide-react';

export default function ShippingView() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getShippingZones().then(data => {
      setZones(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading shipping zones...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Truck size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Shipping Management</h2>
        </div>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden p-6 text-zinc-400">
        <p>Shipping Zones configuration. You can add zones, couriers, and set rates here.</p>
        {zones.length === 0 && <p className="mt-4 text-zinc-500">No zones configured yet.</p>}
      </div>
    </div>
  );
}
