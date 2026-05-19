"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/src/Context/AppContext";
import {
  BookOpen,
  History,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import borrowService from "../../service/BorrowService";

// Khai báo tạm interface thống kê (Bạn có thể map với DashboardOverview từ @/lib/index)
interface DashboardStats {
  totalBooks: number;
  totalBorrows: number;
  totalUsers: number;
  activeFines: number;
}

export default function DashboardPage() {
  const { user } = useApp();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalBorrows: 0,
    totalUsers: 0,
    activeFines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Thực hiện giả lập gọi song song các API thống kê tổng quan
        // Giả sử các API tổng quan trả về thành công:
        const mockStats: DashboardStats = {
          totalBooks: 1248,
          totalBorrows: 84,
          totalUsers: 342,
          activeFines: 125000,
        };

        if (!isMounted) return;
        setStats(mockStats);

        // ── Xử lý gọi API BorrowService (Nơi đang lỗi 403) ──
        try {
          borrowService.getAll().then((data) => {
            // Xử lý dữ liệu nhận được từ API
          });
        } catch (bErr: unknown) {
          console.error(
            "Lỗi lấy danh sách phiếu mượn (Có thể chưa phân quyền):",
            bErr,
          );
          if (isMounted) {
            setBorrowError("Bạn không có quyền xem lịch sử mượn sách gần đây.");
          }
        }
      } catch (err) {
        console.error("Lỗi tải thông tin Dashboard tổng thể:", err);
      } finally {
        if (isMounted) {
          setLoading(false); // Kết thúc loading bất đồng bộ, tránh lỗi ESLint
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-[28px] font-bold text-[#191c1e] tracking-tight">
          Xin chào, {user?.fullName || "Quản trị viên"} 👋
        </h1>
        <p className="text-sm text-[#424754] mt-1">
          Dưới đây là thông tin tổng quan và các hoạt động hệ thống thư viện hôm
          nay.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#424754] uppercase">
              Tổng số sách
            </p>
            <h3 className="text-3xl font-bold text-[#191c1e] tabular-nums">
              {stats.totalBooks}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight size={12} /> +12% tháng này
            </span>
          </div>
          <div className="p-3 bg-[#2170e4]/10 text-[#0058be] rounded-lg">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#424754] uppercase">
              Lượt mượn
            </p>
            <h3 className="text-3xl font-bold text-[#191c1e] tabular-nums">
              {stats.totalBorrows}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight size={12} /> +4% tuần qua
            </span>
          </div>
          <div className="p-3 bg-[#b75b00]/10 text-[#924700] rounded-lg">
            <History size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#424754] uppercase">
              Thành viên
            </p>
            <h3 className="text-3xl font-bold text-[#191c1e] tabular-nums">
              {stats.totalUsers}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight size={12} /> -0.8% hôm nay
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
            <Users size={20} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wider text-[#424754] uppercase">
              Tiền phạt treo
            </p>
            <h3 className="text-3xl font-bold text-[#191c1e] tabular-nums">
              {stats.activeFines.toLocaleString("vi-VN")}đ
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              <Clock size={12} /> Chờ xử lý
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-[#ba1a1a] rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Borrows Section with Fallback Warning */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e] mb-4">
              Hoạt động mượn sách gần đây
            </h2>

            {borrowError ? (
              /* Hiển thị cảnh báo phân quyền thay vì làm crash sập cả trang ứng dụng */
              <div className="flex flex-col items-center justify-center py-10 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <AlertTriangle size={32} className="text-amber-600 mb-2" />
                <h4 className="font-semibold text-amber-900 text-sm">
                  Giới hạn truy cập (403 Forbidden)
                </h4>
                <p className="text-xs text-amber-800 max-w-sm mt-1">
                  {borrowError}
                </p>
              </div>
            ) : (
              <div className="text-sm text-[#424754] py-12 text-center">
                Danh sách phiếu mượn trống hoặc đang được cập nhật.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Side Card */}
        <div className="bg-white rounded-xl border border-[#c2c6d6] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#191c1e] mb-4">
            Lối tắt tác vụ
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 border border-[#c2c6d6] hover:bg-[#f2f4f6] hover:border-[#0058be] transition-colors rounded-lg font-medium text-sm text-[#191c1e]">
              ➕ Tạo phiếu mượn sách mới
            </button>
            <button className="w-full text-left px-4 py-3 border border-[#c2c6d6] hover:bg-[#f2f4f6] hover:border-[#0058be] transition-colors rounded-lg font-medium text-sm text-[#191c1e]">
              📖 Thêm đầu sách vào kho
            </button>
            <button className="w-full text-left px-4 py-3 border border-[#c2c6d6] hover:bg-[#f2f4f6] hover:border-[#0058be] transition-colors rounded-lg font-medium text-sm text-[#191c1e]">
              👤 Kiểm tra thông tin độc giả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
