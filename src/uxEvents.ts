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

/** Test-only — clears the sink. */
export function resetUxEventSink(): void {
  sink = null;
}
