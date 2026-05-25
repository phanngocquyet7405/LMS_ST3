"use client";

import { useEffect, useState } from "react";
import authorService from "../../service/AuthorService";
import type { Author } from "@/lib/index";
import { getInitials } from "@/lib/utils";
import { AddAuthorModal } from "@/src/components/modals/AddAuthorModal";
import {
  Plus,
  MapPin,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    let isMounted = true;

    // Chuyển toàn bộ luồng cập nhật trạng thái bất đồng bộ vào bên trong Promise
    // Loại bỏ hoàn toàn việc gọi setState đồng bộ ở phần thân ngoài của effect
    authorService
      .getAll(page, PER_PAGE, search)
      .then((res) => {
        if (!isMounted) return;

        // Bóc tách dữ liệu chuẩn từ PaginatedResponse<Author> (dùng .data và .total)
        const authorList = res.data || [];
        const total = res.total || 0;

        setAuthors(authorList);
        setTotalElements(total);
        setLoading(false);
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
    if (!confirm("Bạn có chắc muốn xóa tác giả này?")) return;
    try {
      setLoading(true);
      await authorService.delete(id);

      // Gọi lại API sau khi xóa thành công để đồng bộ giao diện
      const res = await authorService.getAll(page, PER_PAGE, search);
      setAuthors(res.data || []);
      setTotalElements(res.total || 0);
    } catch (err) {
      console.error("[v0] Error deleting author:", err);
      alert("Có lỗi xảy ra khi xóa tác giả.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthorSuccess = (newAuthor: Author) => {
    setAuthors([newAuthor, ...authors.slice(0, PER_PAGE - 1)]);
    setTotalElements(totalElements + 1);
  };

  const totalPages = Math.ceil(totalElements / PER_PAGE) || 1;

  // Xử lý chuyển trang an toàn từ tương tác người dùng
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1e]">Authors Catalog</h1>
          <p className="text-sm text-[#424754]">
            Manage library authors, biographies, and localized origins.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#2170e4] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#0058be] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Author
        </button>
      </div>

      {/* Grid Content */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-8 h-8 border-4 border-[#2170e4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-16 text-[#424754]">
            Không tìm thấy dữ liệu tác giả nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Actions context menu overlay on hover */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-[#424754] hover:text-[#2170e4] hover:bg-[#2170e4]/10 rounded-md transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="p-1.5 text-[#424754] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#d0e1fb] flex items-center justify-center text-[#0058be] font-bold text-sm shrink-0">
                    {getInitials(author.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#191c1e] text-base truncate">
                      {author.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#424754] mt-0.5">
                      <MapPin size={12} className="text-[#727785]" />
                      <span className="truncate">
                        {author.location || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#424754] line-clamp-3 mb-4 flex-1">
                  {author.bio || "No biography available for this author."}
                </p>

                <div className="pt-3 border-t border-[#eceef0] flex items-center gap-2 text-xs font-medium text-[#0058be]">
                  <BookOpen size={14} />
                  <span>Tracks Inventory Records</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 border-t border-[#c2c6d6] flex items-center justify-between bg-transparent">
        <p className="text-sm text-[#424754]">
          Showing{" "}
          <span className="font-semibold text-[#191c1e]">
            {authors.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#191c1e]">
            {(page - 1) * PER_PAGE + authors.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#191c1e]">{totalElements}</span>{" "}
          authors
        </p>

        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="w-8 h-8 rounded border border-[#c2c6d6] flex items-center justify-center text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => Math.abs(p - page) <= 1 || p === 1 || p === totalPages,
            )
            .map((p, idx, arr) => (
              <div key={p} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-1 text-[#727785] text-xs">...</span>
                )}
                <button
                  onClick={() => handlePageChange(p)}
                  disabled={loading}
                  className={`w-8 h-8 rounded text-[12px] font-semibold flex items-center justify-center transition-colors ${
                    p === page
                      ? "bg-[#2170e4] text-white"
                      : "border border-[#c2c6d6] text-[#424754] hover:bg-[#f2f4f6]"
                  }`}
                >
                  {p}
                </button>
              </div>
            ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="w-8 h-8 rounded border border-[#c2c6d6] flex items-center justify-center text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <AddAuthorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddAuthorSuccess}
      />
    </div>
  );
}
