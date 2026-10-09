import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { normalizeApiBaseUrl } from "@/lib/apiBase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CityOption = {
  id: number;
  nombre: string;
  phone: string;
};

function toWhatsAppDigits(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 10) digits = `52${digits}`;
  else if (digits.length === 13 && digits.startsWith("521")) digits = `52${digits.slice(3)}`;
  if (digits.length < 11 || digits.length > 15) return null;
  return digits;
}

function buildWhatsAppUrl(phoneDigits: string, text: string) {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
}

type WhatsAppCityOrderContextValue = {
  openOrder: (message: string) => void;
};

const WhatsAppCityOrderContext = createContext<WhatsAppCityOrderContextValue | null>(null);

export function useWhatsAppCityOrder() {
  const ctx = useContext(WhatsAppCityOrderContext);
  if (!ctx) {
    throw new Error("useWhatsAppCityOrder must be used within WhatsAppCityPickerProvider");
  }
  return ctx;
}

export function WhatsAppCityPickerProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const openOrder = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingCities(true);
    setLoadError(false);
    const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
    fetch(`${base}/cities/active`)
      .then(async (res) => {
        if (!res.ok) throw new Error("cities");
        return res.json();
      })
      .then((body: { data?: { cities?: { id: number; nombre?: string; telefono?: string | null }[] } }) => {
        if (cancelled) return;
        const list = Array.isArray(body?.data?.cities) ? body.data.cities : [];
        const options = list.flatMap((city) => {
          const phone = city.telefono ? toWhatsAppDigits(city.telefono) : null;
          if (!phone || !city.nombre) return [];
          return [{ id: city.id, nombre: city.nombre, phone }];
        });
        options.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        setCities(options);
      })
      .catch(() => {
        if (!cancelled) {
          setCities([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCities(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleCity = useCallback(
    (phone: string) => {
      const url = buildWhatsAppUrl(phone, message);
      window.open(url, "_blank", "noopener,noreferrer");
      setOpen(false);
    },
    [message],
  );

  const value = useMemo(() => ({ openOrder }), [openOrder]);

  return (
    <WhatsAppCityOrderContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <MapPin className="h-6 w-6 text-primary shrink-0" />
              {t("whatsapp.cityTitle")}
            </DialogTitle>
            <DialogDescription>{t("whatsapp.citySubtitle")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 overflow-y-auto pr-1 -mr-1 max-h-[50vh] sm:max-h-96">
            {loadingCities && <p className="text-sm text-muted-foreground">{t("whatsapp.cityLoading")}</p>}
            {loadError && <p className="text-sm text-muted-foreground">{t("whatsapp.cityError")}</p>}
            {!loadingCities && !loadError && cities.length === 0 && (
              <p className="text-sm text-muted-foreground">{t("whatsapp.cityEmpty")}</p>
            )}
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCity(city.phone)}
                className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {city.nombre}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </WhatsAppCityOrderContext.Provider>
  );
}
