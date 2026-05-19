"use client";

import { useEffect, useState } from "react";
import borrowService from "../../service/BorrowService";
import type { Borrow } from "@/lib/index";
import { formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  CheckSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  BORROWING: { label: "Borrowing", className: "bg-[#fef08a] text-[#a16207]" },
  OVERDUE: { label: "Overdue", className: "bg-[#ffdad6] text-[#93000a]" },
  RETURNED: { label: "Returned", className: "bg-[#bbf7d0] text-[#166534]" },
};

export default function BorrowsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]); // Khởi tạo luôn là mảng rỗng để không bị undefined
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchBorrows = async () => {
      try {
        setLoading(true);
        const response = await borrowService.getAll();

        if (!isMounted) return;

        // Cơ chế phòng vệ kiểm tra dữ liệu API trả về có phải là mảng không
        if (response && Array.isArray(response)) {
          setBorrows(response);
        } else if (response && Array.isArray(response.data)) {
          setBorrows(response.data);
        } else {
          setBorrows([]); // Fallback về mảng rỗng nếu API trả về cấu trúc lạ
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách phiếu mượn:", error);
        if (isMounted) setBorrows([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBorrows();

    return () => {
      isMounted = false;
    };
  }, []);

  // Áp dụng cơ chế phòng vệ chống crash bằng toán tử || [] hoặc ?.
  const safeBorrows = borrows || [];
  const paginated = safeBorrows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(safeBorrows.length / PER_PAGE) || 1;

  const active = safeBorrows.filter((b) => b?.status === "BORROWING").length;
  const overdue = safeBorrows.filter((b) => b?.status === "OVERDUE").length;
  const returned = safeBorrows.filter((b) => b?.status === "RETURNED").length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2
            className="text-[32px] font-bold leading-10 text-[#191c1e]"
            style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
          >
            Borrow History
          </h2>
          <p className="text-[14px] text-[#424754] mt-1">
            Manage current borrowings and returns.
          </p>
        </div>
        <button
          onClick={() => alert("Chức năng đang được phát triển")}
          className="flex items-center gap-2 bg-[#ba1a1a] text-white px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wide hover:bg-[#ba1a1a]/90 transition-colors shadow-sm"
        >
          <AlertTriangle size={16} /> Check Overdue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Active Borrows",
            value: active,
            icon: BookOpen,
            iconBg: "bg-[#2170e4]/20",
            iconColor: "text-[#0058be]",
          },
          {
            label: "Overdue Books",
            value: overdue,
            icon: Clock,
            iconBg: "bg-[#ffdad6]/50",
            iconColor: "text-[#ba1a1a]",
            valueColor: "text-[#ba1a1a]",
          },
          {
            label: "Returned Today",
            value: returned,
            icon: CheckSquare,
            iconBg: "bg-[#d0e1fb]/50",
            iconColor: "text-[#505f76]",
          },
        ].map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 border border-[#c2c6d6] shadow-sm flex flex-col justify-between h-32"
          >
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                {label}
              </span>
              <div
                className={`w-8 h-8 rounded-full ${iconBg} ${iconColor} flex items-center justify-center`}
              >
                <Icon size={16} />
              </div>
            </div>
            <span
              className={`text-[32px] font-bold ${valueColor ?? "text-[#191c1e]"}`}
              style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f4f6] border-b border-[#c2c6d6]">
                {[
                  "ID",
                  "Reader Name",
                  "Book Title",
                  "Borrow Date",
                  "Due Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-[#c2c6d6]/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#727785]">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                paginated.map((b) => {
                  const badge = STATUS_BADGE[b.status] || {
                    label: b.status,
                    className: "bg-gray-100 text-gray-700",
                  };
                  const isOverdue = b.status === "OVERDUE";
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#f7f9fb] transition-colors group"
                    >
                      <td className="py-4 px-4 text-[#424754]">#{b.id}</td>
                      <td className="py-4 px-4 font-semibold text-[#191c1e]">
                        {b.user?.fullName ?? `User #${b.userId}`}
                      </td>
                      <td className="py-4 px-4 text-[#191c1e]">
                        {b.items?.[0]?.book?.title ?? "—"}
                        {(b.items?.length ?? 0) > 1 && (
                          <span className="text-[#727785] text-[12px]">
                            {" "}
                            +{b.items!.length - 1} more
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#424754]">
                        {formatDate(b.borrowDate)}
                      </td>
                      <td
                        className={`py-4 px-4 font-medium ${isOverdue ? "text-[#ba1a1a]" : "text-[#424754]"}`}
                      >
                        {formatDate(b.dueDate)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[12px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {b.status !== "RETURNED" && (
                          <button
                            onClick={() =>
                              alert("Chức năng đang được phát triển")
                            }
                            className="text-[#0058be] hover:text-[#004395] text-[12px] font-semibold mr-3 transition-colors flex items-center gap-1 inline-flex"
                          >
                            <RotateCcw size={14} /> Return
                          </button>
                        )}
                        <button className="text-[#424754] hover:text-[#191c1e] transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#c2c6d6] flex items-center justify-between bg-white">
          <span className="text-[14px] text-[#424754]">
            Showing {safeBorrows.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
            {Math.min(page * PER_PAGE, safeBorrows.length)} of{" "}
            {safeBorrows.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-[#f2f4f6] text-[#424754] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-[#f2f4f6] text-[#424754] disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
