"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import borrowService from "@/src/app/service/BorrowService";

interface ReturnBorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowId: number | null;
  onSuccess: () => void;
}

export function ReturnBorrowModal({ isOpen, onClose, borrowId, onSuccess }: ReturnBorrowModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowId) return;

    setError(null);
    setLoading(true);

    try {
      if (!returnDate) {
        throw new Error("Return date is required");
      }

      await borrowService.returnBook(borrowId);

      onSuccess();
      setReturnDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to return book");
      console.error("[v0] Error returning book:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !borrowId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#c2c6d6]">
          <h2 className="text-xl font-semibold text-[#191c1e]">Return Book</h2>
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

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            Borrow ID: <strong>#{borrowId}</strong>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Return Date *
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Book condition, damage notes, etc."
              rows={3}
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4] resize-none"
            />
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
            {loading ? "Returning..." : "Return Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
