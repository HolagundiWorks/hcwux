import { Paper, Skeleton, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { TYPE_SCALE, colors } from "./tokens.js";

/**
 * DataState — uniform loading / empty handling (HCW "never a blank stage").
 * Empty state keeps title · description · action in one contiguous cluster
 * (Mayer spatial contiguity) — the action sits with the void, not only in the dock.
 */
export function DataState({
  loading,
  isEmpty,
  empty,
  columnCount = 4,
  skeleton,
  children,
}: {
  loading: boolean;
  isEmpty: boolean;
  /** Empty-state copy + optional action (one sentence + one action — Cowan/Miller). */
  empty: { title: string; description?: string; action?: ReactNode };
  columnCount?: number;
  skeleton?: ReactNode;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <>
        {skeleton ?? (
          <Stack spacing={0.5}>
            {Array.from({ length: 5 }).map((_, row) => (
              <Stack key={row} direction="row" spacing={1}>
                {Array.from({ length: columnCount }).map((__, col) => (
                  <Skeleton
                    key={col}
                    variant="rectangular"
                    height={row === 0 ? 40 : 32}
                    sx={{ flex: 1 }}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        )}
      </>
    );
  }
  if (isEmpty) {
    return (
      <Paper
        sx={{
          p: 3,
          maxWidth: 480,
        }}
        role="status"
      >
        <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <h3 style={{ margin: 0, fontSize: TYPE_SCALE.subtitle, fontWeight: 600, color: colors.ink }}>
            {empty.title}
          </h3>
          {empty.description ? (
            <p style={{ margin: 0, fontSize: TYPE_SCALE.body2, color: colors.textSecondary }}>
              {empty.description}
            </p>
          ) : null}
          {empty.action}
        </Stack>
      </Paper>
    );
  }
  return <>{children}</>;
}

export default DataState;
