import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/data/products";
import { promotions } from "@/data/promotions";
import ProductCard from "@/components/ProductCard";
import PromoCard from "@/components/PromoCard";
import { Button } from "@/components/ui/button";
import { Star, Truck, Heart, Award } from "lucide-react";
import heroCats from "@/assets/hero-cats.jpg";
import brandLogo from "@/assets/brand-logo.png";

const Index = () => {
  const { t } = useLanguage();
  const featuredPromos = promotions.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/h3u-4RAwZSA?autoplay=1&mute=1&loop=1&playlist=h3u-4RAwZSA&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1"
            title="Miau Miau Video"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] md:w-[120%] md:h-[120%] pointer-events-none"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
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
              <img
                src={brandLogo}
                alt="Miau Miau Logo"
                className="w-40 md:w-56 rounded-full shadow-2xl border-4 border-card animate-float"
              />
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
