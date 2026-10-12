import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PromoCard from "@/components/PromoCard";
import { Button } from "@/components/ui/button";
import { fetchActivePromotions, type Promotion } from "@/lib/promotions";

const Promotions = () => {
  const { t } = useLanguage();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPromotions = async () => {
      setLoading(true);
      try {
        const data = await fetchActivePromotions();
        if (!cancelled) {
          setPromotions(data);
        }
      } catch {
        if (!cancelled) {
          setPromotions([]);
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

  if (loading) {
    return (
      <div className="min-h-screen py-12 paw-pattern flex items-center justify-center">
        <p className="text-muted-foreground">Cargando promociones...</p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Tag className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h1
            className="text-3xl font-black text-foreground md:text-5xl"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {t("promos.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("promos.empty")}</p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-primary" />
          <Button asChild size="lg" className="mt-8 rounded-full px-8 font-bold">
            <Link to="/">{t("promos.goHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 paw-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground">{t("promos.title")}</h1>
          <p className="text-lg text-muted-foreground mt-3">{t("promos.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <PromoCard key={promo.id} promotion={promo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
