import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PromoCard from "@/components/PromoCard";
import { fetchActivePromotions, type Promotion } from "@/lib/promotions";

const Promotions = () => {
  const { t } = useLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPromotions = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchActivePromotions();
        if (!cancelled) {
          setPromotions(data);
        }
      } catch {
        if (!cancelled) {
          setError("No pudimos cargar promociones en este momento.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPromotions();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen py-12 paw-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground">{t("promos.title")}</h1>
          <p className="text-lg text-muted-foreground mt-3">{t("promos.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {loading && (
            <p className="md:col-span-2 text-center text-muted-foreground">Cargando promociones...</p>
          )}
          {!loading && error && <p className="md:col-span-2 text-center text-red-500">{error}</p>}
          {!loading && !error && promotions.length === 0 && (
            <p className="md:col-span-2 text-center text-muted-foreground">No hay promociones vigentes por ahora.</p>
          )}
          {!loading && !error && promotions.map((promo) => <PromoCard key={promo.id} promotion={promo} />)}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
