import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "521234567890";
const DEFAULT_MESSAGE = "¡Hola! Me gustaría hacer un pedido de arena Miau Miau 🐱";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

const WhatsAppButton = ({ message, className }: WhatsAppButtonProps) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 ${className || ""}`}
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </a>
  );
};

export default WhatsAppButton;

export const WhatsAppCTA = ({ productName }: { productName: string }) => {
  const message = `¡Hola! Me interesa el producto: ${productName}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-105 text-sm"
    >
      <MessageCircle className="h-4 w-4 fill-current" />
      Pedir por WhatsApp
    </a>
  );
};
