/**
 * Pictograms & icons — HCW-owned glyph grammar.
 *
 * The kit does **not** ship an icon font. Consumers inject glyphs into named
 * slots. Pictograms (brand, health, status, chart markers) are kit-owned shapes
 * that encode meaning without colour alone.
 */
import { CHART_MARKERS, type ChartMarker } from "./charts.js";
import type { HealthZoneState } from "./HealthGlassOrb.js";
import { colors } from "./tokens.js";

/** Injected icon slots — where consumer glyphs may appear. */
export const ICON_SLOTS = ["dock", "taskbar", "chrome", "inline", "breadcrumb"] as const;
export type IconSlot = (typeof ICON_SLOTS)[number];

/** Glyph size ladder (px) for injected icons. */
export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;
export type IconSizeName = keyof typeof ICON_SIZE;

/**
 * Icon contract — attributes every injected glyph must satisfy.
 *
 * | Attribute   | Values / rule                                      |
 * | ----------- | -------------------------------------------------- |
 * | `slot`      | dock · taskbar · chrome · inline · breadcrumb      |
 * | `size`      | sm 16 · md 20 · lg 24 · xl 32                      |
 * | `label`     | required accessible name when icon-only            |
 * | `tone`      | default · accent · danger (ink follows tone)       |
 * | chrome hit  | persistent chrome ≥ {@link ICON.chromeHit} (44px)  |
 */
export const ICON = {
  slots: ICON_SLOTS,
  size: ICON_SIZE,
  tones: ["default", "accent", "danger"] as const,
  chromeHit: 44,
} as const;

export type IconTone = (typeof ICON.tones)[number];

/** Brand accent pictogram shapes (BrandMark). */
export const BRAND_ACCENT_SHAPES = ["auto", "a", "square"] as const;
export type BrandAccentShape = (typeof BRAND_ACCENT_SHAPES)[number];

/** Health / zone severity pictogram — shape is primary, colour secondary. */
export const HEALTH_PICTOGRAM: Record<
  HealthZoneState,
  { shape: "circle" | "triangle" | "square"; fillRole: keyof typeof colors }
> = {
  stable: { shape: "circle", fillRole: "supportSuccess" },
  watch: { shape: "triangle", fillRole: "supportWarning" },
  friction: { shape: "triangle", fillRole: "supportWarning" },
  critical: { shape: "square", fillRole: "supportError" },
  inactive: { shape: "circle", fillRole: "textHelper" },
};

/** Status indicator pictogram — always a circle beside ink label. */
export const STATUS_PICTOGRAM = {
  shape: "circle" as const,
  sizes: { sm: 8, md: 10 } as const,
};

/**
 * Kit pictogram registry — catalog § Pictograms.
 * Chart markers re-export the ordered series ladder.
 */
export const PICTOGRAM = {
  brandAccent: {
    shapes: BRAND_ACCENT_SHAPES,
    sizes: ["sm", "md", "lg"] as const,
  },
  health: HEALTH_PICTOGRAM,
  status: STATUS_PICTOGRAM,
  chartMarkers: CHART_MARKERS,
  avatar: {
    sizes: ["xs", "sm", "md", "lg", "xl"] as const,
    modes: ["photo", "initials"] as const,
  },
} as const;

export type { ChartMarker };
