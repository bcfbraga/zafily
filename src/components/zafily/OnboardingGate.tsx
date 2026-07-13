"use client";

import { useEffect, useState } from "react";
import { OnboardingModal } from "./OnboardingModal";

export function OnboardingGate() {
  const [pending, setPending] = useState<{ username: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(profile => {
      if (profile && !profile.onboardedAt) {
        setPending({ username: profile.username });
      }
    });
  }, []);

  if (!pending) return null;

  return <OnboardingModal initialUsername={pending.username} onDone={() => setPending(null)} />;
}
