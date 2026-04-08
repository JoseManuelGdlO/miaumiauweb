import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoyaltyBadge from "@/components/LoyaltyBadge";
import { User, Calendar, ShoppingBag, LogOut } from "lucide-react";
import { portalFetch, getApiBase } from "@/lib/portalApi";
import { Button } from "@/components/ui/button";

type MeResponse = {
  success: boolean;
  data: {
    cliente: {
      id: number;
      nombre_completo: string;
      telefono: string;
      email: string | null;
      puntos_lealtad: number;
      must_change_password: boolean;
      direccion_entrega: string | null;
      ciudad?: { id: number; nombre: string };
    };
  };
};

type PedidoRow = {
  id: number;
  numero_pedido: string;
  estado: string;
  fecha_pedido: string;
  total: string | number;
};

type Movimiento = {
  id: number;
  tipo: "ganado" | "gastado" | "ajuste";
  puntos: number;
  saldo_despues: number | null;
  referencia: string | null;
  created_at: string;
};

const estadoLabel = (estado: string, lang: string) => {
  const map: Record<string, string> = {
    pendiente: lang === "es" ? "Pendiente" : "Pending",
    confirmado: lang === "es" ? "Confirmado" : "Confirmed",
    en_preparacion: lang === "es" ? "En preparación" : "Preparing",
    en_camino: lang === "es" ? "En camino" : "On the way",
    entregado: lang === "es" ? "Entregado" : "Delivered",
    cancelado: lang === "es" ? "Cancelado" : "Cancelled",
    no_entregado: lang === "es" ? "No entregado" : "Not delivered",
  };
  return map[estado] || estado;
};

const tipoMovLabel = (tipo: string, lang: string) => {
  const map: Record<string, string> = {
    ganado: lang === "es" ? "Ganado" : "Earned",
    gastado: lang === "es" ? "Gastado" : "Spent",
    ajuste: lang === "es" ? "Ajuste" : "Adjustment",
  };
  return map[tipo] || tipo;
};

const Profile = () => {
  const { language, t } = useLanguage();
  const { logout, token } = useAuth();
  const [me, setMe] = useState<MeResponse["data"]["cliente"] | null>(null);
  const [pedidos, setPedidos] = useState<PedidoRow[]>([]);
  const [pedidosTotal, setPedidosTotal] = useState(0);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [resumen, setResumen] = useState<{ saldo_actual: number; total_ganado: number; total_gastado: number } | null>(
    null
  );
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getApiBase() || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoadError("");
      setLoading(true);
      try {
        const meJson = await portalFetch<MeResponse>("/portal/me");
        if (cancelled) return;
        const cliente = meJson.data.cliente;
        setMe(cliente);
        if (cliente.must_change_password) {
          setLoadError("must_change");
          return;
        }
        const [pedJson, movJson, resJson] = await Promise.all([
          portalFetch<{
            success: boolean;
            data: { pedidos: PedidoRow[]; pagination?: { total: number } };
          }>("/portal/pedidos?limit=50"),
          portalFetch<{ success: boolean; data: { movimientos: Movimiento[] } }>("/portal/puntos/movimientos?limit=50"),
          portalFetch<{
            success: boolean;
            data: { saldo_actual: number; total_ganado: number; total_gastado: number };
          }>("/portal/puntos/resumen"),
        ]);
        if (cancelled) return;
        setPedidos(pedJson.data.pedidos);
        setPedidosTotal(pedJson.data.pagination?.total ?? pedJson.data.pedidos.length);
        setMovimientos(movJson.data.movimientos);
        setResumen(resJson.data);
      } catch (e) {
        if (cancelled) return;
        const err = e as Error & { code?: string; status?: number };
        if (err.status === 403 && err.code === "MUST_CHANGE_PASSWORD") {
          setLoadError("must_change");
        } else {
          setLoadError(err.message || t("profile.loadError"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [token, t]);

  const points = resumen?.saldo_actual ?? me?.puntos_lealtad ?? 0;

  return (
    <div className="min-h-screen py-12 paw-pattern">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground text-center">{t("profile.title")}</h1>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            {t("nav.logout")}
          </Button>
        </div>

        {loading && <p className="text-center text-muted-foreground">{t("profile.loading")}</p>}

        {!loading && loadError === "must_change" && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="pt-6">
              <p className="text-destructive font-medium">{t("auth.changePasswordTitle")}</p>
              <Button className="mt-4 rounded-xl" onClick={() => (window.location.href = "/auth")}>
                {t("auth.login")}
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && loadError && loadError !== "must_change" && (
          <p className="text-center text-destructive mb-6">{loadError}</p>
        )}

        {me && !loadError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <LoyaltyBadge points={points} />
                {resumen && (
                  <Card className="mt-4 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{t("profile.pointsSummary")}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">{t("profile.pointsEarnedTotal")}:</span>{" "}
                        <span className="font-bold">{resumen.total_ganado}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">{t("profile.pointsSpentTotal")}:</span>{" "}
                        <span className="font-bold">{resumen.total_gastado}</span>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="md:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="h-5 w-5 text-primary" />
                    {me.nombre_completo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {me.email && <p className="text-sm text-muted-foreground">📧 {me.email}</p>}
                  <p className="text-sm text-muted-foreground">📱 {me.telefono}</p>
                  {me.direccion_entrega && (
                    <p className="text-sm text-muted-foreground">📍 {me.direccion_entrega}</p>
                  )}
                  <div className="flex gap-6 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{t("profile.totalOrders")}:</span>
                      <span className="font-bold text-foreground">{pedidosTotal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md mb-8">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t("profile.ordersTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pedidos.length === 0 ? (
                  <p className="text-muted-foreground">{t("profile.noOrders")}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("profile.orderNumber")}</TableHead>
                        <TableHead>{t("profile.date")}</TableHead>
                        <TableHead>{t("profile.orderStatus")}</TableHead>
                        <TableHead className="text-right">{t("profile.orderTotal")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.numero_pedido}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(p.fecha_pedido).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
                          </TableCell>
                          <TableCell>{estadoLabel(p.estado, language)}</TableCell>
                          <TableCell className="text-right font-bold">
                            {Number(p.total).toLocaleString(language === "es" ? "es-MX" : "en-US", {
                              style: "currency",
                              currency: "MXN",
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">{t("profile.history")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("profile.date")}</TableHead>
                      <TableHead>{t("profile.action")}</TableHead>
                      <TableHead>{t("profile.amount")}</TableHead>
                      <TableHead className="text-right">{t("profile.balanceAfter")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientos.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="text-muted-foreground">
                          {new Date(m.created_at).toLocaleString(language === "es" ? "es-MX" : "en-US")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {tipoMovLabel(m.tipo, language)}
                          {m.referencia ? ` · ${m.referencia}` : ""}
                        </TableCell>
                        <TableCell
                          className={`font-bold ${m.tipo === "gastado" ? "text-destructive" : "text-green-600"}`}
                        >
                          {m.tipo === "gastado" ? `-${m.puntos}` : `+${m.puntos}`}
                        </TableCell>
                        <TableCell className="text-right">{m.saldo_despues ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {movimientos.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-2">{t("profile.noMovements")}</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
