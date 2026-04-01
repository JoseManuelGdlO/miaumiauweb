export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: "producto" | "paquete";
}

export const products: Product[] = [
  {
    id: "PROD-1",
    title: "Costal Plus 10KG",
    description: "Presentación de 10 kg con aroma a lavanda. Combina rendimiento y frescura. Absorbe olores con un delicado aroma a lavanda. Es la única presentación con lavanda.",
    price: "$160.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/productos/d04dc1c9b522800732e3e4a0ba694cda.jpg",
    category: "producto",
  },
  {
    id: "PROD-2",
    title: "Bolsa 4KG",
    description: "Presentación de 4 kg, práctica y fácil de manejar. Ideal para espacios pequeños o reposiciones rápidas. Arcilla natural aglutinante, forma grumos firmes.",
    price: "$60.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/productos/e37ce3e7ab900c9ad46a5c55b296486b.jpg",
    category: "producto",
  },
  {
    id: "PROD-3",
    title: "Costal 20KG",
    description: "Presentación de 20 kg para mayor rendimiento y economía. Arcilla natural 100% aglutinante, grumos firmes. Ideal para hogares con varios gatos.",
    price: "$180.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/productos/0b9510949a1e90e59f33232ebc069b29.jpg",
    category: "producto",
  },
  {
    id: "PROD-4",
    title: "Perlas Aromatizantes",
    description: "Presentación de 1 kg. Complemento ideal para potenciar la frescura del arenero. Disponibles en Lavanda y Brisa Marina. Aroma agradable y duradero.",
    price: "$100.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/productos/b12830a9c00594e744259ed1569eb1c9.jpg",
    category: "producto",
  },
];

export const packages: Product[] = [
  {
    id: "PAQ-2",
    title: "Combo Perlas",
    description: "1 bote de 1kg de perlas (lavanda o brisa marina) + 1 costal de 20kg de arena súper aglutinante, 0 polvo.",
    price: "$240.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/a83c993cf89cc439feddbc36499bacda.jpg",
    category: "paquete",
  },
  {
    id: "PAQ-4",
    title: "Combo Cat",
    description: "Un costal y una bolsa por un precio especial.",
    price: "$350.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/27cca85a002c5ec8f0718567e6324fdf.jpg",
    category: "paquete",
  },
  {
    id: "PAQ-5",
    title: "Combo Clásico",
    description: "Dos costales de 20kg de arena al mejor precio.",
    price: "$300.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/5fdb938b32f29c76e08d4e236ab80c28.jpg",
    category: "paquete",
  },
  {
    id: "PAQ-6",
    title: "Galleta Cat",
    description: "Super Combo: 6 Bolsas de 4Kg + 2 Perlas Aromatizantes (Brisa marina y Lavanda Francesa).",
    price: "$520.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/1b1e660c96ea9914573de98fdb918c59.jpg",
    category: "paquete",
  },
  {
    id: "PAQ-7",
    title: "Mingo Cat",
    description: "20kg de arena súper aglutinante en presentación de 5 bolsas de 4kg.",
    price: "$225.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/81553af29ce1e047077fb667d91a1ddd.jpg",
    category: "paquete",
  },
  {
    id: "PAQ-8",
    title: "Combo Estrella Gatuno",
    description: "1 Costal de 20 kg + 1 frasco de perlas aromatizantes + 2 bolsas de 4kg a un súper precio.",
    price: "$330.00 MXN",
    image: "https://intelekia-miaumiau-back.vvggha.easypanel.host/uploads/paquetes/a4f0b5a6a2bb426943b2737b6aac0dc6.jpg",
    category: "paquete",
  },
];
