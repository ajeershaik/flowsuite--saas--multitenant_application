import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Receipt, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export const BillingHistoryPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { invoices, currentRole, activePlan } = useWorkspace();

  if (currentRole !== 'OWNER') {
    return (
      <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-3">
        <Receipt className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Denied (403)</h2>
        <p className="text-xs text-slate-400">
          Only the verified organization <strong>OWNER</strong> has authority to view financial invoices and billing records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing History & Invoices</h1>
          <p className="text-xs text-slate-400">
            Stripe test sandbox payment receipts and downloadable GST invoices
          </p>
        </div>

        <button
          onClick={() => onNavigate('plans-billing')}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Manage Subscription
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Billing Date</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Receipt / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                <td className="p-4 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                <td className="p-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(inv.createdDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-white">
                  ₹{inv.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">INR</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a
                    href="https://dashboard.stripe.com/test/invoices"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    <span>Stripe Receipt</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
