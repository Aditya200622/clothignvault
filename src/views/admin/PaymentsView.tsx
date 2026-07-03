import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from '../../apiClient';
import { CreditCard, Search, Download, X, Eye } from 'lucide-react';

export default function PaymentsView() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    apiClient.getPayments().then(data => {
      setPayments(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const q = search.toLowerCase();
      const matchesSearch = p.id?.toLowerCase().includes(q) || p.razorpayPaymentId?.toLowerCase().includes(q) || p.customer?.toLowerCase().includes(q) || p.orderId?.toLowerCase().includes(q);
      const matchesStatus = statusFilter ? p.status?.toLowerCase() === statusFilter.toLowerCase() : true;
      const matchesMethod = methodFilter ? p.paymentMethod?.toLowerCase() === methodFilter.toLowerCase() : true;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const exportCSV = () => {
    const csv = ['Payment ID,Razorpay Payment ID,Razorpay Order ID,Customer,Order ID,Amount,Method,Status,Date,Refund Status'];
    filtered.forEach(p => {
      csv.push(`${p.id},${p.razorpayPaymentId},${p.razorpayOrderId},${p.customer},${p.orderId},${p.amount},${p.paymentMethod},${p.status},${p.date},${p.refundStatus}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
  };

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <CreditCard size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Payments</h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-300 transition-colors whitespace-nowrap">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search Payment ID, Order ID, Customer..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
          <option value="">All Methods</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Wallet">Wallet</option>
          <option value="Net Banking">Net Banking</option>
          <option value="COD">COD</option>
        </select>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300 whitespace-nowrap">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-semibold">Payment ID</th>
              <th className="p-4 font-semibold">RPay ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Method</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => setSelectedPayment(p)} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 cursor-pointer transition-colors">
                <td className="p-4 font-mono text-xs">{p.id}</td>
                <td className="p-4 font-mono text-xs">{p.razorpayPaymentId || '-'}</td>
                <td className="p-4 font-medium text-white">{p.customer}</td>
                <td className="p-4 text-rose-400 hover:underline">{p.orderId}</td>
                <td className="p-4 font-bold">₹{p.amount?.toLocaleString('en-IN')}</td>
                <td className="p-4">{p.paymentMethod}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${
                    p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    p.status === 'Refunded' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-zinc-400">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button className="text-zinc-400 hover:text-white"><Eye size={16}/></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="p-12 text-center text-zinc-500">No payments found matching your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPayment(null)} />
          <div className="relative w-full max-w-md bg-[#0a0a0c] h-full shadow-2xl border-l border-zinc-800 overflow-y-auto p-6 space-y-8">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Amount</span>
                <span className="text-2xl font-black text-emerald-400">₹{selectedPayment.amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Status</span>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${
                    selectedPayment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    selectedPayment.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    selectedPayment.status === 'Refunded' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>{selectedPayment.status}</span>
              </div>
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Payment ID</span><span className="text-zinc-300 font-mono">{selectedPayment.id}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Razorpay Payment ID</span><span className="text-zinc-300 font-mono">{selectedPayment.razorpayPaymentId || '-'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Razorpay Order ID</span><span className="text-zinc-300 font-mono">{selectedPayment.razorpayOrderId || '-'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Customer</span><span className="text-zinc-300">{selectedPayment.customer}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Order ID</span><span className="text-rose-400 font-mono">{selectedPayment.orderId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Method</span><span className="text-zinc-300">{selectedPayment.paymentMethod}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Captured Date</span><span className="text-zinc-300">{new Date(selectedPayment.date).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-500">Refund Status</span><span className="text-zinc-300">{selectedPayment.refundStatus || 'None'}</span></div>
              </div>
              <div className="border-t border-zinc-800 pt-4 flex gap-3">
                 <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl border border-zinc-700 transition-colors">Download Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
