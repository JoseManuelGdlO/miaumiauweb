import { useLanguage } from "@/contexts/LanguageContext";
import { Heart } from "lucide-react";
import brandLogo from "@/assets/brand-logo.png";
import WaveDivider from "./WaveDivider";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <div>
      <WaveDivider color="hsl(var(--foreground))" />
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <img src={brandLogo} alt="Miau Miau" className="h-12 w-12 rounded-full object-cover border-2 border-primary" />
                <span className="text-2xl font-extrabold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Miau Miau</span>
              </div>
              <p className="text-sm opacity-80 text-center md:text-left">
                Arena premium para gatitos felices 🐾
              </p>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.contact")}</h4>
              <a
                href="https://wa.me/521234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                📱 {t("footer.whatsapp")}
              </a>
            </div>

            {/* Social */}
            <div className="text-center md:text-left">
              <h4 className="font-bold mb-3 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{t("footer.followUs")}</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">📸 Instagram</a>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">📘 Facebook</a>
                <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">🎵 TikTok</a>
              </div>
            </div>
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
