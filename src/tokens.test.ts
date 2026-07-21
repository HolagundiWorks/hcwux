import { describe, expect, it } from "vitest";
import {
  BUTTON_RADIUS,
  DARK_RECIPES,
  DATA_VIZ,
  DATA_VIZ_CATEGORICAL,
  DENSITY,
  DIALOG_RADIUS,
  ELEVATION,
  HIGH_CONTRAST_RECIPES,
  LAYOUT,
  MOTION,
  RADIUS,
  SCHEMES,
  SPACING,
  STATUS_COLORS,
  TYPE_SCALE,
  chartSeriesColors,
  colors,
  densityFor,
  glassAccentWash,
  hexToRgba,
  liquidGlassButtonFor,
  recipesFor,
  tokens,
  underlineAccent,
} from "./tokens.js";
import { chromeIconSx, layoutSx } from "./chrome-sx.js";

describe("colour schemes", () => {
  it("every scheme carries every semantic role of the light scheme", () => {
    const roles = Object.keys(colors).sort();
    for (const [name, scheme] of Object.entries(SCHEMES)) {
      expect(Object.keys(scheme).sort(), `scheme ${name}`).toEqual(roles);
    }
  });

  it("light scheme IS the base colors object (backward compatibility)", () => {
    expect(SCHEMES.light).toBe(colors);
  });

  it("dark scheme lifts the accent for dark grounds", () => {
    expect(SCHEMES.dark.accent).not.toBe(colors.accent);
    expect(SCHEMES.dark.background).not.toBe(colors.background);
  });
});

describe("layout · spacing · type hierarchy (Carbon-inspired organisation)", () => {
  it("exposes a 12-column grid contract with 8px-aligned gutters", () => {
    expect(LAYOUT.columns).toBe(12);
    expect(LAYOUT.gutter).toBe(SPACING.md);
    expect(LAYOUT.margin).toBe(SPACING.md);
    expect(LAYOUT.railWidth + LAYOUT.dockClearance).toBeGreaterThan(LAYOUT.railWidth);
    expect(LAYOUT.railFraction + LAYOUT.stageFraction).toBeCloseTo(1);
  });

  it("spacing ladder includes Carbon mid-steps compact(12) and section(40)", () => {
    expect(SPACING.compact).toBe(12);
    expect(SPACING.section).toBe(40);
    expect(SPACING.sm).toBe(8);
    expect(SPACING.md).toBe(16);
  });

  it("type scale covers productive hierarchy steps", () => {
    expect(TYPE_SCALE.micro).toBeTruthy();
    expect(TYPE_SCALE.label).toBe("0.8125rem");
    expect(TYPE_SCALE.subtitle).toBe("1.25rem");
    expect(TYPE_SCALE.heading).toBe("1.75rem");
    expect(TYPE_SCALE.display).toBe("2.625rem");
  });

  it("token bundle and layoutSx recipes stay in sync with LAYOUT", () => {
    expect(tokens.LAYOUT).toBe(LAYOUT);
    expect(tokens.TYPE_SCALE).toBe(TYPE_SCALE);
    expect(tokens.DENSITY).toBe(DENSITY);
    expect(layoutSx.grid.gridTemplateColumns).toContain(String(LAYOUT.columns));
    expect(layoutSx.rail.width).toEqual({ xs: "100%", md: LAYOUT.railWidth });
  });

  it("DENSITY exposes productive touch/control targets", () => {
    expect(DENSITY.touchTarget).toBe(44);
    expect(DENSITY.controlCompact).toBe(38);
    expect(DENSITY.control).toBe(40);
    expect(chromeIconSx.width).toBe(DENSITY.touchTarget);
    expect(chromeIconSx.height).toBe(DENSITY.touchTarget);
  });

  it("densityFor resolves comfortable vs compact metrics", () => {
    const comfy = densityFor("comfortable");
    const compact = densityFor("compact");
    expect(comfy.control).toBe(DENSITY.control);
    expect(compact.control).toBeLessThan(comfy.control);
    expect(compact.dataGridRow).toBeLessThan(comfy.dataGridRow);
    expect(compact.input).toBe(32);
    expect(comfy.iconButton).toBe(DENSITY.controlCompact);
  });

  it("chartSeriesColors cycles the ordered categorical ladder", () => {
    expect(DATA_VIZ_CATEGORICAL[0]).toBe(DATA_VIZ.blue);
    expect(chartSeriesColors(0)).toEqual([]);
    expect(chartSeriesColors(3)).toEqual([
      DATA_VIZ.blue,
      DATA_VIZ.cyan,
      DATA_VIZ.green,
    ]);
    expect(chartSeriesColors(8)).toHaveLength(8);
    expect(chartSeriesColors(8)[7]).toBe(DATA_VIZ.blue);
  });

  it("token bundle exposes viz ramps", () => {
    expect(tokens.DATA_VIZ_SEQUENTIAL).toBeDefined();
    expect(tokens.DATA_VIZ_DIVERGING).toBeDefined();
    expect(tokens.DATA_VIZ_SEMANTIC.neutral).toBe(DATA_VIZ.gray);
  });
});

