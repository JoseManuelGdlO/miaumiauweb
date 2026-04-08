/** Base del API con `/api` al final, compatible con `VITE_API_BASE_URL` del panel. */
export function normalizeApiBaseUrl(url: string | undefined): string {
  if (!url?.trim()) return "";
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return u.replace(/\/$/, "");
  }
  return `http://${u.replace(/^\//, "").replace(/\/$/, "")}`;
}
