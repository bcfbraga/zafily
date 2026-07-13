"use client";

import { useEffect, useState } from "react";
import { ZafilyLogo } from "@/components/zafily/Logo";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
      if (!session) setError("Este link expirou ou já foi usado. Solicite um novo.");
    });
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Não foi possível redefinir sua senha. Tente novamente.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F6F6FB] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <CheckCircle2 className="w-12 h-12 text-[#00D4AA] mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-[#16162B] mb-2">Senha redefinida</h1>
          <p className="text-sm text-[#4B4768] mb-6">Sua senha foi alterada com sucesso.</p>
          <button
            onClick={() => { router.push("/app"); router.refresh(); }}
            className="inline-flex h-11 px-6 items-center bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[12px] transition-colors"
          >
            Ir para o painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6FB] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-10">
          <Link href="/"><ZafilyLogo size={32} /></Link>
        </div>

        <div className="bg-white border border-black/[0.08] rounded-[20px] p-8 shadow-[0_24px_80px_rgba(23,23,60,0.10)]">
          <h1 className="font-heading font-bold text-[24px] text-[#16162B] mb-1">Nova senha</h1>
          <p className="text-sm text-[#716C8C] mb-8">Escolha uma nova senha para sua conta.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4B4768]">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                disabled={loading || !ready}
                className="w-full h-12 bg-[#F6F6FB] border border-black/[0.10] text-[#16162B] placeholder:text-[#9B96AF] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4B4768]">Confirmar senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                minLength={8}
                disabled={loading || !ready}
                className="w-full h-12 bg-[#F6F6FB] border border-black/[0.10] text-[#16162B] placeholder:text-[#9B96AF] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-[rgba(225,29,72,0.06)] border border-[rgba(225,29,72,0.20)] rounded-[12px] p-3.5">
                <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
                <p className="text-sm text-[#BE123C]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full flex items-center justify-center gap-2 h-12 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 text-white font-semibold rounded-[12px] transition-colors mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Redefinir senha"}
            </button>
          </form>
        </div>

        {!ready && !error && (
          <p className="text-center text-sm text-[#716C8C] mt-6">Verificando link...</p>
        )}
        {error && (
          <p className="text-center text-sm text-[#716C8C] mt-6">
            <Link href="/forgot-password" className="text-[#6C63FF] hover:text-[#5851E0] font-medium transition-colors">
              Solicitar novo link
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
