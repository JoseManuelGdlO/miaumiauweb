import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { normalizeApiBaseUrl } from "@/lib/apiBase";
import { DEFAULT_HERO_YOUTUBE_VIDEO_ID } from "@/lib/youtubeHero";

export const QR_CARD_ICONS = ["whatsapp", "pin", "bag", "instagram", "facebook", "tiktok", "link", "heart", "star", "package"] as const;
export const QR_CARD_SIZES = ["grande", "mediana", "chica"] as const;
export const QR_ORDERED_BUILTIN_IDS = ["mercadolibre", "instagram", "facebook", "tiktok"] as const;

export type QrCardIcon = (typeof QR_CARD_ICONS)[number];
export type QrCardSize = (typeof QR_CARD_SIZES)[number];
export type QrBuiltinId = "whatsapp" | "mercadolibre" | "instagram" | "facebook" | "tiktok";

export interface QrCardStyle {
  name: string;
  description: string;
  icon: QrCardIcon;
  size: QrCardSize;
  iconBackgroundColor: string;
  cardColor: string;
  iconColor: string;
  hidden: boolean;
}

export interface QrLink extends QrCardStyle {
  id: string;
  url: string;
}

export type QrCards = Record<QrBuiltinId, QrCardStyle>;

const QR_ICON_BACKGROUND = "#e5e5e5";
const QR_CARD_BACKGROUND = "#ffffff";
const QR_ICON_COLOR = "#eb4699";

const DEFAULT_CARD_PAINT = {
  iconBackgroundColor: QR_ICON_BACKGROUND,
  cardColor: QR_CARD_BACKGROUND,
  iconColor: QR_ICON_COLOR,
  hidden: false,
};

export const DEFAULT_QR_CARDS: QrCards = {
  whatsapp: { ...DEFAULT_CARD_PAINT, name: "¡Pedir por WhatsApp!", description: "Realiza tu pedido directo en un clic.", icon: "whatsapp", size: "grande" },
  mercadolibre: { ...DEFAULT_CARD_PAINT, name: "Mercado Libre", description: "Compra con envío a todo el país.", icon: "bag", size: "mediana" },
  instagram: { ...DEFAULT_CARD_PAINT, name: "Instagram", description: "Fotos, tips y gatitos.", icon: "instagram", size: "chica" },
  facebook: { ...DEFAULT_CARD_PAINT, name: "Facebook", description: "Comunidad y avisos.", icon: "facebook", size: "chica" },
  tiktok: { ...DEFAULT_CARD_PAINT, name: "TikTok", description: "Demostraciones y videos.", icon: "tiktok", size: "chica" },
};

export interface QrActions {
  whatsapp: boolean;
  catalog: boolean;
  packages: boolean;
  promotions: boolean;
  mercadolibre: boolean;
  social: boolean;
  customLink: boolean;
  customLinkUrl: string;
  customLinkLabel: string;
  links: QrLink[];
  cards: QrCards;
  cardOrder: string[];
  linksHtml: string;
  linksPanelColor: string;
  linksBubbleColor: string;
  linksBubbleTextColor: string;
  linksTextColor: string;
}

export const DEFAULT_QR_ACTIONS: QrActions = {
  whatsapp: true,
  catalog: true,
  packages: false,
  promotions: false,
  mercadolibre: true,
  social: true,
  customLink: false,
  customLinkUrl: "",
  customLinkLabel: "",
  links: [],
  cards: DEFAULT_QR_CARDS,
  cardOrder: [...QR_ORDERED_BUILTIN_IDS],
  linksHtml: "",
  linksPanelColor: "#fff7ed",
  linksBubbleColor: "#16a34a",
  linksBubbleTextColor: "#1c1917",
  linksTextColor: "#1c1917",
};

function isQrCardIcon(value: unknown): value is QrCardIcon {
  return typeof value === "string" && (QR_CARD_ICONS as readonly string[]).includes(value);
}

function isQrCardSize(value: unknown): value is QrCardSize {
  return typeof value === "string" && (QR_CARD_SIZES as readonly string[]).includes(value);
}

export interface PublicSiteSettingsValue {
  loading: boolean;
  /** True si falló la petición; se usan valores por defecto. */
  fetchFailed: boolean;
  heroYoutubeVideoId: string;
  socialInstagramUrl: string;
  socialFacebookUrl: string;
  socialTiktokUrl: string;
  mercadolibreUrl: string;
  qrActions: QrActions;
  maintenancePlaceholder: boolean;
}

function hexColor(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const raw = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const [r, g, b] = raw.slice(1).split("");
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return fallback;
}

