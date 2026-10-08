import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import { packages, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PromoCard from "@/components/PromoCard";
import { fetchActivePromotions, type Promotion } from "@/lib/promotions";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";
import { ExternalLink, Facebook, Instagram, Music, Package, Smartphone, Tag } from "lucide-react";

const QrLanding = () => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const {
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

  useEffect(() => {
    const previousBody = document.body.style.backgroundColor;
    const previousHtml = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = qrActions.linksPanelColor;
    document.documentElement.style.backgroundColor = qrActions.linksPanelColor;
    return () => {
      document.body.style.backgroundColor = previousBody;
      document.documentElement.style.backgroundColor = previousHtml;
    };
  }, [qrActions.linksPanelColor]);

  useEffect(() => {
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
  }, [qrActions.promotions]);

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

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: qrActions.linksPanelColor, color: qrActions.linksTextColor }}
    >
      <section className="w-full px-4 py-16">
        <div className="container mx-auto text-center">
          {hasLinksText ? (
            <div
              className="mx-auto mb-10 max-w-3xl [&_a]:underline [&_font[size='1']]:text-xs [&_font[size='2']]:text-sm [&_font[size='3']]:text-base [&_font[size='4']]:text-lg [&_font[size='5']]:text-2xl [&_font[size='6']]:text-4xl [&_font[size='7']]:text-5xl [&_font[size='7']]:font-black [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-left [&_p]:mb-3 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left"
              style={{ color: qrActions.linksTextColor }}
              dangerouslySetInnerHTML={{ __html: linksHtml }}
            />
          ) : (
            <>
              <h1
                className="text-4xl md:text-6xl font-black"
                style={{ fontFamily: "'Fredoka', sans-serif", color: qrActions.linksTextColor }}
              >
                Miau Miau
              </h1>
              <p className="mt-3 mb-10 text-lg" style={{ color: qrActions.linksTextColor }}>
                Elige lo que quieres ver
              </p>
            </>
          )}

          {!hasContent && (
            <p>Por ahora no hay contenido disponible en este código.</p>
          )}

          {(qrActions.whatsapp || bubbles.length > 0 || showMercadoLibre || showSocial) && (
            <>
          <div className="flex flex-wrap justify-center gap-4">
            {qrActions.whatsapp && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-extrabold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: qrActions.linksBubbleColor, color: qrActions.linksTextColor }}
                onClick={() => openOrder(t("whatsapp.defaultMessage"))}
              >
                <Smartphone className="h-5 w-5" />
                {t("hero.cta")}
              </button>
            )}
            {bubbles.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-extrabold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: qrActions.linksBubbleColor, color: qrActions.linksTextColor }}
              >
                <ExternalLink className="h-5 w-5" />
                {link.name}
              </a>
            ))}
            {showMercadoLibre && (
              <a
                href={mercadolibreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-extrabold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: qrActions.linksBubbleColor, color: qrActions.linksTextColor }}
              >
                <ExternalLink className="h-5 w-5" />
                {t("ml.cta")}
              </a>
            )}
            {showSocial &&
              socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-extrabold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: qrActions.linksBubbleColor, color: qrActions.linksTextColor }}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </a>
              ))}
          </div>
            </>
          )}
        </div>
      </section>

      {qrActions.catalog && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2
              className="text-3xl md:text-5xl font-black text-center text-foreground mb-10"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {t("catalog.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {qrActions.packages && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Package className="h-8 w-8 text-primary mx-auto mb-3" />
              <h2
                className="text-3xl md:text-5xl font-black text-foreground"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Paquetes y Combos
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <ProductCard key={pkg.id} product={pkg} />
              ))}
            </div>
          </div>
        </section>
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
