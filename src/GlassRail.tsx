/**
 * GlassRail — rail · stage spatial shell for portals / auth / account surfaces.
 * App chrome (ribbon workspace) keeps its own RailLayout; this is the kit
 * primitive for layouts that share the same spatial model.
 *
 *   glass="frost"  — default Layer 3 frosted glass (portals, auth)
 *   glass="clear"  — clear glass so atmosphere/canvas shows through (marketing-like)
 *
 * Widths/paddings come from {@link LAYOUT} — do not hardcode shell geometry.
 */
import { Box, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";
import { Surface } from "./Surface.js";
import { colors, LAYOUT } from "./tokens.js";

export function GlassRail({
  rail,
  children,
  railAriaLabel = "Navigation",
  mainId = "esti-main",
  glass = "frost",
  sx,
  ...rest
}: {
  rail: ReactNode;
  children: ReactNode;
  railAriaLabel?: string;
  /** Landmark id for skip links. */
  mainId?: string;
  /** `frost` = GLASS_SURFACE · `clear` = CLEAR_GLASS_SURFACE (see HCW-UI-KIT.md). */
  glass?: "frost" | "clear";
} & Omit<BoxProps, "children">) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        minHeight: "100vh",
        backgroundColor: colors.background,
        flexDirection: { xs: "column", md: "row" },
        ...sx,
      }}
      {...rest}
    >
      <Surface
        layer={glass === "clear" ? "clearGlass" : "glass"}
        component="aside"
        aria-label={railAriaLabel}
        sx={{
          flex: { xs: "none", md: `0 0 ${LAYOUT.railWidth}px` },
          width: { xs: "100%", md: LAYOUT.railWidth },
          minHeight: { xs: 0, md: "100vh" },
          position: { xs: "static", md: "sticky" },
          top: 0,
          alignSelf: { md: "flex-start" },
          p: LAYOUT.railPadding,
          borderInlineEnd: { md: `1px solid ${colors.borderSubtle}` },
          borderBottom: { xs: `1px solid ${colors.borderSubtle}`, md: "none" },
        }}
      >
        {rail}
      </Surface>
      <Box
        component="main"
        id={mainId}
        tabIndex={-1}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: { xs: "auto", md: "100vh" },
          overflow: { xs: "visible", md: "auto" },
          p: { xs: LAYOUT.stagePaddingXs, md: LAYOUT.stagePaddingMd },
          pb: { xs: LAYOUT.stagePaddingBottomXs, md: LAYOUT.stagePaddingBottomMd },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
