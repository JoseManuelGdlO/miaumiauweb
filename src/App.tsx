import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PublicSiteSettingsProvider } from "@/contexts/PublicSiteSettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { WhatsAppCityPickerProvider } from "@/components/WhatsAppCityPicker";
import MaintenancePlaceholder from "./pages/MaintenancePlaceholder";
import Promotions from "./pages/Promotions";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import QrLanding from "./pages/QrLanding";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { pathname } = useLocation();
  const showSiteChrome = pathname !== "/";

  return (
    <>
      {showSiteChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<MaintenancePlaceholder />} />
        <Route path="/QR" element={<QrLanding />} />
        <Route path="/qr" element={<QrLanding />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showSiteChrome && <Footer />}
      {showSiteChrome && <WhatsAppButton />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <PublicSiteSettingsProvider>
        <AuthProvider>
        <WhatsAppCityPickerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </WhatsAppCityPickerProvider>
        </AuthProvider>
        </PublicSiteSettingsProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
