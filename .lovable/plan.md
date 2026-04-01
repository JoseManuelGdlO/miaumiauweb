

## Miau Miau — Prototipo Frontend

Prototipo visual sin backend. Datos hardcodeados para demostración al cliente.

### Páginas

1. **Landing** — Hero estilo Ghibli, catálogo informativo (arena + accesorios), promociones destacadas, sección "¿Por qué Miau Miau?", botón flotante WhatsApp
2. **Promociones** — Tarjetas con promos vigentes estilo Buen Fin
3. **Login/Registro** — Formularios visuales (sin funcionalidad real)
4. **Perfil** — Dashboard con datos mock, puntos de lealtad (nivel "Michi Fiel"), historial simulado

### Diseño

- Paleta naranja cálido (#F97316 base) + blancos + tierra, inspirada en las imágenes de referencia
- Bordes redondeados, sombras suaves, huellas de gato decorativas
- Tipografía amigable (Nunito vía Google Fonts)
- Responsive (mobile-first)

### Bilingüe

- `LanguageContext` con toggle ES/EN en navbar
- `translations.ts` con todos los textos

### Estructura de archivos

- `src/contexts/LanguageContext.tsx`
- `src/data/translations.ts`
- `src/data/products.ts` — productos mock
- `src/data/promotions.ts` — promos mock
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/WhatsAppButton.tsx` — botón flotante
- `src/components/ProductCard.tsx`
- `src/components/PromoCard.tsx`
- `src/components/LoyaltyBadge.tsx`
- `src/pages/Index.tsx` — landing
- `src/pages/Promotions.tsx`
- `src/pages/Auth.tsx` — login/registro visual
- `src/pages/Profile.tsx` — perfil con puntos mock

### Orden de implementación

1. CSS variables (paleta naranja), Google Font, layout base
2. LanguageContext + translations
3. Navbar (logo, links, selector idioma) + Footer
4. Landing: hero, catálogo con ProductCards, promos destacadas
5. Página de promociones
6. WhatsApp flotante + CTAs en productos
7. Auth page (solo UI)
8. Profile page con puntos de lealtad mock

