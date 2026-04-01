import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import brandLogo from "@/assets/brand-logo.png";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = location.pathname === "/profile";

  const toggleLang = () => setLanguage(language === "es" ? "en" : "es");

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-2 px-4 flex items-center justify-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        <Truck className="h-4 w-4" />
        {language === "es" ? "¡Envíos a todo México! Pide por WhatsApp" : "Nationwide shipping! Order via WhatsApp"}
        <Truck className="h-4 w-4" />
      </div>

      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={brandLogo} alt="Miau Miau" className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow-md" />
            <span className="text-2xl font-extrabold text-primary" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Miau Miau
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-bold text-foreground hover:text-primary transition-colors text-sm uppercase tracking-wide">
              {t("nav.home")}
            </Link>
            <Link to="/promotions" className="font-bold text-foreground hover:text-primary transition-colors text-sm uppercase tracking-wide">
              {t("nav.promotions")}
            </Link>
            {isLoggedIn ? (
              <Link to="/profile" className="font-bold text-foreground hover:text-primary transition-colors text-sm uppercase tracking-wide">
                {t("nav.profile")}
              </Link>
            ) : (
              <Link to="/auth" className="font-bold text-foreground hover:text-primary transition-colors text-sm uppercase tracking-wide">
                {t("nav.login")}
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full border-2 border-border hover:border-primary" title="Switch language">
              <Globe className="h-5 w-5" />
            </Button>
            <span className="text-xs font-bold text-muted-foreground uppercase">{language}</span>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block font-bold text-foreground hover:text-primary uppercase text-sm tracking-wide">
              {t("nav.home")}
            </Link>
            <Link to="/promotions" onClick={() => setIsOpen(false)} className="block font-bold text-foreground hover:text-primary uppercase text-sm tracking-wide">
              {t("nav.promotions")}
            </Link>
            <Link to={isLoggedIn ? "/profile" : "/auth"} onClick={() => setIsOpen(false)} className="block font-bold text-foreground hover:text-primary uppercase text-sm tracking-wide">
              {isLoggedIn ? t("nav.profile") : t("nav.login")}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
