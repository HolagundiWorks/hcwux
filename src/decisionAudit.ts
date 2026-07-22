/**
 * Decision / freeze audit — explainability contract (evaluation V5 kit half).
 * Kit keeps a session ring + emits `ux.audit`; product attaches
 * {@link setDecisionAuditSink} to persist for 6+ month reconstruction.
 *
 *   setDecisionAuditSink((row) => api.post("/ux/audit", row));
 *   recordDecisionAudit({ decisionId, action: "frozen", reason, chosen });
 */

import { logDecision, logUxEvent } from "./uxEvents.js";

export type DecisionAuditAction = "opened" | "frozen" | "rejected" | "revised";

export type DecisionAuditRecord = {
  id: string;
  decisionId: string;
  action: DecisionAuditAction;
  at: number;
  question?: string;
  recommendation?: string;
  chosen?: string;
  reason?: string;
  actorId?: string;
  surfaceId?: string;
  /** Free-form product fields (keep JSON-serialisable). */
  meta?: Record<string, unknown>;
};

export type DecisionAuditSink = (record: DecisionAuditRecord) => void;

const SESSION_CAP = 200;
let seq = 0;
let session: DecisionAuditRecord[] = [];
let sink: DecisionAuditSink | null = null;

/** Product persistence (DB / analytics). Session ring still fills without a sink. */
export function setDecisionAuditSink(next: DecisionAuditSink | null): void {
  sink = next;
}

export function recordDecisionAudit(
  input: Omit<DecisionAuditRecord, "id" | "at"> & { at?: number; id?: string },
): DecisionAuditRecord {
  const row: DecisionAuditRecord = {
    ...input,
    id: input.id ?? `audit-${++seq}`,
    at: input.at ?? Date.now(),
  };
  session = [...session, row].slice(-SESSION_CAP);
  sink?.(row);
  logUxEvent("ux.audit", {
    decisionId: row.decisionId,
    action: row.action,
    at: row.at,
    surfaceId: row.surfaceId,
  });
  return row;
}

/** Convenience — freeze with reason (commercial / judgment trail). */
export function recordFreezeAudit(
  decisionId: string,
  fields: Omit<DecisionAuditRecord, "id" | "at" | "decisionId" | "action"> = {},
): DecisionAuditRecord {
  return recordDecisionAudit({ decisionId, action: "frozen", ...fields });
}

/**
 * Freeze a decision end-to-end: KPI `ux.decision` frozen + durable audit row.
 * Prefer this at dock RIGHT commit over calling the two APIs separately.
 */
export function freezeDecision(
  decisionId: string,
  fields: Omit<DecisionAuditRecord, "id" | "at" | "decisionId" | "action"> & {
    msOpen?: number;
  } = {},
): DecisionAuditRecord {
  const { msOpen, ...auditFields } = fields;
  logDecision(decisionId, "frozen", msOpen);
  return recordFreezeAudit(decisionId, auditFields);
}

/** Open / focus a pending decision (KPI + audit). */
export function openDecision(
  decisionId: string,
  fields: Omit<DecisionAuditRecord, "id" | "at" | "decisionId" | "action"> = {},
): DecisionAuditRecord {
  logDecision(decisionId, "pending");
  return recordDecisionAudit({ decisionId, action: "opened", ...fields });
}

export function listSessionDecisionAudits(): readonly DecisionAuditRecord[] {
  return session;
}

export function exportSessionDecisionAudits(): DecisionAuditRecord[] {
  return session.map((r) => ({ ...r, meta: r.meta ? { ...r.meta } : undefined }));
}

/** Test-only. */
export function resetDecisionAudit(): void {
  session = [];
  seq = 0;
  sink = null;
}
