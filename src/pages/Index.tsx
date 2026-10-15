import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PackageCarousel from "@/components/PackageCarousel";
import PromoCard from "@/components/PromoCard";
import WaveDivider from "@/components/WaveDivider";
import { Button } from "@/components/ui/button";
import { Star, Truck, Heart, Award, PawPrint, Smartphone, Cat, Package, ExternalLink } from "lucide-react";
import { buildHeroYoutubeEmbedSrc } from "@/lib/youtubeHero";
import { fetchActivePackages } from "@/lib/catalogPackages";
import { fetchCatalogProducts } from "@/lib/catalogProducts";
import { fetchActivePromotions, type Promotion } from "@/lib/promotions";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";

/** Fondo de la sección Mercado Libre (debe coincidir con el WaveDivider previo). */
const MERCADO_LIBRE_SECTION_BG = "hsl(43 80% 94%)";

const Index = () => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const { heroYoutubeVideoId, mercadolibreUrl } = usePublicSiteSettings();
  const showMercadoLibre = Boolean(mercadolibreUrl);

  const heroIframeSrc = useMemo(
    () => buildHeroYoutubeEmbedSrc(heroYoutubeVideoId),
    [heroYoutubeVideoId]
  );

  const [featuredPromos, setFeaturedPromos] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [promotionsError, setPromotionsError] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "error">("loading");
  const [catalogPackages, setCatalogPackages] = useState<Product[]>([]);
  const [packagesStatus, setPackagesStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeWhy, setActiveWhy] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadPromotions = async () => {
      setPromotionsLoading(true);
      setPromotionsError("");
      try {
        const promotions = await fetchActivePromotions();
        if (!cancelled) {
          setFeaturedPromos(promotions);
        }
      } catch {
        if (!cancelled) {
          setPromotionsError("No pudimos cargar promociones en este momento.");
        }
      } finally {
        if (!cancelled) {
          setPromotionsLoading(false);
        }
      }
    };

    const loadCatalog = async () => {
      try {
        const items = await fetchCatalogProducts();
        if (!cancelled) {
          setCatalogProducts(items);
          setCatalogStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setCatalogProducts([]);
          setCatalogStatus("error");
        }
      }
    };

    const loadPackages = async () => {
      try {
        const items = await fetchActivePackages();
        if (!cancelled) {
          setCatalogPackages(items);
          setPackagesStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setCatalogPackages([]);
          setPackagesStatus("error");
        }
      }
    };

    void loadPromotions();
    void loadCatalog();
    void loadPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const id = window.setInterval(() => {
      setActiveWhy((current) => (current + 1) % 4);
    }, 4000);

    return () => window.clearInterval(id);
  }, [activeWhy]);

  const showPackages = packagesStatus === "ready" && catalogPackages.length > 0;
  const showPromos = !promotionsLoading && !promotionsError && featuredPromos.length > 0;
  const afterCatalogColor = showPackages
    ? "hsl(var(--section-peach))"
    : showPromos
      ? "hsl(var(--section-sky))"
      : showMercadoLibre
        ? MERCADO_LIBRE_SECTION_BG
        : "hsl(var(--section-mint))";

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video — iframe 16:9 con “cover” (equivalente a object-fit: cover) */}
      <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden bg-black">
          <iframe
            src={heroIframeSrc}
            title="Miau Miau Video"
            className="pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 border-0 h-[56.25vw] min-h-[100svh] w-screen min-w-[177.78svh]"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.92) 24%, hsl(var(--background) / 0.5) 48%, transparent 72%)",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto flex justify-center px-4 pb-24 pt-20 md:pb-32">
          <div className="flex w-full flex-col items-center space-y-6 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm px-4 py-1.5 rounded-full border border-primary/20">
                <PawPrint className="h-4 w-4" />
                Arena Premium para Gatitos
              </div>
              <h1
                className="whitespace-nowrap font-black leading-none text-foreground text-[clamp(1.05rem,4.2vw,5.25rem)]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                {t("hero.subtitle")}
              </p>
              <Button
                type="button"
                size="lg"
                className="text-lg px-10 py-7 rounded-full font-extrabold shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-green-500 hover:bg-green-600 text-white mt-2 gap-2"
                onClick={() => openOrder(t("whatsapp.defaultMessage"))}
              >
                <Smartphone className="h-5 w-5" />
                {t("hero.cta")}
              </Button>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <WaveDivider color="hsl(var(--section-lavender))" />
        </div>
      </section>

      {/* Why Miau Miau - Lavender section */}
      <section className="relative overflow-hidden bg-section-lavender py-16 md:py-24">
        <div className="container relative mx-auto px-4">
          <h2
            className="relative z-10 mb-4 text-center text-3xl font-black text-foreground md:text-5xl"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {t("why.title")}
          </h2>
          <div className="relative z-10 mx-auto mb-14 h-1 w-24 rounded-full bg-primary" />
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-3 md:h-[24rem] md:flex-row">
            {[
              { Icon: Star, title: t("why.quality"), desc: t("why.qualityDesc"), tone: "bg-accent text-accent-foreground", detail: "text-accent-foreground/80" },
              { Icon: Truck, title: t("why.delivery"), desc: t("why.deliveryDesc"), tone: "bg-green-500 text-white", detail: "text-white/90" },
              { Icon: Award, title: t("why.loyalty"), desc: t("why.loyaltyDesc"), tone: "bg-primary text-primary-foreground", detail: "text-primary-foreground/90" },
              { Icon: Heart, title: t("why.love"), desc: t("why.loveDesc"), tone: "bg-[hsl(158_72%_46%)] text-white", detail: "text-white/90" },
            ].map((item, i) => {
              const open = activeWhy === i;
              return (
                <button
                  key={item.title}
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActiveWhy(i)}
                  className={`flex overflow-hidden rounded-3xl text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground motion-safe:transition-all motion-safe:duration-500 ${item.tone} ${
                    open
                      ? "flex-col items-start p-6 md:min-w-0 md:flex-1 md:p-8"
                      : "flex-row items-center gap-4 px-4 py-4 md:h-full md:w-[4.75rem] md:shrink-0 md:flex-col md:justify-start md:gap-0 md:px-2 md:py-5"
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full bg-white shadow-md ${
                      open ? "h-16 w-16 md:h-20 md:w-20" : "h-12 w-12"
                    }`}
                  >
                    <item.Icon className={open ? "h-8 w-8 text-primary md:h-10 md:w-10" : "h-6 w-6 text-primary"} />
                  </span>
                  {!open && (
                    <span className="font-black md:hidden" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {item.title}
                    </span>
                  )}
                  {!open && (
                    <span
                      className="mt-5 hidden whitespace-nowrap text-xs font-black tracking-wide md:block"
                      style={{ fontFamily: "'Fredoka', sans-serif", writingMode: "vertical-rl" }}
                    >
                      {item.title}
                    </span>
                  )}
                  {open && (
                    <>
                      <span
                        className="mt-5 block text-3xl font-black leading-tight md:mt-8 md:text-5xl"
                        style={{ fontFamily: "'Fredoka', sans-serif" }}
                      >
                        {item.title}
                      </span>
                      <span className={`mt-3 max-w-md text-sm leading-relaxed md:text-base ${item.detail}`}>
                        {item.desc}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color="hsl(var(--background))" />
        </div>
      </section>

      {/* Products Catalog */}
      <section className="relative pt-16 pb-28 md:pt-8 md:pb-36">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center md:mb-6">
            <h2
              className="text-center text-3xl font-black text-foreground md:text-4xl"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {t("catalog.title")}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("catalog.subtitle")}</p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-accent" />
          </div>
          {catalogStatus === "loading" && (
            <p className="text-center text-muted-foreground">{t("catalog.loading")}</p>
          )}
          {catalogStatus === "error" && (
            <p className="text-center text-muted-foreground">{t("catalog.error")}</p>
          )}
          {catalogStatus === "ready" && catalogProducts.length === 0 && (
            <p className="text-center text-muted-foreground">{t("catalog.empty")}</p>
          )}
          {catalogStatus === "ready" && catalogProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {catalogProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider color={afterCatalogColor} />
        </div>
      </section>

      {/* Packages Section - Peach */}
      {showPackages && (
      <section className="relative bg-section-peach">
        <div className="paw-pattern-qr pt-16 pb-24 md:pb-28">
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h2
                className="text-3xl font-black text-foreground md:text-5xl"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Paquetes y Combos
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">Ahorra más con nuestros paquetes especiales</p>
              <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-primary" />
            </div>
            <PackageCarousel packages={catalogPackages} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <WaveDivider
            color={
              !promotionsLoading && !promotionsError && featuredPromos.length > 0
                ? "hsl(var(--section-sky))"
                : showMercadoLibre
                  ? MERCADO_LIBRE_SECTION_BG
                  : "hsl(var(--section-mint))"
            }
          />
        </div>
      </section>
      )}

      {/* Featured Promotions - Sky section (solo si hay promociones) */}
      {showPromos && (
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
            <WaveDivider
              color={showMercadoLibre ? MERCADO_LIBRE_SECTION_BG : "hsl(var(--section-mint))"}
            />
          </div>
        </section>
      )}

      {/* Mercado Libre — solo si hay URL configurada en el administrador */}
      {showMercadoLibre && (
        <section className="relative py-16 md:py-24" style={{ backgroundColor: MERCADO_LIBRE_SECTION_BG }}>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-200/80 text-amber-950">
                <ExternalLink className="h-10 w-10" />
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-foreground"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {t("ml.title")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("ml.subtitle")}</p>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-7 rounded-full font-extrabold shadow-lg hover:shadow-xl hover:scale-105 transition-all mt-2 gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 border-0"
                asChild
              >
                <a href={mercadolibreUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5" />
                  {t("ml.cta")}
                </a>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full">
            <WaveDivider color="hsl(var(--section-mint))" />
          </div>
        </section>
      )}

      {/* CTA Section - Mint */}
      <section className="bg-section-mint pt-16 md:pt-24">
        <div className="container mx-auto px-4 pb-16 text-center md:pb-20">
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
            <Button
              type="button"
              size="lg"
              className="text-lg px-10 py-7 rounded-full font-extrabold shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-green-500 hover:bg-green-600 text-white mt-4 gap-2"
              onClick={() => openOrder(t("whatsapp.defaultMessage"))}
            >
              <Smartphone className="h-5 w-5" />
              {t("hero.cta")}
            </Button>
          </div>
        </div>
        <WaveDivider color="hsl(var(--background))" />
      </section>
    </div>
  );
};

export default Index;
