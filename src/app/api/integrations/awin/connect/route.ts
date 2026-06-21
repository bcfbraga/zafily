import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/crypto";
import { validateAwinConnection } from "@/lib/awin-api";
import { upsertIntegration } from "@/lib/integrations-store";
import { getUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const publisherId = String(body.publisherId ?? "").trim();
    const apiToken = String(body.apiToken ?? "").trim();

    if (!publisherId || !apiToken) {
      return NextResponse.json(
        { error: "Publisher ID and API Token are required." },
        { status: 400 }
      );
    }

    // Validate with Awin before saving anything
    const result = await validateAwinConnection(publisherId, apiToken);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message, status: result.status },
        { status: 422 }
      );
    }

    const userId = getUserId(req);
    const encryptedToken = encrypt(apiToken);
    const now = new Date().toISOString();

    await upsertIntegration({
      userId,
      provider: "awin",
      advertiserId: 17648,
      publisherId,
      encryptedToken,
      status: result.status,
      lastCheckedAt: now,
    });

    return NextResponse.json({
      status: result.status,
      publisherId,
      connectedAt: now,
    });
  } catch (err) {
    console.error("[awin/connect]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
