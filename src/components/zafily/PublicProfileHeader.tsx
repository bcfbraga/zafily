import { MapPin } from "lucide-react";
import type { Profile } from "@/lib/lives-store";

export function PublicProfileHeader({ profile }: { profile: Profile }) {
  const displayName = profile.displayName || profile.username;
  return (
    <div className="max-w-2xl mx-auto px-5 pt-16 pb-10 text-center">
      <div className="cr-avatar-wrapper mb-4">
        <div className="cr-avatar overflow-hidden flex items-center justify-center" style={{ background: "var(--cr-brand-50)" }}>
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: "var(--cr-brand-400)" }}>{displayName[0]?.toUpperCase()}</span>
          )}
        </div>
      </div>
      <h1 className="cr-page-title" style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>{displayName}</h1>
      {profile.bio && (
        <p className="cr-body-text mt-2 max-w-md mx-auto">{profile.bio}</p>
      )}
      <div className="flex items-center justify-center gap-3 flex-wrap mt-2 text-sm" style={{ color: "var(--cr-text-tertiary)" }}>
        <span>@{profile.username}</span>
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {profile.location}
          </span>
        )}
      </div>
    </div>
  );
}
