import { normalizeApiBaseUrl } from "@/lib/apiBase";
import type { Product } from "@/data/products";

interface CatalogApiItem {
  id?: number | string;
  nombre?: string;
  descripcion?: string;
  precio?: number | string | null;
  imagen_url?: string | null;
}

interface CatalogResponse {
  data?: {
    productos?: CatalogApiItem[];
  };
}

export function formatCatalogPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const amount = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(amount)) return "";
  return `$${amount.toFixed(2)} MXN`;
}

export function resolveCatalogImage(imageUrl: string | null | undefined, apiBase: string): string {
  const value = (imageUrl ?? "").trim();
  if (!value) return "/placeholder.svg";
  if (/^https?:\/\//i.test(value)) return value;
  const origin = apiBase.replace(/\/api\/?$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;
  return origin ? `${origin}${path}` : path;
}

export function mapCatalogProduct(item: CatalogApiItem, apiBase: string): Product | null {
  const title = item.nombre?.trim();
  if (!title) return null;

  return {
    id: `PROD-${item.id ?? title}`,
    title,
    description: (item.descripcion ?? "").replace(/\s+/g, " ").trim(),
    price: formatCatalogPrice(item.precio),
    image: resolveCatalogImage(item.imagen_url, apiBase),
    category: "producto",
  };
}

export async function fetchCatalogProducts(): Promise<Product[]> {
  const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (!base) {
    throw new Error("API base missing");
  }

  const response = await fetch(`${base}/inventarios/catalogo`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  const json = (await response.json()) as CatalogResponse;
  const items = json?.data?.productos ?? [];
  return items.flatMap((item) => {
    const product = mapCatalogProduct(item, base);
    return product ? [product] : [];
  });
}
