import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';

export default function ReviewsView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getReviews().then(data => {
      setReviews(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-bold text-white">Reviews Management</h2>
      </div>
      
      <div className="bg-[#0f0f0f] rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold">Comment</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                <td className="p-4 text-white font-medium">{r.customerName}</td>
                <td className="p-4">{r.productId}</td>
                <td className="p-4 font-bold text-rose-500">{r.rating} ★</td>
                <td className="p-4 max-w-xs truncate">{r.comment}</td>
                <td className="p-4 text-right">
                  <button className="text-xs px-3 py-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700">Approve</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-zinc-500">No reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
