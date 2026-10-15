import { describe, expect, it } from "vitest";
import { mapActivePackage } from "./catalogPackages";

describe("active packages", () => {
  it("maps a published package and skips archived ones", () => {
    const base = "http://localhost:3000/api";
    expect(
      mapActivePackage(
        {
          id: 2,
          nombre: " COMBO PERLAS AROMATICAS ",
          descripcion: "1 bote\ny 1 costal",
          precio_final: "280.00",
          imagen_url: "https://cdn.example/combo.jpg",
          is_active: true,
        },
        base,
      ),
    ).toEqual({
      id: "PAQ-2",
      title: "COMBO PERLAS AROMATICAS",
      description: "1 bote y 1 costal",
      price: "$280.00 MXN",
      image: "https://cdn.example/combo.jpg",
      category: "paquete",
    });

    expect(mapActivePackage({ id: 9, nombre: "Archivado", is_active: false, precio_final: "10" }, base)).toBeNull();
  });
});
