import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  Percent,
  Calendar,
  DollarSign,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { Coupon } from '../../types';

interface AdminCouponsManagerProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  onUpdateCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (couponId: string) => void;
}

export const AdminCouponsManager: React.FC<AdminCouponsManagerProps> = ({
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Open Create Modal
  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinOrderAmount('500');
    setExpiryDate('2026-12-31');
    setIsActive(true);
    setDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinOrderAmount(coupon.minOrderAmount ? coupon.minOrderAmount.toString() : '');
    setExpiryDate(coupon.expiryDate || '');
    setIsActive(coupon.isActive);
    setDescription(coupon.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = code.trim().toUpperCase();
    const val = parseFloat(discountValue);

    if (!cleanCode) {
      setFormError('Coupon code is required.');
      return;
    }

    if (isNaN(val) || val <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }

    if (discountType === 'percentage' && val > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    // Check code duplication if adding new or renaming
    const existing = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.id !== editingCoupon?.id
    );
    if (existing) {
      setFormError(`A coupon with code "${cleanCode}" already exists.`);
      return;
    }

    const minAmount = minOrderAmount ? parseFloat(minOrderAmount) : undefined;

    if (editingCoupon) {
      onUpdateCoupon({
        ...editingCoupon,
        code: cleanCode,
        discountType,
        discountValue: val,
        minOrderAmount: minAmount,
        expiryDate: expiryDate || undefined,
        isActive,
        description: description.trim() || undefined,
      });
    } else {
      onAddCoupon({
        code: cleanCode,
        discountType,
        discountValue: val,
        minOrderAmount: minAmount,
        expiryDate: expiryDate || undefined,
        isActive,
        usageCount: 0,
        description: description.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Quick toggle active/inactive status
  const handleToggleActive = (coupon: Coupon) => {
    onUpdateCoupon({
      ...coupon,
      isActive: !coupon.isActive,
    });
  };

  // Check if coupon is expired
  const isCouponExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return expiryDate < today;
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="admin-search-coupons-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by code or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          id="admin-add-coupon-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons List Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <Tag className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    <span>No coupons found. Create your first promotional discount coupon!</span>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const expired = isCouponExpired(coupon.expiryDate);
                  return (
                    <tr key={coupon.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-xs tracking-wider">
                            {coupon.code}
                          </span>
                        </div>
                        {coupon.description && (
                          <span className="text-[10px] text-slate-400 block mt-0.5 max-w-xs truncate">
                            {coupon.description}
                          </span>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-4 font-semibold text-white font-mono">
                        {coupon.discountType === 'percentage' ? (
                          <span className="text-emerald-400">{coupon.discountValue}% OFF</span>
                        ) : (
                          <span className="text-emerald-400">৳{coupon.discountValue} FLAT OFF</span>
                        )}
                      </td>

                      {/* Min spend */}
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : 'No minimum'}
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4">
                        {coupon.expiryDate ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span className={expired ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                              {coupon.expiryDate}
                            </span>
                            {expired && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/40 uppercase">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Never expires</span>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                            coupon.isActive && !expired
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/80'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive && !expired ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          <span>{coupon.isActive && !expired ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Usage */}
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {coupon.usageCount || 0} times
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`edit-coupon-${coupon.id}`}
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all"
                            title="Edit Coupon"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-coupon-${coupon.id}`}
                            onClick={() => setDeleteConfirmId(coupon.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Alert Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Delete Coupon Code</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete this coupon? Customers will no longer be able to use this code at checkout.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCoupon(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0d1020] rounded-2xl border border-cyan-500/40 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              {/* Coupon Code */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Coupon Code* (Uppercase)</label>
                <input
                  id="coupon-form-code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  placeholder="e.g. FLASH25 or ZEST100"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono uppercase tracking-wider focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Type*</label>
                  <select
                    id="coupon-form-type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage (%)*' : 'Discount Amount (৳)*'}
                  </label>
                  <input
                    id="coupon-form-value"
                    type="number"
                    required
                    min="1"
                    max={discountType === 'percentage' ? '100' : undefined}
                    step="any"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 150'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Minimum Order Amount */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Minimum Order Subtotal (৳) (Optional)</label>
                <input
                  id="coupon-form-min-spend"
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="e.g. 500 (leave blank for no minimum)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Expiry Date (Optional)</label>
                <input
                  id="coupon-form-expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Notes (Optional)</label>
                <input
                  id="coupon-form-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special weekend promotion 10% off"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Switch */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Active Status*</span>
                  <span className="text-[11px] text-slate-400">
                    {isActive ? 'Coupon is currently enabled and can be used by customers' : 'Coupon is disabled'}
                  </span>
                </div>
                <button
                  type="button"
                  id="coupon-form-status-toggle"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isActive ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="save-coupon-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
