import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/data/products";
import { promotions } from "@/data/promotions";
import ProductCard from "@/components/ProductCard";
import PromoCard from "@/components/PromoCard";
import { Button } from "@/components/ui/button";
import { Star, Truck, Heart, Award } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";
import brandStyle from "@/assets/brand-style.png";

const Index = () => {
  const { t } = useLanguage();
  const featuredPromos = promotions.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden paw-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/30 to-accent/10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                {t("hero.subtitle")}
              </p>
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8 py-6 rounded-full font-extrabold shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-green-500 hover:bg-green-600 text-white mt-2">
                  📱 {t("hero.cta")}
                </Button>
              </a>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <img
                  src={brandStyle}
                  alt="Miau Miau"
                  className="w-64 md:w-80 rounded-3xl shadow-2xl animate-float"
                />
                <div className="absolute -bottom-4 -right-4 animate-float-delay">
                  <img
                    src={brandLogo}
                    alt="Logo"
                    className="w-20 h-20 rounded-full shadow-lg border-4 border-card"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Miau Miau */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center text-foreground mb-12">
            {t("why.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Star className="h-8 w-8" />, title: t("why.quality"), desc: t("why.qualityDesc") },
              { icon: <Truck className="h-8 w-8" />, title: t("why.delivery"), desc: t("why.deliveryDesc") },
              { icon: <Award className="h-8 w-8" />, title: t("why.loyalty"), desc: t("why.loyaltyDesc") },
              { icon: <Heart className="h-8 w-8" />, title: t("why.love"), desc: t("why.loveDesc") },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">{t("catalog.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("catalog.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-16 bg-secondary/30 paw-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">{t("promos.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("promos.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredPromos.map((promo) => (
              <PromoCard key={promo.id} promotion={promo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
