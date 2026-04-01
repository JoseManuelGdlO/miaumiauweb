import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
      <div className="bg-secondary/50 flex items-center justify-center py-8 text-6xl group-hover:scale-110 transition-transform duration-300">
        {product.image}
      </div>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground leading-tight">{name}</h3>
          <Badge variant="secondary" className="text-xs shrink-0">{categoryLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <p className="text-lg font-extrabold text-primary">{product.price}</p>
        <WhatsAppCTA productName={name} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
