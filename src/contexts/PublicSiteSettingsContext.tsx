import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { normalizeApiBaseUrl } from "@/lib/apiBase";
import { DEFAULT_HERO_YOUTUBE_VIDEO_ID } from "@/lib/youtubeHero";

export interface QrLink {
  id: string;
  name: string;
  url: string;
}

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
  linksHtml: string;
  linksPanelColor: string;
  linksBubbleColor: string;
  linksBubbleTextColor: string;
  linksTextColor: string;
}

export const DEFAULT_QR_ACTIONS: QrActions = {
  whatsapp: true,
  catalog: true,
  packages: true,
  promotions: true,
  mercadolibre: true,
  social: true,
  customLink: false,
  customLinkUrl: "",
  customLinkLabel: "",
  links: [],
  linksHtml: "",
  linksPanelColor: "#fff7ed",
  linksBubbleColor: "#16a34a",
  linksBubbleTextColor: "#1c1917",
  linksTextColor: "#1c1917",
};

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

function normalizeQrLinks(raw: Partial<QrActions> | undefined): QrLink[] {
  const fromList = Array.isArray(raw?.links)
    ? raw.links.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const name = typeof item.name === "string" ? item.name.trim() : "";
        const url = typeof item.url === "string" ? item.url.trim() : "";
        if (!name || !/^https?:\/\//i.test(url)) return [];
        const id = typeof item.id === "string" && item.id.trim() ? item.id : `link-${index + 1}`;
        return [{ id, name, url }];
      })
    : [];
  if (fromList.length > 0) return fromList;
  const legacyUrl = typeof raw?.customLinkUrl === "string" ? raw.customLinkUrl.trim() : "";
  if (raw?.customLink && /^https?:\/\//i.test(legacyUrl)) {
    const name = typeof raw.customLinkLabel === "string" && raw.customLinkLabel.trim()
      ? raw.customLinkLabel.trim()
      : "Enlace";
    return [{ id: "legacy", name, url: legacyUrl }];
  }
  return [];
}

function normalizeQrActions(raw: Partial<QrActions> | undefined): QrActions {
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
    links: normalizeQrLinks(raw),
    linksHtml: typeof raw?.linksHtml === "string" ? raw.linksHtml : "",
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
