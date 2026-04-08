import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";
import { Heart, PawPrint, Smartphone, Instagram, Facebook, Music } from "lucide-react";
import siteLogo from "@/assets/logo.jpg";
import WaveDivider from "./WaveDivider";

const Footer = () => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const {
    socialInstagramUrl,
    socialFacebookUrl,
    socialTiktokUrl,
  } = usePublicSiteSettings();

  const hasAnySocial =
    Boolean(socialInstagramUrl) || Boolean(socialFacebookUrl) || Boolean(socialTiktokUrl);

  return (
    <div>
      <WaveDivider color="hsl(var(--foreground))" />
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div
            className={`grid grid-cols-1 gap-8 ${hasAnySocial ? "md:grid-cols-3" : "md:grid-cols-2"}`}
          >
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <img src={siteLogo} alt="Miau Miau" className="h-10 w-auto max-w-[160px] object-contain" />
                <span className="text-2xl font-extrabold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Miau Miau</span>
              </div>
              <p className="text-sm opacity-80 text-center md:text-left inline-flex items-center gap-1.5">
                Arena premium para gatitos felices <PawPrint className="h-3.5 w-3.5 inline" />
              </p>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.contact")}</h4>
              <button
                type="button"
                onClick={() => openOrder(t("whatsapp.defaultMessage"))}
                className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-left bg-transparent border-0 p-0 cursor-pointer text-inherit"
              >
                <Smartphone className="h-4 w-4 shrink-0" /> {t("footer.whatsapp")}
              </button>
            </div>

            {/* Social */}
            {hasAnySocial && (
              <div className="text-center md:text-left">
                <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.followUs")}</h4>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {socialInstagramUrl ? (
                    <a
                      href={socialInstagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  ) : null}
                  {socialFacebookUrl ? (
                    <a
                      href={socialFacebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
                    >
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                  ) : null}
                  {socialTiktokUrl ? (
                    <a
                      href={socialTiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
                    >
                      <Music className="h-4 w-4" /> TikTok
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-sm opacity-60 flex items-center justify-center gap-1">
            © 2026 Miau Miau. {t("footer.rights")}
            <Heart className="h-3 w-3 fill-current text-primary inline" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
