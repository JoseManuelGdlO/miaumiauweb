import { normalizeApiBaseUrl } from "@/lib/apiBase";

export interface Promotion {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  discount: string;
  validUntil: string;
  icon: string;
  bgColor: string;
}

interface PromotionApiItem {
  id?: number | string;
  nombre?: string;
  descripcion?: string;
  codigo?: string;
  tipo_promocion?: string;
  valor_descuento?: number | string;
  fecha_fin?: string;
}

interface ActivePromotionsResponse {
  data?: {
    promotions?: PromotionApiItem[];
  };
}

const iconByType: Record<string, string> = {
  porcentaje: "star",
  monto_fijo: "gift",
  envio_gratis: "truck",
  descuento_especial: "cat",
};

const colorByType: Record<string, string> = {
  porcentaje: "from-yellow-500 to-amber-400",
  monto_fijo: "from-primary to-accent",
  envio_gratis: "from-green-500 to-emerald-400",
  descuento_especial: "from-pink-500 to-rose-400",
};

function formatDiscount(type?: string, value?: number | string): string {
  const numericValue = Number(value);
  if (type === "porcentaje" && Number.isFinite(numericValue)) {
    return `-${numericValue}%`;
  }
  if (type === "monto_fijo" && Number.isFinite(numericValue)) {
    return `-$${numericValue}`;
  }
  if (type === "envio_gratis") return "GRATIS";
  if (typeof value === "string" && value.trim()) return value.trim();
  return "PROMO";
}

function mapPromotion(apiPromo: PromotionApiItem): Promotion {
  const type = apiPromo.tipo_promocion ?? "";
  const title = apiPromo.nombre?.trim() || "Promocion especial";
  const description = apiPromo.descripcion?.trim() || "Disponible por tiempo limitado.";

  return {
    id: String(apiPromo.id ?? apiPromo.codigo ?? Date.now()),
    titleEs: title,
    titleEn: title,
    descriptionEs: description,
    descriptionEn: description,
    discount: formatDiscount(type, apiPromo.valor_descuento),
    validUntil: apiPromo.fecha_fin ?? new Date().toISOString(),
    icon: iconByType[type] ?? "gift",
    bgColor: colorByType[type] ?? "from-primary to-accent",
  };
}

export async function fetchActivePromotions(): Promise<Promotion[]> {
  const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  if (!base) return [];

  const response = await fetch(`${base}/promotions/active`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar las promociones");
  }

  const json = (await response.json()) as ActivePromotionsResponse;
  const promotions = json?.data?.promotions ?? [];
  return promotions.map(mapPromotion);
}
