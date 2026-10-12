import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { WhatsAppCTA } from "./WhatsAppButton";

interface PackageCarouselProps {
  packages: Product[];
}

const PackageCarousel = ({ packages }: PackageCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const go = (next: number) => {
    if (packages.length === 0) return;
    setIndex((next + packages.length) % packages.length);
    setTimerKey((key) => key + 1);
  };

  useEffect(() => {
    if (packages.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % packages.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, [packages.length, timerKey]);

  if (packages.length === 0) return null;

  const active = packages[index % packages.length];

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_6.5rem] md:gap-8">
      <div className="order-2 text-center md:order-1 md:text-left">
        <h3 className="text-3xl font-black text-foreground md:text-4xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {active.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{active.description}</p>
        <p className="mt-4 text-2xl font-black text-primary">{active.price}</p>
        <div className="mt-5 flex justify-center md:justify-start">
          <WhatsAppCTA productName={active.title} />
        </div>
        {packages.length > 1 && (
          <div className="mt-6 flex justify-center gap-2 md:justify-start">
            <button
              type="button"
              aria-label="Combo anterior"
              onClick={() => go(index - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Combo siguiente"
              onClick={() => go(index + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="order-1 flex h-[26rem] items-center justify-center md:order-2 md:h-[36rem]">
        <img
          src={active.image}
          alt={active.title}
          className="h-full w-full object-contain"
        />
      </div>

      {packages.length > 1 && (
        <div className="order-3 flex gap-3 overflow-x-auto md:h-[36rem] md:flex-col md:overflow-y-auto md:pr-1">
          {packages.map((item, itemIndex) => {
            const selected = item.id === active.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.title}
                aria-current={selected ? "true" : undefined}
                onClick={() => go(itemIndex)}
                className={`flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-card p-1 md:h-28 md:w-full ${selected ? "border-primary" : "border-border"}`}
              >
                <img src={item.image} alt="" className="h-full w-full object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PackageCarousel;
