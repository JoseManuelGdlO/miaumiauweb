import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";
import { WhatsAppCTA } from "./WhatsAppButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, Record<string, string>> = {
  arena: { es: "Arena", en: "Litter" },
  perlas: { es: "Perlas", en: "Pearls" },
  accesorio: { es: "Accesorio", en: "Accessory" },
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { language } = useLanguage();
  const name = language === "es" ? product.nameEs : product.nameEn;
  const description = language === "es" ? product.descriptionEs : product.descriptionEn;
  const categoryLabel = categoryLabels[product.category]?.[language] || product.category;

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
      <div className="bg-section-lavender flex items-center justify-center p-6 overflow-hidden">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          width={512}
          height={512}
          className="w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-foreground leading-tight text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {name}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0 rounded-full">{categoryLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-xl font-black text-primary">{product.price}</p>
        <WhatsAppCTA productName={name} />
      </div>
    </div>
  );
};

export default ProductCard;
