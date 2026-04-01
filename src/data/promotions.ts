export interface Promotion {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  discount: string;
  validUntil: string;
  icon: string;
  bgColor: string;
}

export const promotions: Promotion[] = [
  {
    id: "1",
    titleEs: "¡2x1 en Arena Premium!",
    titleEn: "Buy 1 Get 1 Free on Premium Litter!",
    descriptionEs: "Llévate dos bolsas de arena premium 10kg por el precio de una. ¡Solo por tiempo limitado!",
    descriptionEn: "Get two 10kg premium litter bags for the price of one. Limited time only!",
    discount: "2x1",
    validUntil: "2026-04-30",
    icon: "gift",
    bgColor: "from-primary to-accent",
  },
  {
    id: "2",
    titleEs: "Envío GRATIS en compras mayores a $300",
    titleEn: "FREE Shipping on orders over $300",
    descriptionEs: "Haz tu pedido mayor a $300 MXN y el envío corre por nuestra cuenta. ¡A todo México!",
    descriptionEn: "Place an order over $300 MXN and shipping is on us. Nationwide!",
    discount: "GRATIS",
    validUntil: "2026-05-15",
    icon: "truck",
    bgColor: "from-green-500 to-emerald-400",
  },
  {
    id: "3",
    titleEs: "Puntos DOBLES este mes",
    titleEn: "DOUBLE Points this month",
    descriptionEs: "Todas tus compras de abril acumulan el doble de puntos de lealtad. ¡Sube de nivel más rápido!",
    descriptionEn: "All April purchases earn double loyalty points. Level up faster!",
    discount: "x2",
    validUntil: "2026-04-30",
    icon: "star",
    bgColor: "from-yellow-500 to-amber-400",
  },
  {
    id: "4",
    titleEs: "Pack Nuevo Michi — 20% OFF",
    titleEn: "New Cat Pack — 20% OFF",
    descriptionEs: "Arena 10kg + Pala + Perlas aromatizantes. El pack perfecto para recibir a tu nuevo gatito.",
    descriptionEn: "10kg Litter + Scoop + Aromatic Pearls. The perfect pack to welcome your new kitty.",
    discount: "-20%",
    validUntil: "2026-06-01",
    icon: "cat",
    bgColor: "from-pink-500 to-rose-400",
  },
];
