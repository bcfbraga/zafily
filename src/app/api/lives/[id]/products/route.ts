import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getLive, countProducts, addProduct, getAccountStatus, nextProductPosition } from "@/lib/lives-store";
import { fetchUrlMetadata } from "@/lib/metadata";
import { shortCategory } from "@/lib/utils";

const MAX_PRODUCTS = 100;
const FREE_TIER_MAX_PRODUCTS = 5;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const live = await getLive(id, userId);
  if (!live) return NextResponse.json({ error: "Live não encontrada" }, { status: 404 });

  const { items: rawItems } = await req.json() as { items: { url: string; size?: string | null }[] };
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Nenhuma URL fornecida" }, { status: 400 });
  }

  // Filtra apenas entradas que são URLs válidas (ignora texto livre, espaços, etc.)
  const items = rawItems.filter(item => {
    try { const p = new URL(item.url.trim()); return p.protocol === "https:" || p.protocol === "http:"; }
    catch { return false; }
  });

  if (items.length === 0) {
    return NextResponse.json({ error: "Nenhuma URL válida encontrada" }, { status: 400 });
  }

  const current = await countProducts(id);
  const accountStatus = await getAccountStatus(userId);
  const cap = accountStatus === "active" ? MAX_PRODUCTS : FREE_TIER_MAX_PRODUCTS;
  const slots = cap - current;
  if (slots <= 0) {
    return NextResponse.json({
      error: accountStatus === "active"
        ? `Limite de ${MAX_PRODUCTS} produtos atingido`
        : `No plano gratuito você pode adicionar até ${FREE_TIER_MAX_PRODUCTS} produtos por vitrine. Ative sua conta para adicionar mais.`,
      code: accountStatus === "active" ? undefined : "activation_required",
    }, { status: accountStatus === "active" ? 400 : 403 });
  }

  const toProcess = items.slice(0, slots);

  // Busca os metadados de todos antes de gravar: só dá para agrupar por
  // categoria depois de saber a categoria de cada link.
  const enriched = await Promise.all(
    toProcess.map(async (item, i) => ({ item, meta: await fetchUrlMetadata(item.url), ordemEnvio: i }))
  );

  // Agrupa por categoria em ordem alfabética, ignorando a ordem em que os links
  // foram colados. Dentro de uma mesma categoria a ordem de envio é mantida, e
  // produtos sem categoria vão para o fim.
  const sorted = enriched.sort((a, b) => {
    const ca = shortCategory(a.meta.category)?.toLocaleLowerCase("pt-BR");
    const cb = shortCategory(b.meta.category)?.toLocaleLowerCase("pt-BR");
    if (ca !== cb) {
      if (!ca) return 1;
      if (!cb) return -1;
      return ca.localeCompare(cb, "pt-BR");
    }
    return a.ordemEnvio - b.ordemEnvio;
  });

  // Sempre no fim da lista, para não embaralhar o que a usuária já ordenou.
  const startPosition = await nextProductPosition(id);

  const results = await Promise.all(
    sorted.map(({ item, meta }, i) =>
      addProduct(id, {
        url: item.url,
        name: meta.name,
        imageUrl: meta.imageUrl,
        price: meta.price,
        category: meta.category,
        productUrl: meta.productUrl,
        size: item.size ?? null,
        position: startPosition + i,
      })
    )
  );

  return NextResponse.json({ products: results, skipped: items.length - toProcess.length });
}
