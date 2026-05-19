"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useApp } from "@/src/Context/AppContext";
import { useRouter } from "next/navigation";
import { getInitials } from "@/lib/utils";

interface TopbarProps {
  placeholder?: string;
  onSearch?: (q: string) => void;
}

export function Topbar({ placeholder = "Tìm kiếm...", onSearch }: TopbarProps) {
  const { user, logout } = useApp();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      // chuyển về login
      router.replace("/auth/login");

      // refresh để clear cache/state
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 fixed top-0 right-0 z-40 bg-[#f7f9fb] border-b border-[#c2c6d6] shadow-sm flex items-center justify-between px-8 w-full md:w-[calc(100%-280px)] transition-all">
      {/* Mobile menu */}
      <button className="md:hidden p-2 text-[#424754] hover:bg-[#eceef0] rounded-full">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center bg-[#f2f4f6] border border-[#c2c6d6] rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-[#0058be] focus-within:border-transparent transition-all">
        <Search size={16} className="text-[#424754] mr-2 shrink-0" />

        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-[14px] text-[#191c1e] w-full placeholder:text-[#727785]"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#424754] hover:text-[#0058be] hover:bg-[#eceef0] rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full" />
        </button>

        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-full bg-[#2170e4] text-white flex items-center justify-center text-[13px] font-bold hover:bg-[#0058be] transition-colors"
          title="Đăng xuất"
        >
          {user ? getInitials(user.fullName) : "?"}
        </button>
      </div>
    </header>
  );
}
