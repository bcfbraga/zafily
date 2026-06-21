export interface UrlMetadata {
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
  productUrl: string | null;
}

// Domains that are known affiliate/redirect links and need resolution
const AFFILIATE_DOMAINS = [
  "awin1.com", "tidd.ly", "go.redirectingat.com", "rstyle.me",
  "shareasale.com", "linksynergy.com", "prf.hn", "clktr.ac",
  "minhacea.cea.com.br",
];

const AFFILIATE_PARAMS = ["awc=", "lcea=", "pub_ref=", "clickid=", "aff_id="];

function isAffiliateUrl(url: string): boolean {
  try {
    const { hostname, search } = new URL(url);
    if (AFFILIATE_DOMAINS.some(d => hostname.includes(d))) return true;
    if (AFFILIATE_PARAMS.some(p => search.includes(p))) return true;
    return false;
  } catch {
    return false;
  }
}

async function resolveUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Zafily/1.0; +https://zafily.com.br)" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return res.url || url;
  } catch {
    return url;
  }
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? null;
}

function extractLdJson(html: string): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  const matches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of matches) {
    const inner = block.replace(/<\/?script[^>]*>/gi, "");
    try {
      const obj = JSON.parse(inner);
      if (Array.isArray(obj)) blocks.push(...obj);
      else blocks.push(obj);
    } catch { /* ignore */ }
  }
  return blocks;
}

function extractPrice(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  // JSON-LD
  for (const obj of ldBlocks) {
    const offers = (obj as Record<string, unknown>)?.offers;
    const offerObj = Array.isArray(offers) ? offers[0] : offers;
    const price = (offerObj as Record<string, unknown>)?.price ?? (obj as Record<string, unknown>)?.price;
    if (price != null) return String(price);
  }

  // og:price:amount or product:price:amount
  return (
    extractMeta(html, "og:price:amount") ||
    extractMeta(html, "product:price:amount") ||
    null
  );
}

function extractCategory(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  // JSON-LD category
  for (const obj of ldBlocks) {
    const cat = (obj as Record<string, unknown>)?.category;
    if (cat && typeof cat === "string") return cat;
  }

  // og:category or product:category
  return (
    extractMeta(html, "og:category") ||
    extractMeta(html, "product:category") ||
    extractMeta(html, "product:catalog_group_name") ||
    null
  );
}

export async function fetchUrlMetadata(affiliateUrl: string): Promise<UrlMetadata> {
  const empty: UrlMetadata = { name: null, imageUrl: null, price: null, category: null, productUrl: null };

  try {
    // Passo 1: resolve redirect se for link de afiliado ou encurtado
    const productUrl = isAffiliateUrl(affiliateUrl)
      ? await resolveUrl(affiliateUrl)
      : affiliateUrl;

    // Passo 2: busca página do produto
    const res = await fetch(productUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Zafily/1.0; +https://zafily.com.br)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });

    if (!res.ok) return { ...empty, productUrl };

    const html = await res.text();
    const ldBlocks = extractLdJson(html);

    const name =
      extractMeta(html, "og:title") ||
      extractMeta(html, "twitter:title") ||
      extractTitle(html);

    const imageUrl =
      extractMeta(html, "og:image") ||
      extractMeta(html, "twitter:image");

    const price = extractPrice(html, ldBlocks);
    const category = extractCategory(html, ldBlocks);

    return { name, imageUrl, price, category, productUrl };
  } catch {
    return empty;
  }
}
