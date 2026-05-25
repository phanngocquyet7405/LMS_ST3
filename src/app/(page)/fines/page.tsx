"use client";

import { useEffect, useState } from "react";
import fineService from "../../service/FineService";
import type { Fine } from "@/lib";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AddFineModal } from "@/src/components/modals/AddFineModal";
import {
  Plus,
  Search,
  Wallet,
  BadgeDollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Zap,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]",
  },
  PAID: {
    label: "Paid",
    className: "bg-[#f0fdf4] text-[#166534] border border-[#dcfce7]",
  },
};

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]); // Luôn khởi tạo là mảng rỗng để an toàn
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "PAID">(
    "ALL",
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const PER_PAGE = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchFines = async () => {
      try {
        setLoading(true);
        const response = await fineService.getAll();

        if (!isMounted) return;

        // Cơ chế kiểm tra an toàn cấu trúc dữ liệu trả về từ API
        if (response && Array.isArray(response)) {
          setFines(response);
        } else if (response && Array.isArray(response.data)) {
          setFines(response.data);
        } else {
          setFines([]); // Fallback về mảng rỗng nếu API không đúng chuẩn mảng
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tiền phạt:", error);
        if (isMounted) setFines([]); // Tránh undefined khi lỗi
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFines();

    return () => {
      isMounted = false;
    };
  }, []);

  // Đảm bảo tạo một mảng an toàn (safeFines) để tính toán, tránh lỗi undefined hoàn toàn
  const safeFines = fines || [];

  // Logic lọc dữ liệu (Bổ sung thêm kiểm tra dấu chấm hỏi ? đề phòng dữ liệu b.user bị null)
  const filtered = safeFines.filter((f) => {
    const statusMatch = filterStatus === "ALL" || f?.status === filterStatus;
    const nameMatch =
      f?.borrow?.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ??
      false;
    const idMatch = f?.id?.toString().includes(search) ?? false;

    return statusMatch && (nameMatch || idMatch);
  });

  // Tính toán phân trang dựa trên mảng đã lọc
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;

  // Tính toán các thông số thống kê một cách an toàn
  const totalFineAmount = safeFines.reduce(
    (sum, f) => sum + (f?.amount || 0),
    0,
  );
  const pendingFines = safeFines.filter((f) => f?.status === "PENDING");
  const pendingAmount = pendingFines.reduce(
    (sum, f) => sum + (f?.amount || 0),
    0,
  );
  const collectedAmount = totalFineAmount - pendingAmount;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2
            className="text-[32px] font-bold leading-10 text-[#191c1e]"
            style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
          >
            Fines & Penalties
          </h2>
          <p className="text-[14px] text-[#424754] mt-1">
            Track and manage library fine collections.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#0058be] text-white px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wide hover:bg-[#004395] transition-colors shadow-sm"
        >
          <Plus size={16} /> Collect New Fine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Collected",
            value: formatCurrency(collectedAmount),
            icon: Wallet,
            iconBg: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Pending Fines",
            value: formatCurrency(pendingAmount),
            icon: BadgeDollarSign,
            iconBg: "bg-amber-50 text-amber-600",
            count: `${pendingFines.length} unpaid`,
          },
          {
            label: "Collection Rate",
            value:
              totalFineAmount > 0
                ? `${Math.round((collectedAmount / totalFineAmount) * 100)}%`
                : "0%",
            icon: BarChart3,
            iconBg: "bg-blue-50 text-blue-600",
          },
        ].map(({ label, value, icon: Icon, iconBg, count }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 border border-[#c2c6d6] shadow-sm flex items-center justify-between h-28"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                {label}
              </span>
              <span
                className="text-[28px] font-bold text-[#191c1e]"
                style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
              >
                {value}
              </span>
              {count && (
                <span className="text-[11px] text-[#727785]">{count}</span>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}
            >
              <Icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex border border-[#c2c6d6] rounded-xl overflow-hidden p-1 bg-[#eceef0]/50 w-full md:w-auto">
          {(["ALL", "PENDING", "PAID"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-all capitalize ${
                filterStatus === status
                  ? "bg-white text-[#0058be] shadow-sm border border-[#c2c6d6]/30"
                  : "text-[#424754] hover:text-[#191c1e]"
              }`}
            >
              {status === "ALL" ? "All Fines" : status.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727785]"
          />
          <input
            type="text"
            placeholder="Search by reader name or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c6d6] rounded-xl text-[14px] text-[#191c1e] placeholder-[#727785] focus:outline-none focus:border-[#0058be] transition-colors"
          />
        </div>
      </div>

      {/* Table Component */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f4f6] border-b border-[#c2c6d6]">
                {[
                  "Fine ID",
                  "Reader Name",
                  "Reason",
                  "Amount",
                  "Issued Date",
                  "Status",
                  "",
                ].map((th) => (
                  <th
                    key={th}
                    className="py-3.5 px-4 text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-[#c2c6d6]/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#727785]">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              ) : (
                paginated.map((f) => {
                  const badge = STATUS_BADGE[f.status] || {
                    label: f.status,
                    className: "",
                  };
                  return (
                    <tr
                      key={f.id}
                      className="hover:bg-[#f7f9fb] transition-colors group"
                    >
                      <td className="py-4 px-4 text-[#424754] font-medium">
                        #{f.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#191c1e]">
                          {f.borrow?.user?.fullName ?? "Unknown Reader"}
                        </div>
                        <div className="text-[11px] text-[#727785] mt-0.5">
                          Borrow ID: #{f.borrowId}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#424754] max-w-xs truncate">
                        {f.reason || "Late return penalty"}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#191c1e]">
                        {formatCurrency(f.amount)}
                      </td>
                      <td className="py-4 px-4 text-[#424754] whitespace-nowrap">
                        {formatDate(f.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {f.status === "PENDING" && (
                            <button
                              onClick={() =>
                                alert("Chức năng đang được phát triển")
                              }
                              className="bg-[#2170e4]/10 hover:bg-[#2170e4]/20 text-[#0058be] px-3 py-1 rounded-lg text-[12px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <Zap size={12} /> Pay
                            </button>
                          )}
                          <button className="p-1 text-[#727785] hover:text-[#191c1e] rounded transition-colors">
                            <MoreVertical size={16} />
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

        {/* Pagination Section */}
        <div className="px-4 py-3 border-t border-[#c2c6d6] flex items-center justify-between bg-white">
          <p className="text-[14px] text-[#424754]">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1} to{" "}
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
            entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-[#f2f4f6] text-[#424754] disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from(
              { length: Math.min(3, totalPages) },
              (_, i) => page - 1 + i,
            )
              .filter((p) => p > 0 && p <= totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-[12px] font-semibold flex items-center justify-center transition-colors ${
                    p === page
                      ? "bg-[#0058be] text-white"
                      : "text-[#191c1e] hover:bg-[#f2f4f6]"
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-[#f2f4f6] text-[#424754] disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AddFineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(fine) => {
          setFines([fine, ...fines]);
        }}
      />
    </div>
  );
}
