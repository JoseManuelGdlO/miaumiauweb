import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { products, packages } from "@/data/products";
import { promotions } from "@/data/promotions";
import ProductCard from "@/components/ProductCard";
import PromoCard from "@/components/PromoCard";
import WaveDivider from "@/components/WaveDivider";
import { Button } from "@/components/ui/button";
import { Star, Truck, Heart, Award, PawPrint, Smartphone, Cat, Package } from "lucide-react";
import { normalizeApiBaseUrl } from "@/lib/apiBase";
import { buildHeroYoutubeEmbedSrc, DEFAULT_HERO_YOUTUBE_VIDEO_ID } from "@/lib/youtubeHero";

const Index = () => {
  const { t } = useLanguage();
  const featuredPromos = promotions.slice(0, 2);
  const [heroIframeSrc, setHeroIframeSrc] = useState(() =>
    buildHeroYoutubeEmbedSrc(DEFAULT_HERO_YOUTUBE_VIDEO_ID)
  );

  useEffect(() => {
    const base = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
    if (!base) return;

    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${base}/public/site-settings`);
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as { data?: { heroYoutubeVideoId?: string } };
        const id = json?.data?.heroYoutubeVideoId;
        if (typeof id === "string" && id.trim() && !cancelled) {
          setHeroIframeSrc(buildHeroYoutubeEmbedSrc(id.trim()));
        }
      } catch {
        /* mantiene el src por defecto */
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            src={heroIframeSrc}
            title="Miau Miau Video"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[300%] min-h-[300%] sm:min-w-[200%] sm:min-h-[200%] md:min-w-[150%] md:min-h-[150%] lg:min-w-[120%] lg:min-h-[120%] pointer-events-none"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm px-4 py-1.5 rounded-full border border-primary/20">
                <PawPrint className="h-4 w-4" />
                Arena Premium para Gatitos
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground leading-[1.1]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                {t("hero.subtitle")}
              </p>
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-10 py-7 rounded-full font-extrabold shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-green-500 hover:bg-green-600 text-white mt-2 gap-2">
                  <Smartphone className="h-5 w-5" />
                  {t("hero.cta")}
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <WaveDivider color="hsl(var(--section-lavender))" />
        </div>
      </section>

      {/* Why Miau Miau - Lavender section */}
      <section className="bg-section-lavender py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-5xl font-black text-center text-foreground mb-4"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {t("why.title")}
          </h2>
          <div className="w-24 h-1 bg-primary rounded-full mx-auto mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Star className="h-8 w-8" />, title: t("why.quality"), desc: t("why.qualityDesc") },
              { icon: <Truck className="h-8 w-8" />, title: t("why.delivery"), desc: t("why.deliveryDesc") },
              { icon: <Award className="h-8 w-8" />, title: t("why.loyalty"), desc: t("why.loyaltyDesc") },
              { icon: <Heart className="h-8 w-8" />, title: t("why.love"), desc: t("why.loveDesc") },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-3xl p-8 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-foreground mb-2 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="hsl(var(--background))" />
        </div>
      </section>

      {/* Products Catalog */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-black text-foreground"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {t("catalog.title")}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">{t("catalog.subtitle")}</p>
            <div className="w-24 h-1 bg-accent rounded-full mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="hsl(var(--section-peach))" />
        </div>
      </section>

      {/* Packages Section - Peach */}
      <section className="bg-section-peach py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-foreground"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Paquetes y Combos
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">Ahorra más con nuestros paquetes especiales</p>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <ProductCard key={pkg.id} product={pkg} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="hsl(var(--section-sky))" />
        </div>
      </section>

      {/* Featured Promotions - Sky section */}
      <section className="bg-section-sky py-16 md:py-20 paw-pattern relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-black text-foreground"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {t("promos.title")}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">{t("promos.subtitle")}</p>
            <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredPromos.map((promo) => (
              <PromoCard key={promo.id} promotion={promo} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="hsl(var(--section-mint))" />
        </div>
      </section>

      {/* CTA Section - Mint */}
      <section className="bg-section-mint py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
              <Cat className="h-10 w-10" />
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-foreground"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {t("cta.whatsapp")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("hero.subtitle")}
            </p>
            <a
              href="https://wa.me/521234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="text-lg px-10 py-7 rounded-full font-extrabold shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-green-500 hover:bg-green-600 text-white mt-4 gap-2">
                <Smartphone className="h-5 w-5" />
                {t("hero.cta")}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
