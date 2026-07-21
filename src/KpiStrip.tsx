/**
 * KpiStrip — flat KPI row for stage/rail heads. Hard-capped at
 * {@link CAPACITY.kpiStrip} (Cowan). Prefer StatusDot for health, not colour chips.
 *
 *   <KpiStrip items={[
 *     { id: "open", label: "Open", value: "12" },
 *     { id: "due", label: "Due", value: "3" },
 *   ]} />
 */
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { enforceCapacity } from "./capacity.js";
import { TYPE_SCALE, colors } from "./tokens.js";

export type KpiItem = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  /** Optional click — keep rare; prefer dock for primary actions. */
  onClick?: () => void;
};

export function KpiStrip({
  items,
  "aria-label": ariaLabel = "Key measures",
}: {
  items: KpiItem[];
  "aria-label"?: string;
}) {
  const visible = enforceCapacity("kpi", items);
  if (visible.length === 0) return null;

  return (
    <Box
      component="ul"
      aria-label={ariaLabel}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {visible.map((item) => {
        const inner = (
          <>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: TYPE_SCALE.caption,
                color: colors.textSecondary,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: TYPE_SCALE.kpi,
                fontWeight: 600,
                color: colors.ink,
                lineHeight: 1.2,
              }}
            >
              {item.value}
            </Typography>
          </>
        );
        return (
          <Box
            component="li"
            key={item.id}
            sx={{ minWidth: 72 }}
          >
            {item.onClick ? (
              <Box
                component="button"
                type="button"
                onClick={item.onClick}
                sx={{
                  all: "unset",
                  cursor: "pointer",
                  display: "block",
                  "&:focus-visible": {
                    outline: `2px solid ${colors.accent}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {inner}
              </Box>
            ) : (
              inner
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default KpiStrip;
