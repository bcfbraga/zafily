import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPublicLinks } from "@/lib/links-store";
import { resolveCurrentUsername } from "@/lib/lives-store";
import { PublicProfileHeader } from "@/components/zafily/PublicProfileHeader";
import { PublicProfileTabs } from "@/components/zafily/PublicProfileTabs";
import { BentoLinksGrid } from "@/components/zafily/BentoLinksGrid";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `Zafily - @${username}` };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { username } = await params;

  const result = await getPublicLinks(username);

  if (!result) {
    const currentUsername = await resolveCurrentUsername(username);
    if (currentUsername) redirect(`/${currentUsername}`);
    notFound();
  }

  const { profile, links } = result;

  return (
    <div className="min-h-screen" style={{ background: "var(--cr-background)", color: "var(--cr-text-primary)", fontFamily: "var(--cr-font)" }}>
      <PublicProfileHeader profile={profile} />
      <div className="max-w-2xl mx-auto px-5">
        <PublicProfileTabs username={profile.username} />
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-20">
        <BentoLinksGrid links={links} />
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="py-6 text-center" style={{ borderTop: "1px solid var(--cr-border)" }}>
        <p className="text-xs" style={{ color: "var(--cr-text-tertiary)" }}>
          Criado com <span className="font-medium" style={{ color: "var(--cr-text-secondary)" }}>Zafily</span>
        </p>
      </div>
    </div>
  );
}
