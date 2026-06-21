import { ZafilyLogo } from "@/components/zafily/Logo";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const perks = [
  "Import unlimited affiliate links",
  "Auto-detect products and commissions",
  "Connect all major platforms",
  "Track clicks and performance",
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#111126] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <ZafilyLogo size={32} />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
          <h1 className="font-heading font-bold text-[24px] text-white mb-1">Create your account</h1>
          <p className="text-sm text-[#7E78B8] mb-6">Free to start. No credit card required.</p>

          {/* Perks */}
          <div className="space-y-2 mb-7">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" />
                <span className="text-xs text-[#B8B4E8]">{p}</span>
              </div>
            ))}
          </div>

          <form action="/app" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#B8B4E8]">First name</label>
                <input
                  type="text"
                  placeholder="Bruna"
                  className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#B8B4E8]">Last name</label>
                <input
                  type="text"
                  placeholder="Braga"
                  className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#B8B4E8]">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#B8B4E8]">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors mt-1"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-xs text-[#7E78B8] mt-5">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[#6C63FF] hover:underline">Terms</a> and{" "}
            <a href="#" className="text-[#6C63FF] hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <p className="text-center text-sm text-[#7E78B8] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6C63FF] hover:text-[#7C75FF] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
