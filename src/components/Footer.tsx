import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";
import { Heart, PawPrint, Smartphone, Instagram, Facebook, Music } from "lucide-react";
import siteLogo from "@/assets/logo.jpg";
import WaveDivider from "./WaveDivider";
import InteractiveYarn from "./InteractiveYarn";

const Footer = () => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const {
    socialInstagramUrl,
    socialFacebookUrl,
    socialTiktokUrl,
  } = usePublicSiteSettings();

  const socialLinks = [
    socialInstagramUrl ? { href: socialInstagramUrl, label: "Instagram", icon: Instagram } : null,
    socialFacebookUrl ? { href: socialFacebookUrl, label: "Facebook", icon: Facebook } : null,
    socialTiktokUrl ? { href: socialTiktokUrl, label: "TikTok", icon: Music } : null,
  ].filter((link): link is { href: string; label: string; icon: typeof Instagram } => link !== null);

  return (
    <div>
      <div className="-mb-px">
        <WaveDivider color="hsl(var(--foreground))" />
      </div>
      <footer className="relative overflow-hidden bg-foreground pb-32 pt-10 text-primary-foreground md:min-h-[24rem] md:pb-8 md:pt-16 lg:min-h-[24rem]">
        <InteractiveYarn />
        <div className="container relative z-10 mx-auto flex flex-col px-4 md:min-h-[24rem] md:pl-64 md:pr-4 lg:min-h-[22rem] lg:pl-[30rem]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <img src={siteLogo} alt="Miau Miau" className="h-10 w-auto max-w-[160px] object-contain" />
                <span className="text-2xl font-extrabold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Miau Miau</span>
              </div>
              <p className="inline-flex items-center gap-1.5 text-left text-sm opacity-80">
                Arena premium para gatitos felices <PawPrint className="inline h-3.5 w-3.5" />
              </p>
            </div>

            <div className="text-left">
              <h4 className="mb-3 text-lg font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.contact")}</h4>
              <button
                type="button"
                onClick={() => openOrder(t("whatsapp.defaultMessage"))}
                className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left text-sm text-inherit opacity-80 transition-opacity hover:opacity-100"
              >
                <Smartphone className="h-4 w-4 shrink-0" /> {t("footer.whatsapp")}
              </button>
            </div>

            {socialLinks.length > 0 && (
              <div className="text-left">
                <h4 className="mb-3 text-lg font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.followUs")}</h4>
                <div className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap md:justify-start md:gap-4">
                  {socialLinks.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm opacity-80 transition-opacity hover:opacity-100"
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-10 md:mt-auto md:pt-16">
            <div className="flex items-center justify-start gap-1 border-t border-primary-foreground/20 pt-6 text-left text-sm opacity-60 md:justify-center md:text-center">
              © 2026 Miau Miau. {t("footer.rights")}
              <Heart className="inline h-3 w-3 fill-current text-primary" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
