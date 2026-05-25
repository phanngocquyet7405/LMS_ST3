"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import borrowService from "@/src/app/service/BorrowService";
import type { Borrow } from "@/lib/index";

interface CreateBorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (borrow: Borrow) => void;
}

export function CreateBorrowModal({ isOpen, onClose, onSuccess }: CreateBorrowModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    bookId: "",
    borrowDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!formData.userId) {
        throw new Error("User ID is required");
      }
      if (!formData.bookId) {
        throw new Error("Book ID is required");
      }
      if (!formData.dueDate) {
        throw new Error("Due date is required");
      }

      const newBorrow = await borrowService.create({
        userId: parseInt(formData.userId),
        bookId: parseInt(formData.bookId),
        borrowDate: formData.borrowDate,
        dueDate: formData.dueDate,
      });

      onSuccess(newBorrow);
      setFormData({
        userId: "",
        bookId: "",
        borrowDate: new Date().toISOString().split("T")[0],
        dueDate: "",
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create borrow record");
      console.error("[v0] Error creating borrow:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate default due date (14 days from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#c2c6d6]">
          <h2 className="text-xl font-semibold text-[#191c1e]">Create Borrow Record</h2>
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
              User ID *
            </label>
            <input
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="User ID"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Book ID *
            </label>
            <input
              type="number"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              placeholder="Book ID"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#424754] mb-2">
                Borrow Date *
              </label>
              <input
                type="date"
                name="borrowDate"
                value={formData.borrowDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424754] mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                placeholder={getDefaultDueDate()}
                className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
              />
            </div>
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
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
