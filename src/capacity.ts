/**
 * Capacity enforcement helpers (Cowan / CAPACITY tokens).
 * Primitives call {@link enforceCapacity} to trim and optionally warn.
 */
import { CAPACITY } from "./tokens.js";
import { logUxEvent } from "./uxEvents.js";

export type CapacityChannel =
  | "kpi"
  | "dock"
  | "loops"
  | "toast"
  | "objectives"
  | "outcomes"
  | "alternatives";

const CAP_FOR: Record<CapacityChannel, number> = {
  kpi: CAPACITY.kpiStrip,
  dock: CAPACITY.dockVisibleActions,
  loops: CAPACITY.openLoops,
  toast: CAPACITY.toastStack,
  objectives: CAPACITY.railObjectives,
  outcomes: CAPACITY.workingMemoryChunks,
  alternatives: CAPACITY.decisionAlternatives,
};

export function capacityCap(channel: CapacityChannel): number {
  return CAP_FOR[channel];
}

/**
 * If `count` exceeds the channel cap, emit `ux.capacity_warn` and return the cap;
 * otherwise return `count`.
 */
export function assertCapacity(channel: CapacityChannel, count: number): number {
  const cap = CAP_FOR[channel];
  if (count > cap) {
    logUxEvent("ux.capacity_warn", { channel, count, cap });
  }
  return Math.min(count, cap);
}

/**
 * Slice `items` to the channel cap. Emits `ux.capacity_warn` when truncated.
 */
export function enforceCapacity<T>(channel: CapacityChannel, items: readonly T[]): T[] {
  const cap = CAP_FOR[channel];
  if (items.length > cap) {
    logUxEvent("ux.capacity_warn", { channel, count: items.length, cap });
    return items.slice(0, cap) as T[];
  }
  return items as T[];
}
