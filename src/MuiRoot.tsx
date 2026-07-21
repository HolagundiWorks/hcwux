/**
 * MuiRoot — mounts the shared AORMS Material UI theme for a portal.
 *
 * Wrap a portal's tree in this once and every MUI surface inherits the brand
 * (colour, shape, surfaces, type). It supplies the theme *context* only and
 * injects no page-level background, so host-app CSS (including any frozen
 * `--cds-*` compatibility block) can still style non-MUI surfaces without
 * fighting ThemeProvider.
 *
 * `StyledEngineProvider injectFirst` puts MUI/emotion styles at the top of <head>
 * so app CSS still wins on the cascade. `LocalizationProvider` (dayjs) is mounted
 * here so MUI X Date Pickers work anywhere with no per-screen setup.
 *
 * Pass a `theme` to layer portal-specific overrides on top of the brand defaults.
 * `scheme` + `density` feed `createAormsTheme` when `theme` is omitted.
 */
import { StyledEngineProvider, ThemeProvider, type Theme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, type ReactNode } from "react";
import { aormsTheme, createAormsTheme } from "./theme.js";
import type { DensityName, SchemeName } from "./tokens.js";

export function MuiRoot({
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

export default MuiRoot;
