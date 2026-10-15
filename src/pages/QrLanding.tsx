import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PackageCarousel from "@/components/PackageCarousel";
import WaveDivider from "@/components/WaveDivider";
import PromoCard from "@/components/PromoCard";
import { fetchActivePackages } from "@/lib/catalogPackages";
import { fetchCatalogProducts } from "@/lib/catalogProducts";
import { fetchActivePromotions, type Promotion } from "@/lib/promotions";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";
import { ExternalLink, Facebook, Instagram, Music, Package, Smartphone, Tag } from "lucide-react";

const QrLanding = () => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const {
    loading: settingsLoading,
    qrActions,
    mercadolibreUrl,
    socialInstagramUrl,
    socialFacebookUrl,
    socialTiktokUrl,
  } = usePublicSiteSettings();

  const showMercadoLibre = qrActions.mercadolibre && Boolean(mercadolibreUrl);
  const socialLinks = [
    socialInstagramUrl ? { href: socialInstagramUrl, label: "Instagram", icon: Instagram } : null,
    socialFacebookUrl ? { href: socialFacebookUrl, label: "Facebook", icon: Facebook } : null,
    socialTiktokUrl ? { href: socialTiktokUrl, label: "TikTok", icon: Music } : null,
  ].filter((link): link is { href: string; label: string; icon: typeof Instagram } => link !== null);
  const showSocial = qrActions.social && socialLinks.length > 0;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsReady, setPromotionsReady] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "error">("loading");
  const [catalogPackages, setCatalogPackages] = useState<Product[]>([]);
  const [packagesStatus, setPackagesStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const previousBody = document.body.style.backgroundColor;
    const previousHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = "#ffffff";
    document.documentElement.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = previousBody;
      document.documentElement.style.backgroundColor = previousHtml;
    };
  }, []);

  useEffect(() => {
    if (settingsLoading) return;
    if (!qrActions.promotions) {
      setPromotions([]);
      setPromotionsReady(true);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const active = await fetchActivePromotions();
        if (!cancelled) setPromotions(active);
      } catch {
        if (!cancelled) setPromotions([]);
      } finally {
        if (!cancelled) setPromotionsReady(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [settingsLoading, qrActions.promotions]);

  useEffect(() => {
    if (settingsLoading) return;
    if (!qrActions.catalog) {
      setCatalogProducts([]);
      setCatalogStatus("ready");
      return;
    }

    let cancelled = false;
    setCatalogStatus("loading");
    const load = async () => {
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
    void load();
    return () => {
      cancelled = true;
    };
  }, [settingsLoading, qrActions.catalog]);

  useEffect(() => {
    if (settingsLoading) return;
    if (!qrActions.packages) {
      setCatalogPackages([]);
      setPackagesStatus("ready");
      return;
    }

    let cancelled = false;
    setPackagesStatus("loading");
    const load = async () => {
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
    void load();
    return () => {
      cancelled = true;
    };
  }, [settingsLoading, qrActions.packages]);

  const showPromotions = qrActions.promotions && promotionsReady && promotions.length > 0;
  const bubbles = qrActions.links.filter((link) => link.name.trim() && /^https?:\/\//i.test(link.url.trim()));
  const linksHtml = qrActions.linksHtml.trim();
  const hasLinksText = linksHtml.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
  const hasContent =
    qrActions.whatsapp ||
    qrActions.catalog ||
    qrActions.packages ||
    showPromotions ||
    showMercadoLibre ||
    showSocial ||
    bubbles.length > 0 ||
    hasLinksText;

  const showBusiness = bubbles.length > 0 || showMercadoLibre;
  const linkRowClass =
    "inline-flex items-center justify-center gap-2 py-2 text-base font-semibold text-neutral-950 transition-opacity hover:opacity-70";

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="w-full px-4 py-16">
        <div className="container mx-auto text-center">
          {!settingsLoading && hasLinksText && (
            <div
              className="mx-auto mb-10 max-w-3xl [&_a]:underline [&_font[size='1']]:text-xs [&_font[size='2']]:text-sm [&_font[size='3']]:text-base [&_font[size='4']]:text-lg [&_font[size='5']]:text-2xl [&_font[size='6']]:text-4xl [&_font[size='7']]:text-5xl [&_font[size='7']]:font-black [&_h2]:text-4xl [&_h2]:font-black [&_h3]:text-2xl [&_h3]:font-bold [&_img]:mx-auto [&_img]:my-4 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-left [&_p]:mb-3 [&_s]:line-through [&_strike]:line-through [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left"
              style={{ color: qrActions.linksTextColor }}
              dangerouslySetInnerHTML={{ __html: linksHtml }}
            />
          )}

          {!settingsLoading && !hasContent && (
            <p>Por ahora no hay contenido disponible en este código.</p>
          )}

          {!settingsLoading && qrActions.whatsapp && (
            <div className="mb-10 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-extrabold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: qrActions.linksBubbleColor, color: qrActions.linksBubbleTextColor }}
                onClick={() => openOrder(t("whatsapp.defaultMessage"))}
              >
                <Smartphone className="h-5 w-5" />
                {t("hero.cta")}
              </button>
            </div>
          )}

          {!settingsLoading && (showBusiness || showSocial) && (
            <div className={`mx-auto w-full max-w-3xl ${showBusiness && showSocial ? "grid grid-cols-2" : "flex justify-center"}`}>
              {showBusiness && (
                <div className={`flex flex-col items-center ${showSocial ? "border-r border-neutral-950/20 px-4" : ""}`}>
                  <h2 className="mb-2 text-xl font-black text-neutral-950" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    Negocio
                  </h2>
                  {bubbles.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkRowClass}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {link.name}
                    </a>
                  ))}
                  {showMercadoLibre && (
                    <a
                      href={mercadolibreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkRowClass}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("ml.cta")}
                    </a>
                  )}
                </div>
              )}
              {showSocial && (
                <div className={`flex flex-col items-center ${showBusiness ? "px-4" : ""}`}>
                  <h2 className="mb-2 text-xl font-black text-neutral-950" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    Redes
                  </h2>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkRowClass}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!settingsLoading && qrActions.catalog && (
        <section className="py-16 md:py-8">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center md:mb-6">
              <h2
                className="text-3xl md:text-4xl font-black text-center text-foreground"
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
        </section>
      )}

      {!settingsLoading && qrActions.packages && (
        <>
          <div className="-mb-px">
            <WaveDivider color="hsl(var(--section-peach))" />
          </div>
          <section className="relative bg-section-peach">
            <div className="paw-pattern-qr py-16">
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
                {packagesStatus === "loading" && (
                  <p className="text-center text-muted-foreground">{t("packages.loading")}</p>
                )}
                {packagesStatus === "error" && (
                  <p className="text-center text-muted-foreground">{t("packages.error")}</p>
                )}
                {packagesStatus === "ready" && catalogPackages.length === 0 && (
                  <p className="text-center text-muted-foreground">{t("packages.empty")}</p>
                )}
                {packagesStatus === "ready" && catalogPackages.length > 0 && (
                  <PackageCarousel packages={catalogPackages} />
                )}
              </div>
            </div>
            <WaveDivider color="#ffffff" />
          </section>
        </>
      )}

      {showPromotions && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Tag className="h-8 w-8 text-primary mx-auto mb-3" />
              <h2
                className="text-3xl md:text-5xl font-black text-foreground"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {t("promos.title")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {promotions.map((promo) => (
                <PromoCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default QrLanding;
