import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import peekCat from "@/assets/peek-cat.png";

const EYES = [
  { x: 0.305, y: 0.724 },
  { x: 0.742, y: 0.729 },
] as const;

const InteractiveYarn = () => {
  const { language } = useLanguage();
  const imageRef = useRef<HTMLImageElement>(null);
  const pupilRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const place = (clientX: number, clientY: number) => {
      const image = imageRef.current;
      if (!image) return;
      const box = image.getBoundingClientRect();
      const maxX = box.width * 0.045;
      const maxY = box.height * 0.055;

      EYES.forEach((eye, index) => {
        const pupil = pupilRefs.current[index];
        if (!pupil) return;
        const cx = box.left + box.width * eye.x;
        const cy = box.top + box.height * eye.y;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const strength = Math.min(1, dist / 180);
        const nx = (dx / dist) * maxX * strength;
        const ny = (dy / dist) * maxY * strength;
        pupil.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
      });
    };

    const reset = () => {
      pupilRefs.current.forEach((pupil) => {
        if (pupil) pupil.style.transform = "translate(-50%, -50%)";
      });
    };

    if (media.matches) {
      reset();
      return;
    }

    const onMove = (event: PointerEvent) => place(event.clientX, event.clientY);
    window.addEventListener("pointermove", onMove);
    const onChange = () => {
      if (media.matches) reset();
    };
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("pointermove", onMove);
      media.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-0 w-44 translate-y-[12%] sm:w-72 sm:translate-y-[5%] lg:w-[26rem]"
      role="img"
      aria-label={language === "en" ? "Cat peeking from the corner" : "Gato asomándose desde la esquina"}
    >
      <img ref={imageRef} src={peekCat} alt="" className="block h-auto w-full" />
      {EYES.map((eye, index) => (
        <span
          key={eye.x}
          ref={(node) => {
            pupilRefs.current[index] = node;
          }}
          className="absolute h-[15%] w-[9%] rounded-full bg-[#161616]"
          style={{ left: `${eye.x * 100}%`, top: `${eye.y * 100}%`, transform: "translate(-50%, -50%)" }}
        />
      ))}
    </div>
  );
};

export default InteractiveYarn;
