import { describe, expect, it } from "vitest";
import { CHART_MARKERS } from "./charts.js";
import {
  BRAND_ACCENT_SHAPES,
  HEALTH_PICTOGRAM,
  ICON,
  ICON_SIZE,
  PICTOGRAM,
  STATUS_PICTOGRAM,
} from "./pictograms.js";
import { colors } from "./tokens.js";

describe("pictograms · icons contracts", () => {
  it("health pictogram encodes severity by shape", () => {
    expect(HEALTH_PICTOGRAM.stable.shape).toBe("circle");
    expect(HEALTH_PICTOGRAM.watch.shape).toBe("triangle");
    expect(HEALTH_PICTOGRAM.critical.shape).toBe("square");
    expect(colors[HEALTH_PICTOGRAM.critical.fillRole]).toBe(colors.supportError);
  });

  it("status pictogram is always a circle with sm/md sizes", () => {
    expect(STATUS_PICTOGRAM.shape).toBe("circle");
    expect(STATUS_PICTOGRAM.sizes.sm).toBe(8);
    expect(STATUS_PICTOGRAM.sizes.md).toBe(10);
  });

  it("ICON contract exposes slots, sizes, and 44px chrome hit", () => {
    expect(ICON.slots).toContain("dock");
    expect(ICON.slots).toContain("chrome");
    expect(ICON_SIZE.md).toBe(20);
    expect(ICON.chromeHit).toBe(44);
    expect(ICON.tones).toEqual(["default", "accent", "danger"]);
  });

  it("PICTOGRAM registry covers brand · health · status · chart · avatar", () => {
    expect(PICTOGRAM.brandAccent.shapes).toEqual(BRAND_ACCENT_SHAPES);
    expect(PICTOGRAM.chartMarkers).toBe(CHART_MARKERS);
    expect(PICTOGRAM.avatar.modes).toContain("initials");
  });
});
