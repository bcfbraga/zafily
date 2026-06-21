"use client";

import { useState } from "react";
import { ZafilyLogo } from "@/components/zafily/Logo";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const perks = [
  "Importe links afiliados ilimitados",
  "Detecção automática de produtos e comissões",
  "Conecte todas as principais plataformas",
  "Acompanhe cliques e performance",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "Este email já está cadastrado. Tente fazer login."
        : "Não foi possível criar a conta. Tente novamente.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#111126] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <CheckCircle2 className="w-12 h-12 text-[#00D4AA] mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-white mb-2">Confirme seu email</h1>
          <p className="text-sm text-[#B8B4E8] mb-6">
            Enviamos um link de confirmação para <span className="text-white font-medium">{email}</span>.
            Clique no link para ativar sua conta.
          </p>
          <Link href="/login" className="text-sm text-[#6C63FF] hover:text-[#7C75FF] transition-colors">
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111126] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center mb-10">
          <Link href="/"><ZafilyLogo size={32} /></Link>
        </div>

        <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
          <h1 className="font-heading font-bold text-[24px] text-white mb-1">Criar sua conta</h1>
          <p className="text-sm text-[#7E78B8] mb-6">Grátis para começar. Sem cartão de crédito.</p>

          <div className="space-y-2 mb-7">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" />
                <span className="text-xs text-[#B8B4E8]">{p}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#B8B4E8]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                disabled={loading}
                className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#B8B4E8]">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                disabled={loading}
                className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-[rgba(255,95,126,0.10)] border border-[rgba(255,95,126,0.24)] rounded-[12px] p-3.5">
                <AlertCircle className="w-4 h-4 text-[#FF5F7E] shrink-0" />
                <p className="text-sm text-[#FF5F7E]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 text-white font-semibold rounded-[12px] transition-colors mt-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.08)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#20203A] text-xs text-[#7E78B8]">ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-[#B8B4E8] font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>

          <p className="text-center text-xs text-[#7E78B8] mt-5">
            Ao criar conta, você concorda com nossos{" "}
            <a href="#" className="text-[#6C63FF] hover:underline">Termos</a> e{" "}
            <a href="#" className="text-[#6C63FF] hover:underline">Política de Privacidade</a>.
          </p>
        </div>

        <p className="text-center text-sm text-[#7E78B8] mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-[#6C63FF] hover:text-[#7C75FF] font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
