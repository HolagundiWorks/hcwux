/**
 * AwarenessStrip — Endsley situation-awareness ladder for the rail / stage head:
 *   state  → what is happening
 *   meaning → what it means
 *   next   → what happens next / what needs judgment
 *
 * Optional `loops` (Zeigarnik / goal-gradient): incomplete work, capped by
 * {@link CAPACITY.openLoops}. Renders nothing useful when all empty — calm idle.
 *
 *   <AwarenessStrip
 *     state="Orchestrating takeoff"
 *     meaning="3 of 7 sheets remaining"
 *     next="Waiting on you: approve scale"
 *     loops={[{ id: "1", label: "Draft invoice #442" }]}
 *   />
 */
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { enforceCapacity } from "./capacity.js";
import { TRUST, TYPE_SCALE, colors } from "./tokens.js";

export type OpenLoop = {
  id: string;
  label: string;
  /** Optional control rendered inline (link/button). */
  action?: ReactNode;
};

export function AwarenessStrip({
  state,
  meaning,
  next,
  loops = [],
  judgment = false,
}: {
  state?: ReactNode;
  meaning?: ReactNode;
  next?: ReactNode;
  loops?: OpenLoop[];
  /** Marks `next` as needs-judgment (Lee & See trust — interrupt-worthy). */
  judgment?: boolean;
}) {
  const visibleLoops = enforceCapacity("loops", loops);
  const hasAwareness = Boolean(state || meaning || next);
  const hasLoops = visibleLoops.length > 0;
  if (!hasAwareness && !hasLoops) return null;

  return (
    <Box
      component="section"
      aria-label="Situation awareness"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1.5,
        borderBottom: `1px solid ${colors.borderSubtle}`,
      }}
    >
      {state ? (
        <Typography sx={{ fontSize: TYPE_SCALE.label, fontWeight: 700, color: colors.ink }}>
          {state}
        </Typography>
      ) : null}
      {meaning ? (
        <Typography sx={{ fontSize: TYPE_SCALE.body2, color: colors.textSecondary }}>
          {meaning}
        </Typography>
      ) : null}
      {next ? (
        <Typography
          sx={{
            fontSize: TYPE_SCALE.body2,
            fontWeight: judgment ? 700 : 500,
            color: judgment ? colors.accent : colors.ink,
          }}
        >
          {judgment ? `${TRUST.judgmentNeedsLabel}: ` : null}
          {next}
        </Typography>
      ) : null}
      {hasLoops ? (
        <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
          {visibleLoops.map((loop) => (
            <Box
              component="li"
              key={loop.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                fontSize: TYPE_SCALE.caption,
                color: colors.textSecondary,
              }}
            >
              <span>{loop.label}</span>
              {loop.action}
            </Box>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

export default AwarenessStrip;
