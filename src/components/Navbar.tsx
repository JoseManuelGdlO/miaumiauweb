import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import brandLogo from "@/assets/brand-logo.png";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = location.pathname === "/profile";

  const toggleLang = () => setLanguage(language === "es" ? "en" : "es");

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={brandLogo} alt="Miau Miau" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl font-extrabold text-primary">Miau Miau</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-semibold text-foreground hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link to="/promotions" className="font-semibold text-foreground hover:text-primary transition-colors">
            {t("nav.promotions")}
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="font-semibold text-foreground hover:text-primary transition-colors">
              {t("nav.profile")}
            </Link>
          ) : (
            <Link to="/auth" className="font-semibold text-foreground hover:text-primary transition-colors">
              {t("nav.login")}
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleLang} className="rounded-full" title="Switch language">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Language</span>
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
          <Link to="/" onClick={() => setIsOpen(false)} className="block font-semibold text-foreground hover:text-primary">
            {t("nav.home")}
          </Link>
          <Link to="/promotions" onClick={() => setIsOpen(false)} className="block font-semibold text-foreground hover:text-primary">
            {t("nav.promotions")}
          </Link>
          <Link to={isLoggedIn ? "/profile" : "/auth"} onClick={() => setIsOpen(false)} className="block font-semibold text-foreground hover:text-primary">
            {isLoggedIn ? t("nav.profile") : t("nav.login")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
