import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoyaltyBadge from "@/components/LoyaltyBadge";
import { User, Calendar, ShoppingBag } from "lucide-react";

const mockUser = {
  name: "María García",
  email: "maria@ejemplo.com",
  phone: "+52 555 123 4567",
  address: "Col. Roma Norte, CDMX",
  memberSince: "2025-08-15",
  totalOrders: 12,
  points: 320,
};

const mockHistory = [
  { date: "2026-03-28", action: "Compra Arena Premium 10kg", amount: 40 },
  { date: "2026-03-15", action: "Compra Perlas Aromatizantes", amount: 15 },
  { date: "2026-03-01", action: "Bono puntos dobles", amount: 50 },
  { date: "2026-02-20", action: "Compra Arena Lavanda 10kg", amount: 45 },
  { date: "2026-02-05", action: "Compra Pala Premium", amount: 10 },
  { date: "2026-01-18", action: "Canje descuento", amount: -30 },
  { date: "2026-01-10", action: "Compra Arena Premium 10kg x2", amount: 80 },
];

const Profile = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen py-12 paw-pattern">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8">
          {t("profile.title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Loyalty Badge */}
          <div className="md:col-span-1">
            <LoyaltyBadge points={mockUser.points} />
          </div>

          {/* User Info */}
          <Card className="md:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                {mockUser.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">📧 {mockUser.email}</p>
              <p className="text-sm text-muted-foreground">📱 {mockUser.phone}</p>
              <p className="text-sm text-muted-foreground">📍 {mockUser.address}</p>
              <div className="flex gap-6 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t("profile.memberSince")}:</span>
                  <span className="font-bold text-foreground">
                    {new Date(mockUser.memberSince).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{t("profile.totalOrders")}:</span>
                  <span className="font-bold text-foreground">{mockUser.totalOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points History */}
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
                  <TableHead className="text-right">{t("profile.amount")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{item.action}</TableCell>
                    <TableCell className={`text-right font-bold ${item.amount > 0 ? "text-green-600" : "text-destructive"}`}>
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
