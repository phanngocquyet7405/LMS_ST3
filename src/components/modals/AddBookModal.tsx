"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import bookService from "@/src/app/service/BookService";
import type { Book } from "@/lib/index";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (book: Book) => void;
}

export function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author: "",
    category: "",
    description: "",
    quantity: 1,
    publishedYear: new Date().getFullYear(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "publishedYear" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.isbn.trim()) {
        throw new Error("ISBN is required");
      }
      if (formData.quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      const newBook = await bookService.create({
        title: formData.title,
        isbn: formData.isbn,
        description: formData.description,
        quantity: formData.quantity,
        publishedAt: formData.publishedYear.toString(),
      });

      onSuccess(newBook);
      setFormData({
        title: "",
        isbn: "",
        author: "",
        category: "",
        description: "",
        quantity: 1,
        publishedYear: new Date().getFullYear(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create book");
      console.error("[v0] Error creating book:", err);
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
          <h2 className="text-xl font-semibold text-[#191c1e]">Add New Book</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f0f1f3] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book title"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              ISBN *
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN code"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#424754] mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#424754] mb-2">
                Year Published
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min={1000}
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-3 py-2 border border-[#c2c6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2170e4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424754] mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Book description"
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
            {loading ? "Adding..." : "Add Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