function normalizeCardStyle(raw: Partial<QrCardStyle> | undefined, fallback: QrCardStyle): QrCardStyle {
  const name = typeof raw?.name === "string" && raw.name.trim() ? raw.name.trim().slice(0, 80) : fallback.name;
  const description = typeof raw?.description === "string" ? raw.description.trim().slice(0, 160) : fallback.description;
  return {
    name,
    description,
    icon: isQrCardIcon(raw?.icon) ? raw.icon : fallback.icon,
    size: isQrCardSize(raw?.size) ? raw.size : fallback.size,
    hidden: raw?.hidden === true,
    iconBackgroundColor: hexColor(raw?.iconBackgroundColor, fallback.iconBackgroundColor),
    cardColor: hexColor(raw?.cardColor, fallback.cardColor),
    iconColor: hexColor(raw?.iconColor, fallback.iconColor),
  };
}

function normalizeQrCards(raw: Partial<QrCards> | undefined): QrCards {
  return {
    whatsapp: normalizeCardStyle(raw?.whatsapp, DEFAULT_QR_CARDS.whatsapp),
    mercadolibre: normalizeCardStyle(raw?.mercadolibre, DEFAULT_QR_CARDS.mercadolibre),
    instagram: normalizeCardStyle(raw?.instagram, DEFAULT_QR_CARDS.instagram),
    facebook: normalizeCardStyle(raw?.facebook, DEFAULT_QR_CARDS.facebook),
    tiktok: normalizeCardStyle(raw?.tiktok, DEFAULT_QR_CARDS.tiktok),
  };
}

function normalizeCardOrder(raw: unknown, linkIds: string[]) {
  const allowed = new Set<string>([...QR_ORDERED_BUILTIN_IDS, ...linkIds]);
  const order: string[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item !== "string") continue;
      const id = item.trim();
      if (!allowed.has(id) || order.includes(id)) continue;
      order.push(id);
    }
  }
  for (const id of [...QR_ORDERED_BUILTIN_IDS, ...linkIds]) {
    if (!order.includes(id)) order.push(id);
  }
  return order;
}

function readVisualState(html: string): { html: string; state: { cards?: Partial<QrCards>; links?: Record<string, Partial<QrCardStyle>>; cardOrder?: string[] } | null } {
  let state: { cards?: Partial<QrCards>; links?: Record<string, Partial<QrCardStyle>>; cardOrder?: string[] } | null = null;
  const clean = html.replace(/<div\b[^>]*>\s*MIAU_CARD_STATE:([^<]*?)\s*<\/div>/gi, (_, payload: string) => {
    try {
      const parsed = JSON.parse(decodeURIComponent(payload.trim()));
      if (parsed && typeof parsed === "object") state = parsed;
    } catch {
      /* ignore a damaged copy */
    }
    return "";
  });
  return { html: clean, state };
}

function normalizeQrLinks(raw: Partial<QrActions> | undefined, saved?: { links?: Record<string, Partial<QrCardStyle>> } | null): QrLink[] {
  const fromList = Array.isArray(raw?.links)
    ? raw.links.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const name = typeof item.name === "string" ? item.name.trim() : "";
        const url = typeof item.url === "string" ? item.url.trim() : "";
        if (!name || !/^https?:\/\//i.test(url)) return [];
        const id = typeof item.id === "string" && item.id.trim() ? item.id : `link-${index + 1}`;
        const stored = saved?.links?.[id];
        const source = stored && !isQrCardIcon(item.icon) ? { ...stored, ...item, id, name, url } : item;
        return [{
          id,
          name,
          url,
          description: typeof source.description === "string" ? source.description.trim().slice(0, 160) : "",
          icon: isQrCardIcon(source.icon) ? source.icon : "link",
          size: isQrCardSize(source.size) ? source.size : "mediana",
          hidden: source.hidden === true,
          iconBackgroundColor: hexColor(source.iconBackgroundColor, QR_ICON_BACKGROUND),
          cardColor: hexColor(source.cardColor, QR_CARD_BACKGROUND),
          iconColor: hexColor(source.iconColor, QR_ICON_COLOR),
        }];
      })
    : [];
  if (fromList.length > 0) return fromList;
  const legacyUrl = typeof raw?.customLinkUrl === "string" ? raw.customLinkUrl.trim() : "";
  if (raw?.customLink && /^https?:\/\//i.test(legacyUrl)) {
    const name = typeof raw.customLinkLabel === "string" && raw.customLinkLabel.trim()
      ? raw.customLinkLabel.trim()
      : "Enlace";
    return [{ id: "legacy", name, url: legacyUrl, description: "", icon: "link", size: "mediana", iconBackgroundColor: QR_ICON_BACKGROUND, cardColor: QR_CARD_BACKGROUND, iconColor: QR_ICON_COLOR, hidden: false }];
  }
  return [];
}

