export interface UrlMetadata {
  name: string | null;
  imageUrl: string | null;
  price: string | null;
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

function extractPrice(html: string): string | null {
  // JSON-LD price
  const ldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldMatch) {
    for (const block of ldMatch) {
      const inner = block.replace(/<\/?script[^>]*>/gi, "");
      try {
        const obj = JSON.parse(inner);
        const price =
          obj?.offers?.price ??
          obj?.offers?.[0]?.price ??
          obj?.price;
        const currency =
          obj?.offers?.priceCurrency ??
          obj?.offers?.[0]?.priceCurrency ??
          "";
        if (price) return currency ? `${currency} ${price}` : String(price);
      } catch { /* ignore */ }
    }
  }

  // og:price:amount
  const ogPrice = extractMeta(html, "og:price:amount");
  if (ogPrice) return ogPrice;

  // product:price:amount (Open Graph)
  const productPrice = extractMeta(html, "product:price:amount");
  if (productPrice) return productPrice;

  return null;
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Zafily/1.0; +https://zafily.com.br)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });

    if (!res.ok) return { name: null, imageUrl: null, price: null };

    const html = await res.text();

    const name =
      extractMeta(html, "og:title") ||
      extractMeta(html, "twitter:title") ||
      extractTitle(html);

    const imageUrl =
      extractMeta(html, "og:image") ||
      extractMeta(html, "twitter:image");

    const price = extractPrice(html);

    return { name, imageUrl, price };
  } catch {
    return { name: null, imageUrl: null, price: null };
  }
}
