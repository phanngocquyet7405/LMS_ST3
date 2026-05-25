"use client";

import { useEffect, useState } from "react";
import { CategoriesService } from "../../service/CategoriesService";
import type { Category } from "@/lib/index";
import { AddCategoryModal } from "@/src/components/modals/AddCategoryModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

const CATEGORY_ICONS = ["📚", "🔬", "🎭", "🏛️", "🌍", "💡", "🎨", "⚙️"];
const CATEGORY_COLORS = [
  { bg: "bg-[#2170e4]/10", text: "text-[#0058be]", dot: "bg-[#0058be]" },
  { bg: "bg-[#b75b00]/10", text: "text-[#924700]", dot: "bg-[#924700]" },
  { bg: "bg-[#505f76]/10", text: "text-[#505f76]", dot: "bg-[#505f76]" },
  { bg: "bg-[#ba1a1a]/10", text: "text-[#ba1a1a]", dot: "bg-[#ba1a1a]" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const PER_PAGE = 8;

  useEffect(() => {
    let isMounted = true;

    // Loại bỏ việc gọi hàm thay đổi trạng thái đồng bộ bên ngoài khối tiến trình bất đồng bộ
    CategoriesService.getAll()
      .then((data) => {
        if (!isMounted) return;
        setCategories(data || []);
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
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      setLoading(true);
      await CategoriesService.delete(id);

      // Lấy lại danh sách mới sau khi xóa thành công
      const data = await CategoriesService.getAll();
      setCategories(data || []);

      // Nếu xóa phần tử ở trang cuối làm trang đó trống dữ liệu, tự động lùi trang
      const newTotalPages = Math.ceil(data.length / PER_PAGE) || 1;
      if (page > newTotalPages) {
        setPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa danh mục này vì có thể đã chứa sách gắn liền.");
    } finally {
      setLoading(false);
    }
  };

  // Logic phân trang ở Client-side
  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Hàm chuyển đổi trang an toàn
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddCategorySuccess = (newCategory: Category) => {
    setCategories([newCategory, ...categories]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1e]">
            Categories Catalog
          </h1>
          <p className="text-sm text-[#424754]">
            Organize the library inventory by genres, technical domains, and
            topics.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0058be] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#005ac2] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Category
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-lg border border-[#c2c6d6] p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727785]" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be] transition-colors"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-[#424754] text-sm">
            Không tìm thấy danh mục nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginated.map((category, index) => {
              const icon = CATEGORY_ICONS[category.id % CATEGORY_ICONS.length];
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-[#424754] hover:text-[#0058be] hover:bg-[#2170e4]/10 rounded-md transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1.5 text-[#424754] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center text-lg shadow-inner">
                        {icon}
                      </div>
                      <h3 className="font-semibold text-[#191c1e] text-base truncate pr-12">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#424754] line-clamp-2 mb-4">
                      {category.description ||
                        "No specific description available for this category."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#eceef0] flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${color.bg} ${color.text}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${color.dot}`} />
                      Genre Group
                    </span>
                    <span className="text-[11px] font-medium text-[#727785] tabular-nums">
                      {category._count?.books ?? 0} books
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="pt-4 border-t border-[#c2c6d6] flex items-center justify-between bg-transparent">
        <span className="text-sm text-[#424754]">
          Showing{" "}
          <span className="font-semibold text-[#191c1e]">
            {categories.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#191c1e]">
            {Math.min(page * PER_PAGE, categories.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#191c1e]">
            {categories.length}
          </span>{" "}
          categories
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="p-2 rounded-lg text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Cải tiến hiển thị danh sách trang linh hoạt hơn thay vì giới hạn cứng tối đa 3 trang */}
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
                  className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${
                    p === page
                      ? "bg-[#0058be] text-white"
                      : "text-[#424754] hover:bg-[#f2f4f6]"
                  }`}
                >
                  {p}
                </button>
              </div>
            ))}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="p-2 rounded-lg text-[#424754] hover:bg-[#f2f4f6] disabled:opacity-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddCategorySuccess}
      />
    </div>
  );
}
