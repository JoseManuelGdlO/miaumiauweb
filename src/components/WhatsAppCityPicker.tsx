import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_CITIES } from "@/data/whatsappCities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function buildWhatsAppUrl(phoneDigits: string, text: string) {
  const clean = phoneDigits.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
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
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openOrder = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

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
            {WHATSAPP_CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCity(city.phone)}
                className="w-full text-left rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {language === "en" ? city.nameEn : city.nameEs}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </WhatsAppCityOrderContext.Provider>
  );
}
