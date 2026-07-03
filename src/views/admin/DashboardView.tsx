import React, { useMemo } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  PackageSearch, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Order, Product, UserProfile } from "../../types";

const StatCard = ({ label, value, icon, colorClass, borderClass }: { label: string; value: string | number; icon: React.ReactNode; colorClass: string; borderClass: string }) => (
  <div className={`rounded-2xl border ${borderClass} bg-[#0f0f0f] p-5 flex flex-col gap-3 relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl`}>
    <div className="flex items-center justify-between z-10">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
      <span className={`${colorClass}`}>{icon}</span>
    </div>
    <span className="text-3xl font-black tracking-tight text-white leading-none z-10">{value}</span>
    <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] blur-xl bg-current ${colorClass}`} />
  </div>
);

const formatCurrency = (amount: number) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

interface DashboardProps {
  orders: Order[];
  products: Product[];
  analytics?: any;
}

export default function DashboardView({ orders, products, analytics }: DashboardProps) {
  if (!analytics) {
    return <div className="text-white p-8 text-center animate-pulse">Loading Dashboard from API...</div>;
  }

  const { stats, charts, customers } = analytics;
  const salesData = charts?.salesData || [];
  const topProductsData = charts?.topProductsData || [];


  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={formatCurrency(stats.todayRev)} icon={<DollarSign size={20} />} colorClass="text-emerald-400" borderClass="border-emerald-500/20" />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthRev)} icon={<TrendingUp size={20} />} colorClass="text-sky-400" borderClass="border-sky-500/20" />
        <StatCard label="Total Orders" value={orders.length} icon={<ShoppingCart size={20} />} colorClass="text-rose-400" borderClass="border-rose-500/20" />
        <StatCard label="Total Customers" value={customers.length} icon={<Users size={20} />} colorClass="text-indigo-400" borderClass="border-indigo-500/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Pending Orders" value={stats.pending} icon={<Clock size={20} />} colorClass="text-amber-400" borderClass="border-zinc-800" />
        <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle size={20} />} colorClass="text-emerald-400" borderClass="border-zinc-800" />
        <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle size={20} />} colorClass="text-rose-400" borderClass="border-zinc-800" />
        <StatCard label="Low Stock" value={stats.lowStock} icon={<AlertTriangle size={20} />} colorClass="text-amber-500" borderClass="border-amber-500/20" />
        <StatCard label="Out of Stock" value={stats.outOfStock} icon={<PackageSearch size={20} />} colorClass="text-rose-500" borderClass="border-rose-500/30" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-6">Revenue Trend (7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-6">Top Products</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#d4d4d8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#27272a', opacity: 0.4}}
                />
                <Bar dataKey="sales" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Mini Table */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden">
        <div className="p-5 border-b border-zinc-800/50">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-900/30">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">{order.id}</td>
                  <td className="p-4">{order.shippingAddress?.fullName || 'Unknown'}</td>
                  <td className="p-4 font-bold text-emerald-400">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' :
                      order.status === 'Shipped' ? 'bg-sky-500/10 text-sky-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
