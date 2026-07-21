/**
 * UX KPI event bus — sink-agnostic telemetry for the HCW instrument
 * (docs/esti/HCW-UX-KPI-INSTRUMENT.md). Kit emits; consumers attach analytics.
 *
 *   setUxEventSink((name, payload) => analytics.track(name, payload));
 *   logUxEvent("ux.dock", { zone: "right", actionId: "save" });
 */

export type UxEventName =
  | "ux.orient"
  | "ux.interrupt"
  | "ux.dock"
  | "ux.capacity_warn"
  | "ux.decision"
  | "ux.outcome"
  | "ux.a11y_gate"
  | "ux.mission";

export type UxEventPayload = Record<string, unknown>;
export type UxEventSink = (name: UxEventName, payload: UxEventPayload) => void;

let sink: UxEventSink | null = null;

/** Attach (or clear) the product telemetry sink. Default is no-op. */
export function setUxEventSink(next: UxEventSink | null): void {
  sink = next;
}

/** Emit a structured UX event. No-op when no sink is set. */
export function logUxEvent(name: UxEventName, payload: UxEventPayload = {}): void {
  sink?.(name, payload);
}

/** Typed helpers for the KPI instrument vocabulary. */

export function logOrient(surfaceId: string, msToFourAnswers?: number): void {
  logUxEvent("ux.orient", {
    surfaceId,
    ...(msToFourAnswers != null ? { msToFourAnswers } : {}),
  });
}

export function logDecision(
  id: string,
  state: "pending" | "frozen" | "rejected",
  msOpen?: number,
): void {
  logUxEvent("ux.decision", {
    id,
    state,
    ...(msOpen != null ? { msOpen } : {}),
  });
}

export function logMission(id: string, state: "active" | "done" | "failed"): void {
  logUxEvent("ux.mission", { id, state });
}

export function logInterrupt(
  kind: "judgment" | "blocker" | "error" | "ambient",
  accepted: boolean,
): void {
  logUxEvent("ux.interrupt", { kind, accepted });
}

/** Test-only — clears the sink. */
export function resetUxEventSink(): void {
  sink = null;
}
