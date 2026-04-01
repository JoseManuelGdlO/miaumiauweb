import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 paw-pattern">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/10">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">🐱</div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {isLogin ? t("auth.login") : t("auth.register")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("auth.name")}</Label>
                  <Input id="name" placeholder="María García" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("auth.phone")}</Label>
                  <Input id="phone" placeholder="+52 555 123 4567" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t("auth.address")}</Label>
                  <Input id="address" placeholder="Calle, Colonia, Ciudad, CP" className="rounded-xl" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" placeholder="michi@ejemplo.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full rounded-xl font-bold text-base py-5">
              {isLogin ? t("auth.login") : t("auth.register")}
            </Button>
          </form>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-primary hover:underline mt-4 font-semibold"
          >
            {isLogin ? t("auth.switchRegister") : t("auth.switchLogin")}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
