import { normalizeApiBaseUrl } from "@/lib/apiBase";

export const PORTAL_TOKEN_KEY = "miaumiau_portal_token";

export function getApiBase(): string {
  return normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(PORTAL_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(PORTAL_TOKEN_KEY, token);
    else localStorage.removeItem(PORTAL_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function portalFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const base = getApiBase();
  if (!base) {
    throw new Error("API_BASE_MISSING");
  }
  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const t = options.token !== undefined ? options.token : getStoredToken();
  if (t) headers.set("Authorization", `Bearer ${t}`);

  const res = await fetch(url, { ...options, headers });
  const json = (await res.json().catch(() => ({}))) as T & {
    success?: boolean;
    message?: string;
    code?: string;
  };

  if (!res.ok) {
    const err = new Error((json as { message?: string }).message || res.statusText) as Error & {
      status?: number;
      code?: string;
    };
    err.status = res.status;
    err.code = (json as { code?: string }).code;
    throw err;
  }

  return json as T;
}
