import React from 'react';
import { FileText, Download } from 'lucide-react';
import { apiClient } from '../../apiClient';

export default function ReportsView() {
  const exportReport = (type: string) => {
    apiClient.exportReport(type).then(data => {
      // Basic CSV export
      const csv = ["ID,Data"];
      data.forEach((d: any) => csv.push(`${d.id},${JSON.stringify(d)}`));
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      a.click();
    }).catch(() => alert('Failed to export report'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0f0f0f] p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <FileText size={18} />
          </div>
          <h2 className="text-xl font-bold text-white">Reports & Exports</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {['orders', 'customers', 'inventory', 'returns', 'support'].map(type => (
          <div key={type} className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold capitalize mb-2">{type} Report</h3>
              <p className="text-xs text-zinc-500 mb-6">Generate and download a comprehensive CSV report for all {type}.</p>
            </div>
            <button 
              onClick={() => exportReport(type)}
              className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-300 transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
