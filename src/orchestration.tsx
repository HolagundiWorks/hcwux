/**
 * AI / mission orchestration primitives — domain-agnostic anatomy for mission-first
 * surfaces (Framework principle 6). No product/domain nouns in the public API.
 *
 * Compose with AwarenessStrip · StatusDot · HealthGlassOrb · ActionDock.
 * Template: T10 (docs/hcw-kit/05-TEMPLATES.md).
 */
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { enforceCapacity } from "./capacity.js";
import { openDecision } from "./decisionAudit.js";
import { Surface } from "./Surface.js";
import { TRUST, TYPE_SCALE, colors, hexToRgba } from "./tokens.js";

/* ─── Mission ─────────────────────────────────────────────────────────── */

export function MissionHeader({
  title,
  status,
}: {
  /** One-sentence mission. */
  title: ReactNode;
  status?: ReactNode;
}) {
  return (
    <Box
      component="header"
      aria-label="Mission"
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 2,
        py: 1,
        borderBottom: `1px solid ${colors.borderSubtle}`,
      }}
    >
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontSize: TYPE_SCALE.subtitle,
          fontWeight: 600,
          color: colors.ink,
          textTransform: "none",
          letterSpacing: 0,
        }}
      >
        {title}
      </Typography>
      {status ? (
        <Box sx={{ flex: "0 0 auto", fontSize: TYPE_SCALE.caption, color: colors.textSecondary }}>
          {status}
        </Box>
      ) : null}
    </Box>
  );
}

/* ─── Objectives ──────────────────────────────────────────────────────── */

export type ObjectiveItem = { id: string; label: ReactNode; done?: boolean };

export function ObjectiveList({
  items,
  "aria-label": ariaLabel = "Objectives",
}: {
  items: ObjectiveItem[];
  "aria-label"?: string;
}) {
  const visible = enforceCapacity("objectives", items);
  if (visible.length === 0) return null;

  return (
    <Stack
      component="ol"
      spacing={0.5}
      aria-label={ariaLabel}
      sx={{ m: 0, pl: 2.5, py: 0.5 }}
    >
      {visible.map((item) => (
        <Box
          component="li"
          key={item.id}
          sx={{
            fontSize: TYPE_SCALE.body2,
            color: item.done ? colors.textSecondary : colors.ink,
            textDecoration: item.done ? "line-through" : "none",
          }}
        >
          {item.label}
        </Box>
      ))}
    </Stack>
  );
}

/* ─── Phase ───────────────────────────────────────────────────────────── */

