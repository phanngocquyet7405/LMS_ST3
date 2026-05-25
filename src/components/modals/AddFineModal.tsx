"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import fineService from "@/src/app/service/FineService";
import type { Fine } from "@/lib/index";

interface AddFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (fine: Fine) => void;
}

export function AddFineModal({ isOpen, onClose, onSuccess }: AddFineModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    borrowId: "",
    amount: "",
    reason: "OVERDUE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.borrowId) {
        throw new Error("Borrow ID is required");
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const newFine = await fineService.create({
        borrowId: parseInt(formData.borrowId),
        amount: parseFloat(formData.amount),
        reason: formData.reason,
      });

      onSuccess(newFine);
      setFormData({
        borrowId: "",
        amount: "",
        reason: "OVERDUE",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create fine");
      console.error("[v0] Error creating fine:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#c2c6d6]">
          <h2 className="text-xl font-semibold text-[#191c1e]">Add New Fine</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f0f1f3] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Borrow ID *
            </label>
            <input
              type="number"
              name="borrowId"
              value={formData.borrowId}
              onChange={handleChange}
              placeholder="Borrow ID"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Fine amount"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Reason
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            >
              <option value="OVERDUE">Overdue</option>
              <option value="DAMAGE">Damage</option>
              <option value="LOST">Lost</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-[#c2c6d6]">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-[#c2c6d6] text-[#191c1e] rounded-lg hover:bg-[#f0f1f3] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#2170e4] text-white rounded-lg hover:bg-[#0058be] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Adding..." : "Add Fine"}
          </button>
        </div>
      </div>
    </div>
  );
}
