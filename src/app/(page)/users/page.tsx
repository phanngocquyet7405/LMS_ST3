"use client";

import { useEffect, useState } from "react";
import userService from "../../service/UserService";
import type { User } from "@/lib/index";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

const ROLE_BADGE = (role: string) => {
  const roleConfig: Record<string, { label: string; className: string }> = {
    ADMIN: {
      label: "Admin",
      className: "bg-rose-50 text-rose-700 border border-rose-200",
    },
    LIBRARIAN: {
      label: "Librarian",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    USER: {
      label: "User",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
  };

  return roleConfig[role] || roleConfig.USER;
};

const STATUS_BADGE = (active: boolean) => {
  return active
    ? {
        label: "Active",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      }
    : {
        label: "Inactive",
        className: "bg-slate-50 text-slate-700 border border-slate-200",
      };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    let isMounted = true;

    userService
      .getAll(page, LIMIT, search)
      .then((res) => {
        if (!isMounted) return;

        const userList = res.data || [];
        const total = res.total || 0;

        setUsers(userList);
        setTotalElements(total);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching users:", err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await userService.delete(id);

      const res = await userService.getAll(page, LIMIT, search);
      setUsers(res.data || []);
      setTotalElements(res.total || 0);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalElements / LIMIT) || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setLoading(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
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
            Users Management
          </h2>
          <p className="text-[14px] text-[#424754] mt-1">
            Manage library users, roles, and member information.
          </p>
        </div>
        <button className="bg-[#0058be] text-white text-[12px] font-semibold tracking-[0.05em] uppercase px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#005ac2] transition-colors shadow-sm whitespace-nowrap">
          <Plus size={16} /> Add New User
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
                placeholder="Name, Email, or Phone"
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be] transition-colors"
              />
            </div>
          </div>
          <div className="w-full lg:w-48 space-y-1.5">
            <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
              Role Filter
            </label>
            <select className="w-full appearance-none px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]">
              <option>All Roles</option>
              <option>ADMIN</option>
              <option>LIBRARIAN</option>
              <option>USER</option>
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
                  "Name",
                  "Email",
                  "Phone",
                  "Role",
                  "Status",
                  "Join Date",
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
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-[14px] text-[#727785]"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleBadge = ROLE_BADGE(user.role || "USER");
                  const statusBadge = STATUS_BADGE(user.active !== false);
                  const joinDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US")
                    : "—";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#f2f4f6] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-[16px] text-[#191c1e] group-hover:text-[#0058be] transition-colors">
                            {user.fullName || user.name || "—"}
                          </div>
                          <div className="text-[13px] text-[#424754] mt-0.5">
                            ID: {user.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[14px] text-[#424754]">
                          <Mail size={14} className="text-[#727785]" />
                          {user.email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[14px] text-[#424754]">
                          <Phone size={14} className="text-[#727785]" />
                          {user.phone || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield size={14} className="text-[#727785]" />
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${roleBadge.className}`}
                          >
                            {roleBadge.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${statusBadge.className}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#424754]">
                        {joinDate}
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
                            onClick={() => handleDelete(user.id)}
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
              {users.length > 0 ? (page - 1) * LIMIT + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#191c1e]">
              {(page - 1) * LIMIT + users.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#191c1e]">
              {totalElements}
            </span>{" "}
            users
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
