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
import { Package, Tag } from "lucide-react";
import QrLinkCardGrid, { type QrDisplayCard } from "@/components/QrLinkCardGrid";

const DEFAULT_LINKS_HTML = '<p style="text-align:center"><img src="/miau-logo-mark.png" alt="Miau Miau"></p><div style="text-align:center;color:#000000;font-family:Fredoka,sans-serif"><h2 style="color:#000000;font-family:Fredoka,sans-serif;font-weight:700">Miau Miau</h2><p style="color:#000000;font-family:Fredoka,sans-serif;font-weight:600">Elige lo que quieres ver</p></div>';

function linksHtmlForPage(html: string) {
  const cleaned = html.replace(/<p[^>]*>\s*<\/p>/gi, "");
  if (/<img\b/i.test(cleaned)) return cleaned;
  const text = cleaned.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  if (!text || text === "Miau Miau Elige lo que quieres ver") return DEFAULT_LINKS_HTML;
  return cleaned;
}

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
  const showSocial = qrActions.social && Boolean(socialInstagramUrl || socialFacebookUrl || socialTiktokUrl);

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
  const featuredCard: QrDisplayCard | null = qrActions.whatsapp && !qrActions.cards.whatsapp.hidden
    ? { id: "whatsapp", ...qrActions.cards.whatsapp }
    : null;
  const linkCards: QrDisplayCard[] = qrActions.cardOrder.flatMap((id) => {
    if (id === "mercadolibre") {
      return showMercadoLibre && !qrActions.cards.mercadolibre.hidden ? [{ id, href: mercadolibreUrl, ...qrActions.cards.mercadolibre }] : [];
    }
    if (id === "instagram" || id === "facebook" || id === "tiktok") {
      const href = id === "instagram" ? socialInstagramUrl : id === "facebook" ? socialFacebookUrl : socialTiktokUrl;
      return qrActions.social && !qrActions.cards[id].hidden && href ? [{ id, href, ...qrActions.cards[id] }] : [];
    }
    const link = qrActions.links.find((item) => item.id === id);
    if (!link || link.hidden || !/^https?:\/\//i.test(link.url.trim())) return [];
    return [{
      id: link.id,
      href: link.url,
      name: link.name,
      description: link.description,
      icon: link.icon,
      size: link.size,
      iconBackgroundColor: link.iconBackgroundColor,
      cardColor: link.cardColor,
      iconColor: link.iconColor,
    }];
  });
  const linksHtml = linksHtmlForPage(qrActions.linksHtml.trim());
  const hasLinksText = /<img\b/i.test(linksHtml) || linksHtml.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
  const hasContent =
    qrActions.whatsapp ||
    qrActions.catalog ||
    qrActions.packages ||
    showPromotions ||
    showMercadoLibre ||
    showSocial ||
    linkCards.length > 0 ||
    hasLinksText;

  return (
    <div className="min-h-screen w-full bg-white">
      <section className="w-full px-4 pb-12 pt-8">
        <div className="container mx-auto text-center">
          {!settingsLoading && hasLinksText && (
            <div
              className="mx-auto mt-8 max-w-3xl [&_a]:underline [&_font[size='1']]:text-xs [&_font[size='2']]:text-sm [&_font[size='3']]:text-base [&_font[size='4']]:text-lg [&_font[size='5']]:text-2xl [&_font[size='6']]:text-4xl [&_font[size='7']]:text-5xl [&_font[size='7']]:font-black [&_h2]:text-4xl [&_h2]:font-black [&_h3]:text-2xl [&_h3]:font-bold [&_img]:mx-auto [&_img]:my-4 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-left [&_p]:mb-3 [&_s]:line-through [&_strike]:line-through [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left"
              style={{ color: qrActions.linksTextColor, fontFamily: "'Fredoka', sans-serif" }}
              dangerouslySetInnerHTML={{ __html: linksHtml }}
            />
          )}

          {!settingsLoading && !hasContent && (
            <p className="mt-8" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Por ahora no hay contenido disponible en este código.
            </p>
          )}

          {!settingsLoading && (
            <QrLinkCardGrid
              featured={featuredCard}
              cards={linkCards}
              onFeaturedClick={() => openOrder(t("whatsapp.defaultMessage"))}
            />
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
