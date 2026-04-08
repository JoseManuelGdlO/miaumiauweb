/**
 * WhatsApp por ciudad: solo dígitos (lada México 52 + 10 dígitos), sin + ni espacios.
 * Edita cada `phone` con el número real de atención en esa ciudad.
 */
export type WhatsAppCity = {
  id: string;
  nameEs: string;
  nameEn: string;
  phone: string;
};

export const WHATSAPP_CITIES: WhatsAppCity[] = [
  { id: "cdmx", nameEs: "Ciudad de México", nameEn: "Mexico City", phone: "521234567890" },
  { id: "guadalajara", nameEs: "Guadalajara", nameEn: "Guadalajara", phone: "521234567890" },
  { id: "monterrey", nameEs: "Monterrey", nameEn: "Monterrey", phone: "521234567890" },
  { id: "puebla", nameEs: "Puebla", nameEn: "Puebla", phone: "521234567890" },
  { id: "tijuana", nameEs: "Tijuana", nameEn: "Tijuana", phone: "521234567890" },
  { id: "merida", nameEs: "Mérida", nameEn: "Mérida", phone: "521234567890" },
  { id: "otro", nameEs: "Otra ciudad", nameEn: "Other city", phone: "521234567890" },
];
