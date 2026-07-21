/**
 * KitRoot — mounts the shared HCW theme for a portal.
 *
 * Wrap a portal's tree in this once and every themed surface inherits the brand
 * (colour, shape, surfaces, type). It supplies the theme *context* only and
 * injects no page-level background.
 *
 * `scheme` + `density` + `coga` feed `createHcwTheme` when `theme` is omitted.
 * Export aliases: `KitRoot` (preferred) · `MuiRoot` (legacy name).
 */
import { StyledEngineProvider, ThemeProvider, type Theme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, type ReactNode } from "react";
import { aormsTheme, createAormsTheme } from "./theme.js";
import type { CogaMode, DensityName, SchemeName } from "./tokens.js";

export function KitRoot({
  children,
  theme,
  scheme,
  density,
  coga,
}: {
  children: ReactNode;
  /** Full theme override — wins over `scheme` / `density` / `coga`. */
  theme?: Theme;
  /** Colour scheme (light default; dark/highContrast are preview-grade). */
  scheme?: SchemeName;
  /** Control density — comfortable (default) or compact. */
  density?: DensityName;
  /** COGA calm mode — larger targets + one type step (default: `"default"`). */
  coga?: CogaMode;
}) {
  const resolved = useMemo(() => {
    if (theme) return theme;
    const s = scheme ?? "light";
    const d = density ?? "comfortable";
    const c = coga ?? "default";
    if (s === "light" && d === "comfortable" && c === "default") return aormsTheme;
    return createAormsTheme({ scheme: s, density: d, coga: c });
  }, [theme, scheme, density, coga]);
  const cogaAttr = coga ?? "default";
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={resolved}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div data-hcw-coga={cogaAttr} style={{ display: "contents" }}>
            {children}
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

/** @deprecated Prefer {@link KitRoot}. */
export const MuiRoot = KitRoot;
export default KitRoot;
