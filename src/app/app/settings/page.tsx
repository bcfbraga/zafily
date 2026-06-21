import { Topbar } from "@/components/zafily/Topbar";
import { ZafilyBadge } from "@/components/zafily/Badge";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" description="Manage your account and preferences" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[720px] mx-auto space-y-6">

          {/* Profile */}
          <section className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
            <h2 className="font-heading font-semibold text-white mb-5">Profile</h2>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#6C63FF] flex items-center justify-center text-xl font-bold text-white shrink-0">
                B
              </div>
              <div>
                <p className="font-medium text-white">Bruna Braga</p>
                <p className="text-sm text-[#7E78B8]">bcfbraga@gmail.com</p>
              </div>
              <button className="ml-auto h-9 px-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,255,255,0.09)] transition-colors">
                Change photo
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First name", value: "Bruna" },
                { label: "Last name", value: "Braga" },
                { label: "Email", value: "bcfbraga@gmail.com" },
                { label: "Phone", value: "" },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-medium text-[#B8B4E8]">{label}</label>
                  <input
                    type="text"
                    defaultValue={value}
                    placeholder={value ? undefined : "Not set"}
                    className="w-full h-11 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
                  />
                </div>
              ))}
            </div>
            <button className="mt-5 h-10 px-5 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[10px] transition-colors">
              Save changes
            </button>
          </section>

          {/* Plan */}
          <section className="card-highlight rounded-[20px] p-6 shadow-[0_0_32px_rgba(108,99,255,0.18)]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading font-semibold text-white mb-1">Current plan</h2>
                <p className="text-xs text-[#7E78B8]">Manage your subscription</p>
              </div>
              <ZafilyBadge variant="info">Pro</ZafilyBadge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {[
                { label: "Products", value: "38 / unlimited" },
                { label: "Platforms", value: "5 / 10" },
                { label: "Monthly clicks", value: "12,840" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[rgba(255,255,255,0.06)] rounded-[12px] p-4">
                  <p className="text-[10px] text-[#7E78B8] uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-heading font-semibold text-white text-sm">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button className="h-9 px-4 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[10px] transition-colors">
                Upgrade plan
              </button>
              <button className="h-9 px-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,255,255,0.09)] transition-colors">
                Billing history
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
            <h2 className="font-heading font-semibold text-white mb-5">Notifications</h2>
            <div className="space-y-4">
              {[
                { label: "Weekly performance report", desc: "Receive a summary of your clicks and revenue every Monday", enabled: true },
                { label: "Platform disconnected", desc: "Alert when a platform connection expires or fails", enabled: true },
                { label: "New product detected", desc: "Notify when a new product is auto-detected from your links", enabled: false },
                { label: "Revenue milestone", desc: "Celebrate when you hit a new revenue milestone", enabled: false },
              ].map(({ label, desc, enabled }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-[#7E78B8] mt-0.5">{desc}</p>
                  </div>
                  <button
                    className={`shrink-0 w-10 h-6 rounded-full transition-colors relative ${enabled ? "bg-[#6C63FF]" : "bg-[rgba(255,255,255,0.12)]"}`}
                    aria-label="toggle"
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? "left-5" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Danger zone */}
          <section className="bg-[#20203A] border border-[rgba(255,95,126,0.20)] rounded-[20px] p-6">
            <h2 className="font-heading font-semibold text-[#FF5F7E] mb-1">Danger zone</h2>
            <p className="text-xs text-[#7E78B8] mb-5">Irreversible actions. Proceed with caution.</p>
            <div className="flex gap-3">
              <button className="h-9 px-4 border border-[rgba(255,95,126,0.30)] text-[#FF5F7E] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,95,126,0.08)] transition-colors">
                Delete all data
              </button>
              <button className="h-9 px-4 border border-[rgba(255,95,126,0.30)] text-[#FF5F7E] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,95,126,0.08)] transition-colors">
                Close account
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
