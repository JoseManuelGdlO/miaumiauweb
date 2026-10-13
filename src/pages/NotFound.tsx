import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import sleepCat from "@/assets/sleepcat2.jpg";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4">
      <PawPrint className="pointer-events-none absolute left-6 top-8 z-10 h-7 w-7 -rotate-12 text-primary/30 md:left-16 md:h-8 md:w-8" />
      <PawPrint className="pointer-events-none absolute bottom-8 right-6 z-10 h-7 w-7 rotate-[18deg] text-primary/30 md:right-16 md:h-8 md:w-8" />
      <img
        src={sleepCat}
        alt=""
        className="pointer-events-none absolute -bottom-14 left-1/2 z-0 h-auto w-full max-w-xl -translate-x-1/2 object-contain md:max-w-2xl"
      />
      <div className="relative z-10 flex flex-col items-center pt-4 text-center md:pt-8">
        <h1
          className="text-9xl font-black leading-none text-foreground sm:text-[10rem] md:text-[12rem] lg:text-[14rem]"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          404
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">{t("notFound.message")}</p>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-primary" />
        <Button asChild size="lg" className="mt-8 rounded-full px-8 font-bold">
          <Link to="/">{t("promos.goHome")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