function normalizeQrActions(raw: Partial<QrActions> | undefined): QrActions {
  const visual = readVisualState(typeof raw?.linksHtml === "string" ? raw.linksHtml : "");
  const links = normalizeQrLinks(raw, visual.state);
  const cards = normalizeQrCards(
    raw?.cards?.whatsapp && isQrCardIcon(raw.cards.whatsapp.icon) ? raw.cards : visual.state?.cards ?? raw?.cards,
  );
  const cardOrder = Array.isArray(raw?.cardOrder) ? raw.cardOrder : visual.state?.cardOrder;
  return {
    whatsapp: typeof raw?.whatsapp === "boolean" ? raw.whatsapp : DEFAULT_QR_ACTIONS.whatsapp,
    catalog: typeof raw?.catalog === "boolean" ? raw.catalog : DEFAULT_QR_ACTIONS.catalog,
    packages: typeof raw?.packages === "boolean" ? raw.packages : DEFAULT_QR_ACTIONS.packages,
    promotions: typeof raw?.promotions === "boolean" ? raw.promotions : DEFAULT_QR_ACTIONS.promotions,
    mercadolibre: typeof raw?.mercadolibre === "boolean" ? raw.mercadolibre : DEFAULT_QR_ACTIONS.mercadolibre,
    social: typeof raw?.social === "boolean" ? raw.social : DEFAULT_QR_ACTIONS.social,
    customLink: typeof raw?.customLink === "boolean" ? raw.customLink : DEFAULT_QR_ACTIONS.customLink,
    customLinkUrl: typeof raw?.customLinkUrl === "string" ? raw.customLinkUrl.trim() : "",
    customLinkLabel: typeof raw?.customLinkLabel === "string" ? raw.customLinkLabel.trim() : "",
    links,
    cards,
    cardOrder: normalizeCardOrder(cardOrder, links.map((link) => link.id)),
    linksHtml: visual.html,
    linksPanelColor: normalizeHexColor(raw?.linksPanelColor, DEFAULT_QR_ACTIONS.linksPanelColor),
    linksBubbleColor: normalizeHexColor(raw?.linksBubbleColor, DEFAULT_QR_ACTIONS.linksBubbleColor),
    linksBubbleTextColor: normalizeHexColor(raw?.linksBubbleTextColor, DEFAULT_QR_ACTIONS.linksBubbleTextColor),
    linksTextColor: normalizeHexColor(raw?.linksTextColor, DEFAULT_QR_ACTIONS.linksTextColor),
  };
}

function normalizeHexColor(value: string | undefined, fallback: string) {
  if (typeof value !== "string") return fallback;
  const color = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toLowerCase() : fallback;
}

const defaultValue: PublicSiteSettingsValue = {
  loading: true,
  fetchFailed: false,
  heroYoutubeVideoId: DEFAULT_HERO_YOUTUBE_VIDEO_ID,
  socialInstagramUrl: "",
  socialFacebookUrl: "",
  socialTiktokUrl: "",
  mercadolibreUrl: "",
  qrActions: DEFAULT_QR_ACTIONS,
  maintenancePlaceholder: true,
};

const PublicSiteSettingsContext = createContext<PublicSiteSettingsValue>(defaultValue);

export const PublicSiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PublicSiteSettingsValue>(defaultValue);

  useEffect(() => {
    const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
    if (!base) {
      setState((s) => ({ ...s, loading: false, fetchFailed: true }));
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${base}/public/site-settings`);
        if (!res.ok || cancelled) {
          if (!cancelled) {
            setState((s) => ({ ...s, loading: false, fetchFailed: true }));
          }
          return;
        }
        const json = (await res.json()) as {
          data?: {
            heroYoutubeVideoId?: string;
            socialInstagramUrl?: string;
            socialFacebookUrl?: string;
            socialTiktokUrl?: string;
            mercadolibreUrl?: string;
            qrActions?: Partial<QrActions>;
            maintenancePlaceholder?: boolean;
          };
        };
        const d = json?.data;
        if (cancelled) return;
        const hero =
          typeof d?.heroYoutubeVideoId === "string" && d.heroYoutubeVideoId.trim()
            ? d.heroYoutubeVideoId.trim()
            : DEFAULT_HERO_YOUTUBE_VIDEO_ID;
        setState({
          loading: false,
          fetchFailed: false,
          heroYoutubeVideoId: hero,
          socialInstagramUrl: typeof d?.socialInstagramUrl === "string" ? d.socialInstagramUrl.trim() : "",
          socialFacebookUrl: typeof d?.socialFacebookUrl === "string" ? d.socialFacebookUrl.trim() : "",
          socialTiktokUrl: typeof d?.socialTiktokUrl === "string" ? d.socialTiktokUrl.trim() : "",
          mercadolibreUrl: typeof d?.mercadolibreUrl === "string" ? d.mercadolibreUrl.trim() : "",
          qrActions: normalizeQrActions(d?.qrActions),
          maintenancePlaceholder: d?.maintenancePlaceholder !== false,
        });
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, fetchFailed: true }));
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicSiteSettingsContext.Provider value={state}>{children}</PublicSiteSettingsContext.Provider>
  );
};

export const usePublicSiteSettings = () => useContext(PublicSiteSettingsContext);
