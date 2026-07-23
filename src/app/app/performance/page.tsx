"use client";

import { useEffect, useState } from "react";
import { BarChart2, Eye, MousePointerClick, Percent, ExternalLink, Package } from "lucide-react";
import { Topbar } from "@/components/zafily/Topbar";

interface Live {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  thumbnails?: string[];
  clicks?: number;
  views?: number;
}

interface Profile {
  username: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 min-w-[180px] bg-white border border-[var(--cr-border)] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[var(--cr-brand-100)] flex items-center justify-center text-[var(--cr-brand-700)] shrink-0">
          {icon}
        </div>
        <span className="text-xs font-medium text-[var(--cr-text-secondary)]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--cr-text-primary)]">{value}</p>
    </div>
  );
}

export default function PerformancePage() {
  const [lives, setLives] = useState<Live[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/lives").then(r => r.json()),
      fetch("/api/profile").then(r => r.json()),
    ]).then(([livesData, profileData]) => {
      setLives(Array.isArray(livesData) ? livesData : []);
      setProfile(profileData ?? null);
      setLoading(false);
    });
  }, []);

  const totalViews = lives.reduce((sum, l) => sum + (l.views ?? 0), 0);
  const totalClicks = lives.reduce((sum, l) => sum + (l.clicks ?? 0), 0);
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : null;

  const ranked = lives
    .slice()
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  const maxViews = Math.max(1, ...ranked.map(l => l.views ?? 0));

  return (
    <>
      <Topbar title="Performance" description="Acompanhe visualizações e cliques das suas vitrines" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[900px] mx-auto">
          {loading ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 h-24 rounded-2xl bg-white border border-[var(--cr-border)] animate-pulse" />)}
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white border border-[var(--cr-border)] animate-pulse" />)}
              </div>
            </div>
          ) : lives.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--cr-brand-100)] flex items-center justify-center">
                <BarChart2 className="w-7 h-7 text-[var(--cr-brand-600)]" />
              </div>
              <div>
                <p className="font-heading font-semibold text-[var(--cr-text-primary)] text-lg">Sem dados ainda</p>
                <p className="text-[var(--cr-text-secondary)] text-sm mt-1 max-w-sm">
                  As visualizações e cliques aparecerão aqui assim que você publicar uma vitrine e compartilhar o link.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* KPI row */}
              <div className="flex gap-4 flex-wrap">
                <StatTile icon={<Eye className="w-3.5 h-3.5" />} label="Visualizações totais" value={formatCount(totalViews)} />
                <StatTile icon={<MousePointerClick className="w-3.5 h-3.5" />} label="Cliques totais" value={formatCount(totalClicks)} />
                <StatTile icon={<Percent className="w-3.5 h-3.5" />} label="CTR médio" value={ctr !== null ? `${ctr.toFixed(1)}%` : "—"} />
              </div>

              {/* Per-vitrine breakdown */}
              <div>
                <h2 className="text-sm font-semibold text-[var(--cr-text-primary)] mb-3">Por vitrine</h2>
                <div className="bg-white border border-[var(--cr-border)] rounded-2xl divide-y divide-[var(--cr-border)]">
                  {ranked.map(live => {
                    const views = live.views ?? 0;
                    const clicks = live.clicks ?? 0;
                    const liveCtr = views > 0 && clicks > 0 ? (clicks / views) * 100 : null;
                    const barWidth = Math.max(4, (views / maxViews) * 100);
                    const thumb = live.thumbnails?.[0];
                    return (
                      <div key={live.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="w-10 h-10 rounded-lg bg-[var(--cr-brand-100)] overflow-hidden shrink-0 flex items-center justify-center">
                          {thumb
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                            : <Package className="w-4 h-4 text-[var(--cr-text-tertiary)]" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-sm font-medium text-[var(--cr-text-primary)] truncate">{live.title}</p>
                            {live.status === "draft" && (
                              <span className="text-[10px] font-semibold text-[var(--cr-text-tertiary)] shrink-0">Rascunho</span>
                            )}
                            {live.status === "published" && profile && (
                              <a
                                href={`/${profile.username}/${live.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--cr-text-tertiary)] hover:text-[var(--cr-brand-600)] shrink-0 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--cr-brand-100)] overflow-hidden">
                            <div className="h-full rounded-full bg-[var(--cr-brand-600)]" style={{ width: `${barWidth}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-5 shrink-0 [font-variant-numeric:tabular-nums]">
                          <div className="text-right w-14">
                            <p className="text-sm font-semibold text-[var(--cr-text-primary)]">{formatCount(views)}</p>
                            <p className="text-[10px] text-[var(--cr-text-tertiary)]">views</p>
                          </div>
                          <div className="text-right w-14">
                            <p className="text-sm font-semibold text-[var(--cr-text-primary)]">{formatCount(clicks)}</p>
                            <p className="text-[10px] text-[var(--cr-text-tertiary)]">cliques</p>
                          </div>
                          <div className="text-right w-12">
                            <p className="text-sm font-semibold text-[var(--cr-text-primary)]">{liveCtr !== null ? `${liveCtr.toFixed(1)}%` : "—"}</p>
                            <p className="text-[10px] text-[var(--cr-text-tertiary)]">CTR</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
