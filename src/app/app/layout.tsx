import { Sidebar } from "@/components/zafily/Sidebar";
import { MobileBottomNav } from "@/components/zafily/MobileBottomNav";
import { AccountGate } from "@/components/zafily/AccountGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-dvh bg-[#F6F6FB] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
      <MobileBottomNav />
      <AccountGate />
    </div>
  );
}
