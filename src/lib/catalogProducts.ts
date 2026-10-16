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
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  const amount = match ? Number(match[0]) : Number.NaN;
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

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const input = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      cell = "";
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }
    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }
  return rows;
}

export function productsFromCatalogCsv(csv: string): Product[] {
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];
  const header = rows[0].map((column) => column.trim().toLowerCase());
  const column = (name: string) => header.indexOf(name);
  const idIndex = column("id");
  const titleIndex = column("title");
  const descriptionIndex = column("description");
  const priceIndex = column("price");
  const imageIndex = column("image_link");
  const seen = new Set<string>();

  return rows.slice(1).flatMap((record) => {
    const id = (record[idIndex] ?? "").trim();
    const title = (record[titleIndex] ?? "").trim();
    if (!id.startsWith("PROD-") || !title) return [];
    const key = title.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [{
      id,
      title,
      description: (record[descriptionIndex] ?? "").replace(/\s+/g, " ").trim(),
      price: formatCatalogPrice(record[priceIndex]),
      image: resolveCatalogImage(record[imageIndex], ""),
      category: "producto" as const,
    }];
  });
}

async function fetchPublicCityCatalog(base: string): Promise<Product[]> {
  const citiesResponse = await fetch(`${base}/cities/active`);
  if (!citiesResponse.ok) {
    throw new Error("No se pudieron cargar los productos");
  }
  const citiesJson = (await citiesResponse.json()) as { data?: { cities?: { slug?: string }[] } };
  const slugs = (citiesJson?.data?.cities ?? [])
    .map((city) => city.slug?.trim() ?? "")
    .filter(Boolean);
  const origin = base.replace(/\/api\/?$/, "");
  const catalogs = await Promise.all(
    slugs.map(async (slug) => {
      const response = await fetch(`${origin}/catalogo/${encodeURIComponent(slug)}/catalogo.csv`);
      if (!response.ok) return [];
      return productsFromCatalogCsv(await response.text());
    }),
  );
  const byName = new Map<string, Product>();
  for (const product of catalogs.flat()) {
    const key = product.title.toLowerCase();
    const existing = byName.get(key);
    if (!existing || (existing.image === "/placeholder.svg" && product.image !== "/placeholder.svg")) {
      byName.set(key, product);
    }
  }
  return [...byName.values()];
}

export async function fetchCatalogProducts(): Promise<Product[]> {
  const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (!base) {
    throw new Error("API base missing");
  }

  const response = await fetch(`${base}/inventarios/catalogo`);
  if (response.status === 401 || response.status === 403 || response.status === 404) {
    return fetchPublicCityCatalog(base);
  }
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
