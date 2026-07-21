/**
 * Action outcome store — closes Norman's gulf of evaluation after dock commits.
 * Screens publish outcomes; stage head / rail can subscribe without coupling to
 * toast (toasts remain for transient alerts; outcomes are durable until cleared
 * or replaced).
 *
 *   const publish = usePublishOutcome();
 *   publish({ status: "success", label: "Project saved" });
 *   const outcome = useActionOutcome();
 */
import { useEffect, useState } from "react";
import { CAPACITY } from "./tokens.js";

export type OutcomeStatus = "pending" | "success" | "error";

export interface ActionOutcome {
  id: number;
  status: OutcomeStatus;
  label: string;
  detail?: string;
  at: number;
}

let outcomes: ActionOutcome[] = [];
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function publishOutcome(
  o: Omit<ActionOutcome, "id" | "at"> & { at?: number },
): ActionOutcome {
  const row: ActionOutcome = {
    ...o,
    id: ++seq,
    at: o.at ?? Date.now(),
  };
  outcomes = [row, ...outcomes].slice(0, CAPACITY.workingMemoryChunks);
  emit();
  return row;
}

export function clearOutcome(id?: number): void {
  outcomes = id == null ? [] : outcomes.filter((x) => x.id !== id);
  emit();
}

/** Test-only. */
export function resetOutcomes(): void {
  outcomes = [];
  seq = 0;
  emit();
}

export function useActionOutcome(): ActionOutcome | null {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((x) => x + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, []);
  return outcomes[0] ?? null;
}

export function useActionOutcomes(): ActionOutcome[] {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((x) => x + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, []);
  return outcomes;
}

/** Convenience for event handlers — stable publish function. */
export function usePublishOutcome(): typeof publishOutcome {
  return publishOutcome;
}
