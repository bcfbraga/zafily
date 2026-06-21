"use client";

import { useState } from "react";
import { X, ExternalLink, Lock, Loader2, AlertCircle } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: (data: { status: string; publisherId: string; connectedAt: string }) => void;
}

export function AwinConnectModal({ onClose, onSuccess }: Props) {
  const [publisherId, setPublisherId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/integrations/awin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publisherId, apiToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Falha na conexão. Tente novamente.");
        return;
      }

      onSuccess(data);
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.60)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-[#1A1A2E] border border-[rgba(255,255,255,0.10)] rounded-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.50)] p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">Conectar C&A via Awin</h2>
            <p className="text-sm text-[#7E78B8] mt-1">
              Informe suas credenciais Awin para vincular sua conta de afiliada.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#7E78B8] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info box */}
        <div className="bg-[rgba(108,99,255,0.10)] border border-[rgba(108,99,255,0.22)] rounded-[14px] p-4 mb-6 text-sm text-[#B8B4E8] leading-relaxed">
          A conexão com a C&A é feita pela rede Awin. Para conectar, você precisa ter uma conta Awin
          e estar inscrita no{" "}
          <span className="text-white font-medium">programa C&A BR</span>.
          Informe seu Publisher ID e API Token — o token fica criptografado e nunca é exibido novamente.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Publisher ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B4E8]">Publisher ID</label>
            <input
              type="text"
              inputMode="numeric"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="Ex: 1234567"
              required
              disabled={loading}
              className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
            />
            <p className="text-[11px] text-[#7E78B8]">
              Encontrado em Awin → Account → Publisher account details.
            </p>
          </div>

          {/* API Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B4E8]">API Token</label>
            <div className="relative">
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Cole seu API token aqui"
                required
                disabled={loading}
                className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 pr-10 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all disabled:opacity-50"
              />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7E78B8]" />
            </div>
            <p className="text-[11px] text-[#7E78B8]">
              Encontrado em Awin → Account → API credentials.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-[rgba(255,95,126,0.10)] border border-[rgba(255,95,126,0.24)] rounded-[12px] p-3.5">
              <AlertCircle className="w-4 h-4 text-[#FF5F7E] shrink-0 mt-0.5" />
              <p className="text-sm text-[#FF5F7E]">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading || !publisherId || !apiToken}
              className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-[12px] transition-colors text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando...
                </>
              ) : (
                "Conectar C&A"
              )}
            </button>
            <a
              href="https://ui.awin.com/user/api-credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-11 px-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] hover:text-white text-sm font-medium rounded-[12px] transition-colors shrink-0"
            >
              Abrir Awin
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </form>

        {/* Security note */}
        <div className="mt-5 flex items-center gap-2 text-[11px] text-[#7E78B8]">
          <Lock className="w-3 h-3 shrink-0" />
          Seu token é criptografado antes de ser salvo e nunca fica visível após a conexão.
        </div>
      </div>
    </div>
  );
}
