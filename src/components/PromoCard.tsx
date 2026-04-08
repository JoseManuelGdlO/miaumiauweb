import { useLanguage } from "@/contexts/LanguageContext";
import type { Promotion } from "@/lib/promotions";
import { Badge } from "@/components/ui/badge";
import { Gift, Truck, Star, Cat } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  gift: <Gift className="h-8 w-8" />,
  truck: <Truck className="h-8 w-8" />,
  star: <Star className="h-8 w-8" />,
  cat: <Cat className="h-8 w-8" />,
};

interface PromoCardProps {
  promotion: Promotion;
}

const PromoCard = ({ promotion }: PromoCardProps) => {
  const { language, t } = useLanguage();
  const title = language === "es" ? promotion.titleEs : promotion.titleEn;
  const description = language === "es" ? promotion.descriptionEs : promotion.descriptionEn;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${promotion.bgColor} p-6 md:p-8 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}>
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            {iconMap[promotion.icon] || <Gift className="h-8 w-8" />}
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-lg px-3 py-1 font-extrabold">
            {promotion.discount}
          </Badge>
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold mb-2 leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>{title}</h3>
        <p className="text-sm md:text-base opacity-90 mb-4">{description}</p>
        <p className="text-xs opacity-70">
          {t("promos.valid")} {new Date(promotion.validUntil).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
        </p>
      </div>
    </div>
  );
};

export default PromoCard;
