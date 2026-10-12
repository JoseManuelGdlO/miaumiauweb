import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicSiteSettings } from "@/contexts/PublicSiteSettingsContext";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";
import { Heart, PawPrint, Smartphone, Instagram, Facebook, Music } from "lucide-react";
import siteLogo from "@/assets/logo.jpg";
import WaveDivider from "./WaveDivider";
import InteractiveYarn from "./InteractiveYarn";

const Footer = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const {
    socialInstagramUrl,
    socialFacebookUrl,
    socialTiktokUrl,
  } = usePublicSiteSettings();

  const socialLinks = [
    { href: socialInstagramUrl, label: "Instagram", icon: Instagram },
    { href: socialFacebookUrl, label: "Facebook", icon: Facebook },
    { href: socialTiktokUrl, label: "TikTok", icon: Music },
  ];
  const isQr = pathname === "/qr" || pathname === "/QR";

  const columns = (
    <>
      <div className={`flex flex-col gap-3 ${isQr ? "items-start" : "items-center md:items-start"}`}>
        <div className="flex items-center gap-3">
          <img src={siteLogo} alt="Miau Miau" className="h-10 w-auto max-w-[160px] object-contain" />
          <span className="text-2xl font-extrabold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Miau Miau</span>
        </div>
        <p className={`text-sm opacity-80 inline-flex items-center gap-1.5 ${isQr ? "text-left" : "text-center md:text-left"}`}>
          Arena premium para gatitos felices <PawPrint className="h-3.5 w-3.5 inline" />
        </p>
      </div>

      <div className={isQr ? "text-left" : "text-center md:text-left"}>
        <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.contact")}</h4>
        <button
          type="button"
          onClick={() => openOrder(t("whatsapp.defaultMessage"))}
          className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-left bg-transparent border-0 p-0 cursor-pointer text-inherit"
        >
          <Smartphone className="h-4 w-4 shrink-0" /> {t("footer.whatsapp")}
        </button>
      </div>

      <div className={isQr ? "text-left" : "text-center md:text-left"}>
        <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.followUs")}</h4>
        <div className={`flex gap-4 md:flex-row md:flex-wrap md:justify-start ${isQr ? "flex-col items-start gap-2 md:gap-4" : "flex-wrap justify-center"}`}>
          {socialLinks.map(({ href, label, icon: Icon }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1"
              >
                <Icon className="h-4 w-4" /> {label}
              </a>
            ) : (
              <span key={label} className="text-sm opacity-80 inline-flex items-center gap-1">
                <Icon className="h-4 w-4" /> {label}
              </span>
            ),
          )}
        </div>
      </div>
    </>
  );

  const copyright = (
    <div className={`border-t border-primary-foreground/20 pt-6 text-sm opacity-60 flex items-center gap-1 ${isQr ? "justify-start text-left md:justify-center md:text-center" : "justify-center text-center"}`}>
      © 2026 Miau Miau. {t("footer.rights")}
      <Heart className="h-3 w-3 fill-current text-primary inline" />
    </div>
  );

  if (isQr) {
    return (
      <div>
        <div className="-mb-px">
          <WaveDivider color="hsl(var(--foreground))" />
        </div>
        <footer className="relative overflow-hidden bg-foreground pb-32 pt-10 text-primary-foreground md:min-h-[24rem] md:pb-8 md:pt-16 lg:min-h-[24rem]">
          <InteractiveYarn />
          <div className="container relative z-10 mx-auto flex flex-col px-4 md:min-h-[24rem] md:pl-64 md:pr-4 lg:min-h-[22rem] lg:pl-[30rem]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {columns}
            </div>
            <div className="mt-10 md:mt-auto md:pt-16">
              {copyright}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <div className="-mb-px">
        <WaveDivider color="hsl(var(--foreground))" />
      </div>
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {columns}
          </div>
          <div className="mt-10">
            {copyright}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
