import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Send, 
  Search, 
  Building, 
  Smartphone, 
  AlertCircle,
  FileText,
  Check,
  X as XIcon,
  Sparkles
} from 'lucide-react';
import { PayoutRequest, Seller } from '../../types';

interface AdminSettlementsManagerProps {
  payoutRequests: PayoutRequest[];
  onApprovePayout: (requestId: string, trxId: string) => void;
  onRejectPayout: (requestId: string) => void;
  sellers: Seller[];
  commissionRate: number;
}

export const AdminSettlementsManager: React.FC<AdminSettlementsManagerProps> = ({
  payoutRequests,
  onApprovePayout,
  onRejectPayout,
  sellers,
  commissionRate,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null);
  const [trxInput, setTrxInput] = useState('');

  // Calculations
  const pendingRequests = payoutRequests.filter((p) => p.status === 'Pending');
  const completedRequests = payoutRequests.filter((p) => p.status === 'Completed');
  const totalPendingAmount = pendingRequests.reduce((sum, p) => sum + p.amount, 0);
  const totalCompletedAmount = completedRequests.reduce((sum, p) => sum + p.amount, 0);

  const filtered = payoutRequests.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q) ||
      p.account.toLowerCase().includes(q) ||
      (p.trxId && p.trxId.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleOpenApproveModal = (req: PayoutRequest) => {
    setSelectedRequest(req);
    // Generate realistic default bKash/Nagad/BEFTN TrxID
    const randomTrx = 'TRX-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setTrxInput(randomTrx);
  };

  const handleConfirmDisbursement = () => {
    if (!selectedRequest) return;
    onApprovePayout(selectedRequest.id, trxInput.trim() || 'TRX-MANUAL-APPROVED');
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-semibold">Pending Disbursements</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white mt-1.5">
            ৳{totalPendingAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{pendingRequests.length} payout request(s) awaiting approval</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold">Total Disbursed to Vendors</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white mt-1.5">
            ৳{totalCompletedAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{completedRequests.length} settlement(s) successfully paid</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300 font-semibold">Platform Fee Deduction</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-black text-purple-300 mt-1.5">
            {commissionRate}%
          </div>
          <span className="text-[11px] text-purple-400/80">Automatically deducted before payout</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor, phone, TrxID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Pending', 'Completed', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500 text-black shadow-xs font-bold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">No payout requests found matching this filter.</p>
          <p className="text-xs text-slate-500 mt-1">Vendor withdrawal requests submitted from Seller Center will populate here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs text-slate-300 min-w-[600px]">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Request ID & Date</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Payout Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status & Trx</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white block">{req.id}</span>
                    <span className="text-[10px] text-slate-400">{req.requestedAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{req.sellerName}</span>
                    <span className="text-[11px] text-cyan-400 font-mono">ID: {req.sellerId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {req.method === 'bank' ? (
                        <Building className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                      )}
                      <span className="font-bold uppercase text-white">{req.method}</span>
                    </div>
                    <span className="font-mono text-slate-300 text-[11px] block mt-0.5">
                      {req.account} {req.bankName ? `(${req.bankName})` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-extrabold font-mono text-emerald-400">
                      ৳{req.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'Completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : req.status === 'Pending'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                    {req.trxId && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">
                        Trx: {req.trxId}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenApproveModal(req)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Disburse Funds"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Disburse</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectPayout(req.id)}
                          className="px-2 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs transition-all cursor-pointer"
                          title="Reject Payout Request"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Disbursement Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Confirm Merchant Disbursement</span>
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div>Merchant: <strong className="text-white">{selectedRequest.sellerName}</strong></div>
                <div>Amount: <strong className="text-emerald-400 font-mono text-sm">৳{selectedRequest.amount.toLocaleString()}</strong></div>
                <div>
                  Transfer Method:{' '}
                  <span className="font-bold uppercase text-cyan-300">{selectedRequest.method}</span> ({selectedRequest.account})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank / bKash / Nagad Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  required
                  value={trxInput}
                  onChange={(e) => setTrxInput(e.target.value)}
                  placeholder="e.g. TRX-9J2K18"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  This transaction ID will be stored in the ledger and shown to the merchant.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisbursement}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                Confirm Disbursement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
