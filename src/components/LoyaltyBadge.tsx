import { useLanguage } from "@/contexts/LanguageContext";

interface LoyaltyBadgeProps {
  points: number;
  size?: "sm" | "lg";
}

const getLoyaltyLevel = (points: number) => {
  if (points >= 500) return { level: "vip", min: 500, next: null, color: "from-yellow-400 to-amber-500" };
  if (points >= 200) return { level: "michi", min: 200, next: 500, color: "from-primary to-accent" };
  return { level: "gatito", min: 0, next: 200, color: "from-pink-400 to-rose-400" };
};

const LoyaltyBadge = ({ points, size = "lg" }: LoyaltyBadgeProps) => {
  const { t } = useLanguage();
  const info = getLoyaltyLevel(points);
  const levelKey = `loyalty.${info.level}` as const;
  const levelName = t(levelKey as any);

  const progress = info.next ? ((points - info.min) / (info.next - info.min)) * 100 : 100;

  return (
    <div className={`bg-gradient-to-br ${info.color} rounded-2xl text-white shadow-lg ${size === "lg" ? "p-6 md:p-8" : "p-4"}`}>
      <div className="text-center">
        <p className={`font-extrabold ${size === "lg" ? "text-2xl md:text-3xl" : "text-lg"}`}>{levelName}</p>
        <p className={`${size === "lg" ? "text-5xl md:text-6xl" : "text-3xl"} font-black my-2`}>{points}</p>
        <p className="text-sm opacity-90">{t("profile.points")}</p>
        
        {info.next && (
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-80">
              {info.next - points} {t("profile.nextLevel")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyBadge;
