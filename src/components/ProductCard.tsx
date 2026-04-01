import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/data/products";
import { WhatsAppCTA } from "./WhatsAppButton";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useLanguage();
  const categoryLabel = product.category === "producto" ? "Producto" : "Paquete";

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
      <div className="overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-foreground leading-tight text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {product.title}
          </h3>
          <Badge variant="secondary" className="text-xs shrink-0 rounded-full">{categoryLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        <p className="text-xl font-black text-primary">{product.price}</p>
        <WhatsAppCTA productName={product.title} />
      </div>
    </div>
  );
};

export default ProductCard;
