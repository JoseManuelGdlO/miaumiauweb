import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";
import { WhatsAppCTA } from "./WhatsAppButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const categoryLabel = product.category === "producto" ? "Producto" : "Paquete";

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
      <div className="aspect-square overflow-hidden bg-card">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ${compact ? "" : "group-hover:scale-105"}`}
        />
      </div>
      <div className={`p-6 space-y-3 ${compact ? "md:p-4 md:space-y-2" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-extrabold text-foreground leading-tight text-lg ${compact ? "md:text-base" : ""}`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {product.title}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0 rounded-full">{categoryLabel}</Badge>
        </div>
        <p className={`text-sm text-muted-foreground leading-relaxed ${compact && !expanded ? "md:line-clamp-2" : ""}`}>
          {product.description}
        </p>
        {compact && (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-primary"
          >
            {expanded ? t("product.readLess") : t("product.readMore")}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
        <p className={`text-xl font-black text-primary ${compact ? "md:text-lg" : ""}`}>{product.price}</p>
        <WhatsAppCTA productName={product.title} />
      </div>
    </div>
  );
};

export default ProductCard;
