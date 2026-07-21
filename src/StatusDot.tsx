/**
 * StatusDot — status indicator: coloured mark + label in normal ink (never a
 * colour-filled chip). Preattentive shape (Treisman/Ware) reinforces hue so
 * urgency is never colour-only (WCAG 1.4.1).
 *
 *   <StatusDot color="green" label="Active" />
 *   <StatusDot color="red" label="Blocked" shape="square" />
 */
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { colors, STATUS_COLORS, STATUS_SHAPE, TYPE_SCALE } from "./tokens.js";

export type StatusShape = "circle" | "triangle" | "square";

export function StatusDot({
  color = "gray",
  label,
  size = "sm",
  shape = "circle",
}: {
  color?: string;
  label: ReactNode;
  size?: "sm" | "md";
  /** Preattentive channel — pair with severity (see STATUS_SHAPE). */
  shape?: StatusShape;
}) {
  const fill = STATUS_COLORS[color] ?? color ?? colors.textPrimary;
  const px = size === "md" ? 10 : 8;
  const markSx =
    shape === "square"
      ? { width: px, height: px, borderRadius: 0, backgroundColor: fill }
      : shape === "triangle"
        ? {
            width: 0,
            height: 0,
            borderLeft: `${px / 2}px solid transparent`,
            borderRight: `${px / 2}px solid transparent`,
            borderBottom: `${px}px solid ${fill}`,
            backgroundColor: "transparent",
          }
        : { width: px, height: px, borderRadius: "50%", backgroundColor: fill };

  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap", lineHeight: 1.2 }}
    >
      <Box component="span" aria-hidden sx={{ flex: "0 0 auto", ...markSx }} />
      <Box
        component="span"
        sx={{ fontSize: size === "md" ? TYPE_SCALE.body2 : TYPE_SCALE.caption, color: "text.primary" }}
      >
        {label}
      </Box>
    </Box>
  );
}

/** Map a severity keyword to the sanctioned preattentive shape. */
export function statusShapeFor(
  severity: keyof typeof STATUS_SHAPE,
): (typeof STATUS_SHAPE)[keyof typeof STATUS_SHAPE] {
  return STATUS_SHAPE[severity];
}

export default StatusDot;
