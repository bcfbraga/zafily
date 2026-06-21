export interface UrlMetadata {
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
  productUrl: string | null;
}

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

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
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
    if (m?.[1]) return decodeHtml(m[1].trim());
  }
  return null;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtml(m[1].trim()) : null;
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

// Extract Product-type LD+JSON blocks specifically
function findProductLd(blocks: Record<string, unknown>[]): Record<string, unknown> | null {
  for (const obj of blocks) {
    const type = (obj as Record<string, unknown>)["@type"];
    if (type === "Product" || type === "product") return obj;
    // Some sites nest inside @graph
    const graph = (obj as Record<string, unknown>)["@graph"];
    if (Array.isArray(graph)) {
      const product = graph.find((g: unknown) => (g as Record<string, unknown>)?.["@type"] === "Product");
      if (product) return product as Record<string, unknown>;
    }
  }
  return null;
}

function extractProductName(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  // 1. JSON-LD Product name (most reliable)
  const product = findProductLd(ldBlocks);
  if (product?.name && typeof product.name === "string") return decodeHtml(product.name);

  // 2. og:title — but skip if it's just the site name (no " | " separator and very short)
  const ogTitle = extractMeta(html, "og:title");
  if (ogTitle && ogTitle.includes("|")) {
    // "Product Name | Site Name" — take the first part
    return decodeHtml(ogTitle.split("|")[0].trim());
  }
  if (ogTitle && ogTitle.length > 10) return ogTitle;

  // 3. twitter:title
  const twTitle = extractMeta(html, "twitter:title");
  if (twTitle && twTitle.includes("|")) return decodeHtml(twTitle.split("|")[0].trim());
  if (twTitle && twTitle.length > 10) return twTitle;

  // 4. <title> tag — strip " | Site" suffix
  const title = extractTitle(html);
  if (title && title.includes("|")) return decodeHtml(title.split("|")[0].trim());
  if (title && title.includes(" - ")) return decodeHtml(title.split(" - ")[0].trim());
  return title;
}

function extractProductImage(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  // 1. JSON-LD Product image
  const product = findProductLd(ldBlocks);
  if (product?.image) {
    const img = product.image;
    if (typeof img === "string") return img;
    if (Array.isArray(img) && typeof img[0] === "string") return img[0];
    if (typeof img === "object" && img !== null && typeof (img as Record<string, unknown>).url === "string") {
      return (img as Record<string, unknown>).url as string;
    }
  }

  // 2. og:image
  return extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
}

function extractPrice(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  // 1. JSON-LD Product offers
  const product = findProductLd(ldBlocks);
  if (product) {
    const offers = product.offers;
    const offer = Array.isArray(offers) ? offers[0] : offers;
    const price = (offer as Record<string, unknown>)?.price ?? product.price;
    if (price != null) {
      const num = parseFloat(String(price));
      if (!isNaN(num)) return `R$ ${num.toFixed(2).replace(".", ",")}`;
      return String(price);
    }
  }

  // 2. Generic LD blocks
  for (const obj of ldBlocks) {
    const offers = (obj as Record<string, unknown>)?.offers;
    const offer = Array.isArray(offers) ? offers[0] : offers;
    const price = (offer as Record<string, unknown>)?.price ?? (obj as Record<string, unknown>)?.price;
    if (price != null) {
      const num = parseFloat(String(price));
      if (!isNaN(num)) return `R$ ${num.toFixed(2).replace(".", ",")}`;
    }
  }

  return extractMeta(html, "og:price:amount") || extractMeta(html, "product:price:amount") || null;
}

function extractCategory(html: string, ldBlocks: Record<string, unknown>[]): string | null {
  const product = findProductLd(ldBlocks);
  if (product?.category && typeof product.category === "string") return product.category;

  for (const obj of ldBlocks) {
    const cat = (obj as Record<string, unknown>)?.category;
    if (cat && typeof cat === "string") return cat;
  }

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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });

    if (!res.ok) return { ...empty, productUrl };

    const html = await res.text();
    const ldBlocks = extractLdJson(html);

    const name = extractProductName(html, ldBlocks);
    const imageUrl = extractProductImage(html, ldBlocks);
    const price = extractPrice(html, ldBlocks);
    const category = extractCategory(html, ldBlocks);

    return { name, imageUrl, price, category, productUrl };
  } catch {
    return empty;
  }
}
