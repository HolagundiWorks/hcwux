/**
 * KitRoot — mounts the shared HCW theme for a portal.
 *
 * Wrap a portal's tree in this once and every themed surface inherits the brand
 * (colour, shape, surfaces, type). It supplies the theme *context* only and
 * injects no page-level background.
 *
 * `scheme` + `density` feed `createHcwTheme` when `theme` is omitted.
 * Export aliases: `KitRoot` (preferred) · `MuiRoot` (legacy name).
 */
import { StyledEngineProvider, ThemeProvider, type Theme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, type ReactNode } from "react";
import { aormsTheme, createAormsTheme } from "./theme.js";
import type { DensityName, SchemeName } from "./tokens.js";

export function KitRoot({
  children,
  theme,
  scheme,
  density,
}: {
  children: ReactNode;
  /** Full theme override — wins over `scheme` / `density`. */
  theme?: Theme;
  /** Colour scheme (light default; dark/highContrast are preview-grade). */
  scheme?: SchemeName;
  /** Control density — comfortable (default) or compact. */
  density?: DensityName;
}) {
  const resolved = useMemo(() => {
    if (theme) return theme;
    const s = scheme ?? "light";
    const d = density ?? "comfortable";
    if (s === "light" && d === "comfortable") return aormsTheme;
    return createAormsTheme({ scheme: s, density: d });
  }, [theme, scheme, density]);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={resolved}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

/** @deprecated Prefer {@link KitRoot}. */
export const MuiRoot = KitRoot;
export default KitRoot;
