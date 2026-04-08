import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { normalizeApiBaseUrl } from "@/lib/apiBase";
import { DEFAULT_HERO_YOUTUBE_VIDEO_ID } from "@/lib/youtubeHero";

export interface PublicSiteSettingsValue {
  loading: boolean;
  /** True si falló la petición; se usan valores por defecto. */
  fetchFailed: boolean;
  heroYoutubeVideoId: string;
  socialInstagramUrl: string;
  socialFacebookUrl: string;
  socialTiktokUrl: string;
  mercadolibreUrl: string;
}

const defaultValue: PublicSiteSettingsValue = {
  loading: true,
  fetchFailed: false,
  heroYoutubeVideoId: DEFAULT_HERO_YOUTUBE_VIDEO_ID,
  socialInstagramUrl: "",
  socialFacebookUrl: "",
  socialTiktokUrl: "",
  mercadolibreUrl: "",
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
