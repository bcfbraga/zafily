const AWIN_BASE = "https://api.awin.com";
const CEA_ADVERTISER_ID = 17648;

export type AwinValidationResult =
  | { ok: true; status: "connected" }
  | { ok: true; status: "pending_program_approval" }
  | { ok: false; status: "invalid_credentials"; message: string }
  | { ok: false; status: "api_error"; message: string };

export async function validateAwinConnection(
  publisherId: string,
  apiToken: string
): Promise<AwinValidationResult> {
  let res: Response;

  try {
    res = await fetch(
      `${AWIN_BASE}/publishers/${publisherId}/programmedetails?advertiserId=${CEA_ADVERTISER_ID}&relationship=joined`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
        // Short timeout — don't keep the user waiting
        signal: AbortSignal.timeout(8000),
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, status: "api_error", message: `Could not reach Awin API: ${msg}` };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      status: "invalid_credentials",
      message: "Publisher ID or API Token is invalid. Check your Awin account settings.",
    };
  }

  if (!res.ok) {
    // 404 on this endpoint typically means the publisher hasn't joined the programme
    if (res.status === 404) {
      return { ok: true, status: "pending_program_approval" };
    }
    return {
      ok: false,
      status: "api_error",
      message: `Awin returned an unexpected error (HTTP ${res.status}). Try again later.`,
    };
  }

  // 200 with body — publisher is joined and approved
  return { ok: true, status: "connected" };
}

export async function testAwinConnection(
  publisherId: string,
  apiToken: string
): Promise<AwinValidationResult> {
  return validateAwinConnection(publisherId, apiToken);
}
