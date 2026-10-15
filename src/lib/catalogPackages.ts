import { normalizeApiBaseUrl } from "@/lib/apiBase";
import { formatCatalogPrice, resolveCatalogImage } from "@/lib/catalogProducts";
import type { Product } from "@/data/products";

interface PackageApiItem {
  id?: number | string;
  nombre?: string;
  descripcion?: string;
  precio_final?: number | string | null;
  precio?: number | string | null;
  imagen_url?: string | null;
  is_active?: boolean;
}

interface PackagesResponse {
  data?: {
    paquetes?: PackageApiItem[];
  };
}

export function mapActivePackage(item: PackageApiItem, apiBase: string): Product | null {
  if (item.is_active === false) return null;
  const title = item.nombre?.trim();
  if (!title) return null;

  return {
    id: `PAQ-${item.id ?? title}`,
    title,
    description: (item.descripcion ?? "").replace(/\s+/g, " ").trim(),
    price: formatCatalogPrice(item.precio_final ?? item.precio),
    image: resolveCatalogImage(item.imagen_url, apiBase),
    category: "paquete",
  };
}

export async function fetchActivePackages(): Promise<Product[]> {
  const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (!base) {
    throw new Error("API base missing");
  }

  const response = await fetch(`${base}/paquetes/activos`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los paquetes");
  }

  const json = (await response.json()) as PackagesResponse;
  const items = json?.data?.paquetes ?? [];
  return items.flatMap((item) => {
    const pack = mapActivePackage(item, base);
    return pack ? [pack] : [];
  });
}
