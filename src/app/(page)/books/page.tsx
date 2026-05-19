"use client";

import { useEffect, useState } from "react";
import bookService from "../../service/BookService";
import type { Book } from "@/lib/index";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const AVAILABILITY_BADGE = (book: Book) => {
  if (book.available === 0)
    return {
      label: "Out of Stock",
      className: "bg-rose-50 text-rose-700 border border-rose-200",
    };
  if (book.available < book.quantity)
    return {
      label: `${book.available} Available`,
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    };
  return {
    label: "Available",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    let isMounted = true;

    // Để tránh lỗi setState đồng bộ trong Effect, ta thực hiện gọi hàm và xử lý
    // các trạng thái cập nhật dữ liệu hoàn toàn bất đồng bộ bên trong khối lệnh xử lý hứa (Promise)
    bookService
      .getAll(page, LIMIT, search)
      .then((res) => {
        if (!isMounted) return;

        // Cập nhật lại chính xác theo cấu trúc thuộc tính của PaginatedResponse trong dự án của bạn
        const bookList = res.data || [];
        const total = res.total || 0;

        setBooks(bookList);
        setTotalElements(total);
        setLoading(false); // Đóng loading tại đây để đảm bảo an toàn render
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa cuốn sách này?")) return;
    try {
      setLoading(true);
      await bookService.delete(id);

      const res = await bookService.getAll(page, LIMIT, search);
      setBooks(res.data || []);
      setTotalElements(res.total || 0);
    } catch (err) {
      console.error(err);
    }
    {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalElements / LIMIT) || 1;

  // Xử lý thay đổi tìm kiếm tách biệt trạng thái loading nếu cần thiết
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setLoading(true); // Kích hoạt trạng thái chờ trực tiếp từ sự kiện tương tác người dùng
  };

  // Xử lý chuyển trang chủ động
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true); // Kích hoạt trạng thái chờ trực tiếp từ sự kiện click chuột
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-[32px] font-bold leading-10 text-[#191c1e]"
            style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
          >
            Book Catalog
          </h2>
          <p className="text-[14px] text-[#424754] mt-1">
            Manage library inventory, add new titles, and track availability.
          </p>
        </div>
        <button className="bg-[#0058be] text-white text-[12px] font-semibold tracking-[0.05em] uppercase px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#005ac2] transition-colors shadow-sm whitespace-nowrap">
          <Plus size={16} /> Add New Book
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727785]"
              />
              <input
                type="text"
                placeholder="Title, ISBN, or Author"
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be] transition-colors"
              />
            </div>
          </div>
          <div className="w-full lg:w-48 space-y-1.5">
            <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
              Category
            </label>
            <select className="w-full appearance-none px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]">
              <option>All Categories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#c2c6d6]">
                {[
                  "Cover",
                  "Title & ISBN",
                  "Author",
                  "Category",
                  "Qty",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-[14px] text-[#727785]"
                  >
                    Không tìm thấy sách nào
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const badge = AVAILABILITY_BADGE(book);
                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-[#f2f4f6] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-10 h-14 bg-[#e6e8ea] rounded shadow-sm overflow-hidden flex items-center justify-center">
                          {book.imageUrl ? (
                            <Image
                              src={book.imageUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[#727785] text-[10px]">
                              IMG
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[16px] text-[#191c1e] group-hover:text-[#0058be] transition-colors leading-6">
                          {book.title}
                        </div>
                        <div className="text-[13px] text-[#424754] mt-0.5">
                          {book.isbn}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#424754]">
                        {book.author?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        {book.category ? (
                          <span className="inline-flex px-2 py-1 rounded bg-[#d0e1fb]/50 text-[#38485d] text-[11px] font-semibold uppercase tracking-wide">
                            {book.category.name}
                          </span>
                        ) : (
                          <span className="text-[#727785] text-[14px]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-[14px] text-[#191c1e]">
                        {book.quantity}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${badge.className}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-[#424754] hover:text-[#0058be] hover:bg-[#2170e4]/10 rounded transition-colors">
                            <Eye size={18} />
                          </button>
                          <button className="p-1.5 text-[#424754] hover:text-[#0058be] hover:bg-[#2170e4]/10 rounded transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-1.5 text-[#424754] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded transition-colors"
                          >
                            <Trash2 size={18} />
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#c2c6d6] bg-white flex items-center justify-between">
          <div className="text-[14px] text-[#424754]">
            Showing{" "}
            <span className="font-semibold text-[#191c1e]">
              {books.length > 0 ? (page - 1) * LIMIT + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#191c1e]">
              {(page - 1) * LIMIT + books.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#191c1e]">
              {totalElements}
            </span>{" "}
            books
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="p-1.5 rounded border border-[#c2c6d6] text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => Math.abs(p - page) <= 1 || p === 1 || p === totalPages,
              )
              .map((p, idx, arr) => {
                return (
                  <div key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-[#727785] text-[12px]">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(p)}
                      disabled={loading}
                      className={`w-8 h-8 rounded text-[12px] font-semibold flex items-center justify-center transition-colors ${
                        p === page
                          ? "bg-[#0058be] text-white"
                          : "text-[#424754] hover:bg-[#f2f4f6]"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                );
              })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded border border-[#c2c6d6] text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
