/**
 * Toast — the ONE transient-feedback primitive (HCW: success via toast; error
 * toasts say what failed). Interruption budget from {@link INTERRUPTION} /
 * {@link CAPACITY} (Bailey/Iqbal): max concurrent stack, dedupe, error TTL.
 *
 *   pushToast({ kind: "success", title: "Invoice sent" });
 *   <ToastHost />   // once, near the app root
 */
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { INTERRUPTION, LAYOUT, Z_INDEX } from "./tokens.js";

export type ToastKind = "error" | "success" | "info" | "warning";
export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  subtitle?: string;
  /** Optional undo (Reason: slip recovery). */
  undoLabel?: string;
  onUndo?: () => void;
}

let toasts: Toast[] = [];
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

const recentKeys = new Map<string, number>();

function toastKey(t: Omit<Toast, "id">): string {
  return `${t.kind}\0${t.title}\0${t.subtitle ?? ""}`;
}

function ttlFor(kind: ToastKind, override?: number): number {
  if (override != null) return override;
  return kind === "error" ? INTERRUPTION.errorTtlMs : INTERRUPTION.defaultTtlMs;
}

export function pushToast(t: Omit<Toast, "id">, ttlMs?: number): void {
  const key = toastKey(t);
  const now = Date.now();
  const last = recentKeys.get(key);
  if (last != null && now - last < INTERRUPTION.dedupeMs) return;
  recentKeys.set(key, now);

  const toast = { ...t, id: ++seq };
  // Drop oldest ambient toasts when over capacity; errors keep priority by
  // trimming from the front (oldest) until under budget.
  toasts = [...toasts, toast];
  while (toasts.length > INTERRUPTION.maxConcurrentToasts) {
    const dropIdx = toasts.findIndex((x) => x.kind !== "error");
    toasts = toasts.filter((_, i) => i !== (dropIdx === -1 ? 0 : dropIdx));
  }
  emit();
  const ttl = ttlFor(t.kind, ttlMs);
  if (ttl > 0) setTimeout(() => dismissToast(toast.id), ttl);
}

export function dismissToast(id: number): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/** Test-only: clear all toasts + dedupe memory. */
export function resetToasts(): void {
  toasts = [];
  recentKeys.clear();
  emit();
}

/** Subscribe a component to the toast list. */
export function useToasts(): Toast[] {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((x) => x + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, []);
  return toasts;
}

/** Renders the global toast stack — fixed bottom-right, above dialogs. */
export function ToastHost() {
  const list = useToasts();
  const hasError = list.some((t) => t.kind === "error");
  return (
    <Box
      role="status"
      aria-live={hasError ? "assertive" : "polite"}
      aria-atomic="false"
      sx={{
        position: "fixed",
        right: LAYOUT.margin,
        bottom: LAYOUT.margin,
        zIndex: Z_INDEX.toast,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        maxWidth: 360,
      }}
    >
      {list.map((t) => (
        <Alert
          key={t.id}
          severity={t.kind}
          variant="filled"
          onClose={() => dismissToast(t.id)}
          action={
            t.onUndo ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  t.onUndo?.();
                  dismissToast(t.id);
                }}
              >
                {t.undoLabel ?? "Undo"}
              </Button>
            ) : undefined
          }
        >
          <AlertTitle>{t.title}</AlertTitle>
          {t.subtitle}
        </Alert>
      ))}
    </Box>
  );
}
