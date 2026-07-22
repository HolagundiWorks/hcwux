/**
 * KitRoot — mounts the shared HCW theme for a portal.
 *
 * Wrap a portal's tree in this once and every themed surface inherits the brand
 * (colour, shape, surfaces, type). It supplies the theme *context* only and
 * injects no page-level background.
 *
 * `scheme` + `density` + `coga` + `direction` feed `createHcwTheme` when `theme`
 * is omitted. Export aliases: `KitRoot` (preferred) · `MuiRoot` (legacy name).
 *
 * RTL: set `direction="rtl"` and wrap with Emotion CacheProvider using
 * {@link createHcwRtlCacheOptions} (see docs/hcw-kit/13-ROADMAPS.md).
 */
import { StyledEngineProvider, ThemeProvider, type Theme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { aormsTheme, createAormsTheme } from "./theme.js";
import { DEFAULT_LOCALE, type TextDirection } from "./rtl.js";
import type { CogaMode, DensityName, SchemeName } from "./tokens.js";

export const HcwLocaleContext = createContext(DEFAULT_LOCALE);

export function useHcwLocale(): string {
  return useContext(HcwLocaleContext);
}

export function KitRoot({
  children,
  theme,
  scheme,
  density,
  coga,
  direction = "ltr",
  locale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  /** Full theme override — wins over scheme / density / coga / direction. */
  theme?: Theme;
  /** Colour scheme (light default; dark/highContrast are preview-grade). */
  scheme?: SchemeName;
  /** Control density — comfortable (default) or compact. */
  density?: DensityName;
  /** COGA calm mode — larger targets + one type step (default: `"default"`). */
  coga?: CogaMode;
  /** Text direction — sets `theme.direction` + `dir` on the kit wrapper. */
  direction?: TextDirection;
  /** BCP 47 locale for clock / consumer i18n (default `en-IN`). */
  locale?: string;
}) {
  const resolved = useMemo(() => {
    if (theme) return theme;
    const s = scheme ?? "light";
    const d = density ?? "comfortable";
    const c = coga ?? "default";
    if (s === "light" && d === "comfortable" && c === "default" && direction === "ltr") {
      return aormsTheme;
    }
    return createAormsTheme({ scheme: s, density: d, coga: c, direction });
  }, [theme, scheme, density, coga, direction]);
  const cogaAttr = coga ?? "default";
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={resolved}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <HcwLocaleContext.Provider value={locale}>
            <div
              data-hcw-coga={cogaAttr}
              data-hcw-direction={direction}
              dir={direction}
              lang={locale}
              style={{ display: "contents" }}
            >
              {children}
            </div>
          </HcwLocaleContext.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

/** @deprecated Prefer {@link KitRoot}. */
export const MuiRoot = KitRoot;
export default KitRoot;