export function PhaseStrip({
  phase,
  progress,
  eta,
}: {
  /** Current phase label (free string — product owns the enum). */
  phase: ReactNode;
  /** 0–1 fraction, or custom node. */
  progress?: number | ReactNode;
  eta?: ReactNode;
}) {
  const frac =
    typeof progress === "number" ? Math.max(0, Math.min(1, progress)) : null;

  return (
    <Box
      component="section"
      aria-label="Current phase"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        py: 1,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "baseline" }}>
        <Typography sx={{ fontSize: TYPE_SCALE.label, fontWeight: 700, color: colors.ink }}>
          {phase}
        </Typography>
        {eta ? (
          <Typography sx={{ fontSize: TYPE_SCALE.caption, color: colors.textSecondary }}>
            {eta}
          </Typography>
        ) : null}
      </Box>
      {frac != null ? (
        <Box
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(frac * 100)}
          sx={{
            height: 4,
            borderRadius: 0,
            backgroundColor: colors.borderSubtle,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${frac * 100}%`,
              height: "100%",
              backgroundColor: colors.accent,
            }}
          />
        </Box>
      ) : progress != null && typeof progress !== "number" ? (
        progress
      ) : null}
    </Box>
  );
}

/* ─── Confidence ──────────────────────────────────────────────────────── */

export type ConfidenceLevel = "low" | "medium" | "high";

const BAND_LABEL: Record<ConfidenceLevel, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

const BAND_COLOR: Record<ConfidenceLevel, string> = {
  low: colors.supportWarning,
  medium: colors.supportInfo,
  high: colors.supportSuccess,
};

export function ConfidenceBand({
  band,
  label,
}: {
  band: ConfidenceLevel;
  /** Override band word; never use false-precision % alone (TRUST). */
  label?: ReactNode;
}) {
  if (!TRUST.preferConfidenceBand && label == null) {
    /* still render band words — preferConfidenceBand is the grammar contract */
  }
  return (
    <Box
      component="span"
      role="status"
      aria-label={typeof label === "string" ? label : BAND_LABEL[band]}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        fontSize: TYPE_SCALE.caption,
        fontWeight: 600,
        color: colors.ink,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          borderRadius: 0,
          backgroundColor: BAND_COLOR[band],
        }}
      />
      {label ?? BAND_LABEL[band]}
    </Box>
  );
}

/* ─── Decision ────────────────────────────────────────────────────────── */

export type DecisionCardProps = {
  id: string;
  question: ReactNode;
  recommendation: ReactNode;
  /** ≤ {@link CAPACITY.decisionAlternatives} alternatives (enforced). */
  alternatives?: ReactNode[];
  impact?: ReactNode;
  timeToDecide?: ReactNode;
  /** Marks the recommended path visually. */
  recommended?: boolean;
  /** Called when the operator opens / focuses the decision (telemetry). */
  onOpen?: () => void;
};

export function DecisionCard({
  id,
  question,
  recommendation,
  alternatives = [],
  impact,
  timeToDecide,
  recommended = true,
  onOpen,
}: DecisionCardProps) {
  const alts = enforceCapacity("alternatives", alternatives);

  return (
    <Surface
      layer={recommended ? "glass" : "soft"}
      role="article"
      aria-label="Pending decision"
      data-decision-id={id}
      onFocus={onOpen}
      tabIndex={0}
      sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Typography sx={{ fontSize: TYPE_SCALE.body2, fontWeight: 700, color: colors.ink }}>
        {question}
      </Typography>
      <Box
        sx={{
          fontSize: TYPE_SCALE.body2,
          color: colors.ink,
          borderInlineStart: `3px solid ${colors.accent}`,
          pl: 1.25,
          backgroundColor: hexToRgba(colors.accent, 0.06),
          py: 0.75,
        }}
      >
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: TYPE_SCALE.micro,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: colors.textSecondary,
            mb: 0.25,
          }}
        >
          Recommendation
        </Typography>
        {recommendation}
      </Box>
      {alts.length > 0 ? (
        <Stack component="ul" spacing={0.25} sx={{ m: 0, pl: 2 }}>
          {alts.map((alt, i) => (
            <Box
              component="li"
              key={i}
              sx={{ fontSize: TYPE_SCALE.caption, color: colors.textSecondary }}
            >
              {alt}
            </Box>
          ))}
        </Stack>
      ) : null}
      {(impact || timeToDecide) && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            fontSize: TYPE_SCALE.caption,
            color: colors.textSecondary,
          }}
        >
          {impact ? <span>Impact: {impact}</span> : null}
          {timeToDecide ? <span>Decide by: {timeToDecide}</span> : null}
        </Box>
      )}
    </Surface>
  );
}

export function DecisionQueue({
  items,
  empty,
}: {
  items: DecisionCardProps[];
  empty?: ReactNode;
}) {
  if (items.length === 0) {
    return empty ? (
      <Box role="status" sx={{ fontSize: TYPE_SCALE.body2, color: colors.textSecondary, py: 1 }}>
        {empty}
      </Box>
    ) : null;
  }

  return (
    <Stack
      component="section"
      aria-label="Pending decisions"
      spacing={1.5}
      sx={{ py: 0.5 }}
    >
      {items.map((item) => (
        <DecisionCard
          key={item.id}
          {...item}
          onOpen={() => {
            openDecision(item.id, {
              question: typeof item.question === "string" ? item.question : undefined,
            });
            item.onOpen?.();
          }}
        />
      ))}
    </Stack>
  );
}

/* ─── Freeze ──────────────────────────────────────────────────────────── */

export type FrozenDecision = {
  id: string;
  label: ReactNode;
  value: ReactNode;
};

export function FrozenDecisionRow({ label, value }: Omit<FrozenDecision, "id">) {
  return (
    <Box
      component="tr"
      sx={{
        "& td": {
          py: 0.75,
          px: 1,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          fontSize: TYPE_SCALE.body2,
          color: colors.ink,
          verticalAlign: "top",
        },
      }}
    >
      <Box component="td" sx={{ fontWeight: 600, width: "40%", color: colors.textSecondary }}>
        {label}
      </Box>
      <Box component="td">
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box
            aria-hidden
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: colors.supportSuccess,
            }}
          />
          {value}
          <Typography
            component="span"
            sx={{
              fontSize: TYPE_SCALE.micro,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: colors.textSecondary,
            }}
          >
            Frozen
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function FreezeTable({
  items,
  caption = "Frozen decisions",
}: {
  items: FrozenDecision[];
  caption?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Box
      component="table"
      aria-label={caption}
      sx={{ width: "100%", borderCollapse: "collapse", my: 0.5 }}
    >
      <Box component="caption" sx={{ textAlign: "left", fontSize: TYPE_SCALE.label, fontWeight: 700, pb: 0.5, color: colors.ink }}>
        {caption}
      </Box>
      <Box component="tbody">
        {items.map((row) => (
          <FrozenDecisionRow key={row.id} label={row.label} value={row.value} />
        ))}
      </Box>
    </Box>
  );
}
