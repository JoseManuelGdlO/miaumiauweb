import { describe, expect, it } from "vitest";
import { formatCatalogPrice, mapCatalogProduct, productsFromCatalogCsv, resolveCatalogImage } from "./catalogProducts";

describe("catalog products", () => {
  it("formats the sale price in MXN", () => {
    expect(formatCatalogPrice("180.00")).toBe("$180.00 MXN");
    expect(formatCatalogPrice("180.00 MXN")).toBe("$180.00 MXN");
    expect(formatCatalogPrice(60)).toBe("$60.00 MXN");
  });

  it("reads products from the public city catalog and skips packages", () => {
    const csv = [
      "id,title,description,price,image_link",
      'PROD-1,COSTAL PLUS 10KG,"Aroma\na lavanda",180.00 MXN,https://cdn.example/plus.jpg',
      "PAQ-2,COMBO PERLAS,Promo,280.00 MXN,https://cdn.example/combo.jpg",
    ].join("\n");

    expect(productsFromCatalogCsv(csv)).toEqual([
      {
        id: "PROD-1",
        title: "COSTAL PLUS 10KG",
        description: "Aroma a lavanda",
        price: "$180.00 MXN",
        image: "https://cdn.example/plus.jpg",
        category: "producto",
      },
    ]);
  });

  it("resolves relative upload paths against the API origin", () => {
    expect(resolveCatalogImage("/uploads/productos/a.jpg", "http://localhost:3000/api")).toBe(
      "http://localhost:3000/uploads/productos/a.jpg",
    );
    expect(resolveCatalogImage("https://cdn.example/a.jpg", "http://localhost:3000/api")).toBe(
      "https://cdn.example/a.jpg",
    );
  });

  it("maps an API product into a catalog card", () => {
    expect(
      mapCatalogProduct(
        {
          id: 3,
          nombre: " COSTAL 20 KG ",
          descripcion: "Mayor\nrendimiento",
          precio: "200.00",
          imagen_url: "https://cdn.example/costal.jpg",
        },
        "http://localhost:3000/api",
      ),
    ).toEqual({
      id: "PROD-3",
      title: "COSTAL 20 KG",
      description: "Mayor rendimiento",
      price: "$200.00 MXN",
      image: "https://cdn.example/costal.jpg",
      category: "producto",
    });
  });
});