describe("accent helpers (scheme-aware)", () => {
  it("hexToRgba expands brand accent without baking a second literal", () => {
    expect(hexToRgba(colors.accent, 0.3)).toBe("rgba(255, 79, 24, 0.3)");
    expect(hexToRgba(SCHEMES.dark.accent, 0.2)).toBe("rgba(255, 92, 40, 0.2)");
    expect(hexToRgba(SCHEMES.highContrast.accent, 0.18)).toBe("rgba(201, 58, 0, 0.18)");
  });

  it("underlineAccent and glassAccentWash follow the given scheme accent", () => {
    expect(underlineAccent(colors.accent)).toContain(colors.accent);
    expect(underlineAccent(SCHEMES.dark.accent)).toContain(SCHEMES.dark.accent);
    expect(glassAccentWash(SCHEMES.highContrast.accent, 0.3)).toBe(
      hexToRgba(SCHEMES.highContrast.accent, 0.3),
    );
  });

  it("liquidGlassButtonFor embeds the scheme accent glow", () => {
    expect(liquidGlassButtonFor(colors.accent).boxShadow).toContain(
      hexToRgba(colors.accent, 0.07),
    );
    expect(liquidGlassButtonFor(SCHEMES.dark.accent).boxShadow).toContain(
      hexToRgba(SCHEMES.dark.accent, 0.07),
    );
  });
});

describe("recipesFor", () => {
  it("resolves the matching recipe set per scheme and defaults to light", () => {
    expect(recipesFor("dark")).toBe(DARK_RECIPES);
    expect(recipesFor("highContrast")).toBe(HIGH_CONTRAST_RECIPES);
    // Light recipes reference the standalone constants — spot-check identity.
    expect(recipesFor("light").GLASS_SURFACE.background).toContain("rgba(255, 255, 255");
  });

  it("high contrast carries no frosts or soft shadows", () => {
    expect(HIGH_CONTRAST_RECIPES.GLASS_SURFACE.backdropFilter).toBe("none");
    expect(HIGH_CONTRAST_RECIPES.GLASS_SURFACE.boxShadow).toBe("none");
  });

  it("all recipe sets expose the same surface keys", () => {
    const keys = Object.keys(recipesFor("light")).sort();
    expect(Object.keys(DARK_RECIPES).sort()).toEqual(keys);
    expect(Object.keys(HIGH_CONTRAST_RECIPES).sort()).toEqual(keys);
  });
});

describe("shape + scale contracts", () => {
  it("surfaces are square; only buttons/dialogs round", () => {
    expect(RADIUS).toBe(0);
    expect(BUTTON_RADIUS).toBe(4);
    expect(DIALOG_RADIUS).toBe(8);
  });

  it("elevation ladder is ordered flat → glass", () => {
    expect(ELEVATION[0]).toBe("none");
    expect(ELEVATION[1]).not.toBe("none");
    expect(ELEVATION[3]).not.toBe("none");
  });

  it("motion + type scales expose the documented steps", () => {
    expect(MOTION.duration.fast).toBe(130);
    expect(Object.keys(TYPE_SCALE)).toContain("micro");
    expect(STATUS_COLORS.green).toBeTruthy();
  });
});
