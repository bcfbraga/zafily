import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getLive, countProducts, addProduct } from "@/lib/lives-store";
import { fetchUrlMetadata } from "@/lib/metadata";

const MAX_PRODUCTS = 20;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const live = await getLive(id, userId);
  if (!live) return NextResponse.json({ error: "Live não encontrada" }, { status: 404 });

  const { urls } = await req.json() as { urls: string[] };
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "Nenhuma URL fornecida" }, { status: 400 });
  }

  const current = await countProducts(id);
  const slots = MAX_PRODUCTS - current;
  if (slots <= 0) {
    return NextResponse.json({ error: `Limite de ${MAX_PRODUCTS} produtos atingido` }, { status: 400 });
  }

  const toProcess = urls.slice(0, slots);
  const results = await Promise.all(
    toProcess.map(async (url, i) => {
      const meta = await fetchUrlMetadata(url);
      return addProduct(id, {
        url,
        name: meta.name,
        imageUrl: meta.imageUrl,
        price: meta.price,
        position: current + i,
      });
    })
  );

  return NextResponse.json({ products: results, skipped: urls.length - toProcess.length });
}
