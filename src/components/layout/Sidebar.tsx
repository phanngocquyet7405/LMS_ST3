"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  SquareUser,
  Tag,
  History,
  CreditCard,
  UserCircle,
  Library,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/books",
    label: "Books",
    icon: BookOpen,
  },
  {
    href: "/authors",
    label: "Authors",
    icon: SquareUser,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: Tag,
  },
  {
    href: "/borrows",
    label: "Borrows",
    icon: History,
  },
  {
    href: "/fines",
    label: "Fines",
    icon: CreditCard,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className="
        hidden md:flex
        fixed left-0 top-0
        h-screen w-[280px]
        flex-col
        bg-[#f7f9fb]
        border-r border-[#c2c6d6]
        z-50
      "
    >
      {/* Header */}
      <div className="px-6 py-6 border-b border-[#c2c6d6]/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#2170e4] flex items-center justify-center text-white shadow-sm">
            <Library size={20} />
          </div>

          <div>
            <h1 className="text-[20px] font-bold text-[#0058be]">
              Librarian Pro
            </h1>

            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#727785]">
              Admin Terminal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  `
                    relative
                    flex items-center gap-3
                    px-4 py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    `,
                  active
                    ? `
                        bg-[#2170e4]/10
                        text-[#0058be]
                        border-l-4
                        border-[#0058be]
                        rounded-l-none
                      `
                    : `
                        text-[#424754]
                        hover:bg-[#eceef0]
                        hover:text-[#191c1e]
                      `,
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    active ? "text-[#0058be]" : "text-[#727785]",
                  )}
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#c2c6d6]/50">
        <div className="rounded-xl bg-[#eef3fb] p-3">
          <p className="text-xs text-[#424754]">Library Management System</p>

          <p className="text-[11px] text-[#727785] mt-1">Version 1.0</p>
        </div>
      </div>
    </aside>
  );
}
