import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWhatsAppCityOrder } from "@/components/WhatsAppCityPicker";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

const WhatsAppButton = ({ message, className }: WhatsAppButtonProps) => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();

  return (
    <button
      type="button"
      onClick={() => openOrder(message || t("whatsapp.defaultMessage"))}
      className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 ${className || ""}`}
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </button>
  );
};

export default WhatsAppButton;

export const WhatsAppCTA = ({ productName }: { productName: string }) => {
  const { t } = useLanguage();
  const { openOrder } = useWhatsAppCityOrder();
  const message = `${t("product.whatsapp")}${productName}`;

  return (
    <button
      type="button"
      onClick={() => openOrder(message)}
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-105 text-sm"
    >
      <MessageCircle className="h-4 w-4 fill-current" />
      {t("product.order")}
    </button>
  );
};
