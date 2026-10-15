import { describe, expect, it } from "vitest";
import { isCurrentPromotion } from "./promotions";

const now = Date.parse("2026-10-15T18:00:00.000Z");

describe("current promotions", () => {
  it("keeps a promotion that is in force and drops archived or expired ones", () => {
    expect(
      isCurrentPromotion(
        { nombre: "Vigente", fecha_inicio: "2026-10-01T00:00:00.000Z", fecha_fin: "2026-10-31T00:00:00.000Z" },
        now,
      ),
    ).toBe(true);
    expect(isCurrentPromotion({ nombre: "Archivada", baja_logica: true }, now)).toBe(false);
    expect(
      isCurrentPromotion(
        { nombre: "Vencida", fecha_inicio: "2026-01-01T00:00:00.000Z", fecha_fin: "2026-02-01T00:00:00.000Z" },
        now,
      ),
    ).toBe(false);
  });
});
