import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApiBase } from "@/lib/portalApi";

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login, changePassword } = useAuth();
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [numeroPedido, setNumeroPedido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [currentForChange, setCurrentForChange] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!getApiBase()) {
      setError(t("auth.apiMissing"));
      return;
    }
    setLoading(true);
    try {
      const { mustChangePassword } = await login(telefono, password, numeroPedido);
      if (mustChangePassword) {
        setCurrentForChange(password);
        setShowChangeModal(true);
        setLoading(false);
        return;
      }
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.errorLogin"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (newPass.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (newPass !== confirmPass) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentForChange, newPass);
      setShowChangeModal(false);
      setNewPass("");
      setConfirmPass("");
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.errorChange"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 paw-pattern">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="text-5xl mb-2">🐱</div>
          <CardTitle className="text-2xl font-extrabold text-foreground">{t("auth.login")}</CardTitle>
          <p className="text-sm text-muted-foreground text-left leading-relaxed">{t("auth.whatsappOnly")}</p>
          <div className="text-left text-sm bg-muted/50 rounded-xl p-3 space-y-1 border border-border">
            <p className="font-bold text-foreground">{t("auth.firstTimeTitle")}</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>{t("auth.firstTimeStep1")}</li>
              <li>{t("auth.firstTimeStep2")}</li>
              <li>{t("auth.firstTimeStep3")}</li>
            </ol>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="10 dígitos"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderNum">{t("auth.orderNumber")}</Label>
              <Input
                id="orderNum"
                type="text"
                autoComplete="off"
                value={numeroPedido}
                onChange={(e) => setNumeroPedido(e.target.value)}
                placeholder={t("auth.orderNumberPlaceholder")}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">{t("auth.orderNumberHint")}</p>
            </div>
            {error && !showChangeModal && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold text-base py-5">
              {loading ? t("auth.loggingIn") : t("auth.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showChangeModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t("auth.changePasswordTitle")}</DialogTitle>
            <DialogDescription>{t("auth.changePasswordHint")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="newp">{t("auth.newPassword")}</Label>
              <Input
                id="newp"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="rounded-xl"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conf">{t("auth.confirmPassword")}</Label>
              <Input
                id="conf"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="rounded-xl"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword} disabled={loading} className="w-full rounded-xl">
              {loading ? "…" : t("auth.savePassword")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
