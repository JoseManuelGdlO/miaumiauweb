import { useLanguage } from "@/contexts/LanguageContext";
import { promotions } from "@/data/promotions";
import PromoCard from "@/components/PromoCard";

const Promotions = () => {
  const { t } = useLanguage();

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
