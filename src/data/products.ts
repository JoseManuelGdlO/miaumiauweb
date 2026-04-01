export interface Product {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: "arena" | "perlas" | "accesorio";
  image: string;
  price: string;
}

export const products: Product[] = [
  {
    id: "1",
    nameEs: "Arena Premium Miau Miau 10kg",
    nameEn: "Miau Miau Premium Litter 10kg",
    descriptionEs: "Arena aglomerante de alta absorción con control de olores. Ideal para hogares con uno o más gatitos.",
    descriptionEn: "High-absorption clumping litter with odor control. Ideal for homes with one or more cats.",
    category: "arena",
    image: "🏖️",
    price: "$189 MXN",
  },
  {
    id: "2",
    nameEs: "Arena Premium Miau Miau 5kg",
    nameEn: "Miau Miau Premium Litter 5kg",
    descriptionEs: "Presentación compacta perfecta para un solo gatito. Misma calidad premium.",
    descriptionEn: "Compact size perfect for a single cat. Same premium quality.",
    category: "arena",
    image: "🏝️",
    price: "$109 MXN",
  },
  {
    id: "3",
    nameEs: "Arena Miau Miau Lavanda 10kg",
    nameEn: "Miau Miau Lavender Litter 10kg",
    descriptionEs: "Arena con delicioso aroma a lavanda. Tu hogar siempre fresco y perfumado.",
    descriptionEn: "Litter with delightful lavender scent. Keep your home fresh and fragrant.",
    category: "arena",
    image: "💜",
    price: "$199 MXN",
  },
  {
    id: "4",
    nameEs: "Perlas Aromatizantes Fresh",
    nameEn: "Fresh Aromatic Pearls",
    descriptionEs: "Perlas que potencian el control de olores. Espolvorea sobre la arena para mayor frescura.",
    descriptionEn: "Pearls that enhance odor control. Sprinkle over litter for extra freshness.",
    category: "perlas",
    image: "✨",
    price: "$79 MXN",
  },
  {
    id: "5",
    nameEs: "Pala Premium para Arena",
    nameEn: "Premium Litter Scoop",
    descriptionEs: "Pala ergonómica con rejilla fina para limpieza fácil y rápida.",
    descriptionEn: "Ergonomic scoop with fine grid for easy and fast cleaning.",
    category: "accesorio",
    image: "🥄",
    price: "$49 MXN",
  },
  {
    id: "6",
    nameEs: "Arenero Cerrado Miau Miau",
    nameEn: "Miau Miau Enclosed Litter Box",
    descriptionEs: "Arenero con tapa y filtro de carbón. Máxima privacidad para tu michi.",
    descriptionEn: "Covered litter box with carbon filter. Maximum privacy for your cat.",
    category: "accesorio",
    image: "🏠",
    price: "$399 MXN",
  },
];
