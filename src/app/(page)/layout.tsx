import { Sidebar } from "@/src/components/layout/Sidebar";
import { Topbar } from "@/src/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[280px]">
        <Topbar />
        <main className="flex-1 mt-16 p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
