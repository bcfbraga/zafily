import { Sidebar } from "@/components/zafily/Sidebar";
import { OnboardingGate } from "@/components/zafily/OnboardingGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-[#F6F6FB] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
      <OnboardingGate />
    </div>
  );
}
