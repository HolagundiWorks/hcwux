/**
 * Text direction + locale helpers for RTL-ready chrome (roadmap D15 kit half).
 * Product string catalogs / i18n frameworks remain consumer programmes.
 */
export type TextDirection = "ltr" | "rtl";

/** Default clock / date locale when a product does not inject one. */
export const DEFAULT_LOCALE = "en-IN";

/**
 * Options for Emotion `createCache` under RTL. Pass stylis plugins from the app:
 *
 *   import createCache from "@emotion/cache";
 *   import { CacheProvider } from "@emotion/react";
 *   import { prefixer } from "stylis";
 *   import rtlPlugin from "stylis-plugin-rtl";
 *   import { createHcwRtlCacheOptions, KitRoot } from "@hcw/ui-kit";
 *
 *   const cache = createCache(
 *     createHcwRtlCacheOptions("rtl", [prefixer, rtlPlugin]),
 *   );
 *   <CacheProvider value={cache}>
 *     <KitRoot direction="rtl" locale="ar">…</KitRoot>
 *   </CacheProvider>
 */
export function createHcwRtlCacheOptions(
  direction: TextDirection = "rtl",
  stylisPlugins?: unknown[],
): { key: string; stylisPlugins?: unknown[] } {
  if (direction !== "rtl") return { key: "hcw-ltr" };
  return {
    key: "hcw-rtl",
    ...(stylisPlugins ? { stylisPlugins } : {}),
  };
}
