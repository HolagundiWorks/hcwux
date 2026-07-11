# Notification Components

Implements framework §15 (Notification Policy). Interruption class — governed by the strictest rules in the system, because unearned interruptions are the primary source of the cognitive fatigue Orchestra exists to eliminate.

---

## The contract

Only five event classes may interrupt (framework-normative):

1. Strategic decisions (blocking Decision Cards)
2. Blockers (execution cannot proceed)
3. Conflicting requirements (incl. frozen-decision violations)
4. Failed validation
5. Mission completion

Everything else — progress, intermediate output, routine generation, minor improvements — updates the dashboard **silently**. Components below are listed from most to least interruptive; always use the least interruptive component that satisfies the event class.

---

## 1. Interrupt Dialog

### Purpose
Modal used **only** when the AI literally cannot proceed without the human: blocking decision, hard conflict, or mission completion sign-off.

### Anatomy
Centered dialog, 560px, elevation 3, scrim `rgba(0,0,0,.4)`. Content is an embedded Decision Card (same anatomy, same keyboard model) plus a plain-language first line stating *why this interrupts*: "Execution is paused until you choose."

### Behavior
- Dismissable? **Yes, always** (`Esc` = defer): the human outranks the modal. Deferring returns it to the queue and pauses affected work; the Status Bar shows "Paused — waiting on decision".
- One at a time. Multiple blockers queue; the dialog shows "1 of 2".
- Mission-complete variant is celebratory-calm: summary of objectives ✓, artifact count, duration — one `progress-accent` band, **no confetti**. Actions: "Review results" / "Close mission".

### Accessibility
- `role="alertdialog"`, labelled by the reason line; focus to primary action; announced assertively.

---

## 2. Escalation Banner

### Purpose
Non-modal, persistent strip for conditions that must not be missed but don't block *the user's* current activity: failed validation, new high risk that threatens an objective, confidence dropped to Low.

### Anatomy
Full-width strip pinned under the Top Bar (z `sticky`): `▲ Validation failed: 3 links broken · View → · Dismiss for now`. Severity tokens (`risk-high-subtle` bg, `risk-high` accent text/border).

### Behavior
- Max one visible; further escalations collapse into it ("+1 more").
- "Dismiss for now" = 30 minutes, then returns if unresolved. It cannot be dismissed permanently while the condition holds — resolution happens at the source, and the → link goes there.
- Never used for good news. Good news is a toast or just the dashboard updating.

---

## 3. Status Toast

### Purpose
The *least* interruptive surface: transient confirmation of user-initiated actions and the few silent-class events worth a whisper (artifact ready for requested review, deferred decision returning).

### Anatomy
Bottom-right, 360px max, radius `md`, elevation 2, icon + one line + optional single action. Auto-dismiss 6s, hover pauses. Stack ≤ 3, oldest collapses.

### Rules
- **Toasts never carry decisions or risks** — those have homes; a toast pointing at them is permitted only when user-initiated ("Your review was requested").
- Never toast routine AI progress ("Task 12 complete" is banned — that's the Progress Board updating quietly).
- In Execution mode ([Layout §5](../layout.md)) toasts are suppressed and queued; they flush as a single digest toast on mode exit.
- `role="status"` (polite). Actions are also reachable from the source component — a missed toast must never mean a lost capability.

---

## Routing table (normative)

| Event | Surface |
| --- | --- |
| Blocking decision | Interrupt Dialog |
| Non-blocking decision | Decision Queue + badge (silent) |
| Mission complete | Interrupt Dialog (complete variant) |
| Failed validation | Escalation Banner |
| New high risk (blocking) | Interrupt Dialog via Decision Card (accept/mitigate/pause) |
| New high risk (non-blocking) | Escalation Banner |
| Medium/low risk | Risk Board row (silent) |
| Confidence → Low | Escalation Banner |
| Task/phase progress | Dashboard update (silent) |
| Artifact created/updated | Artifact card freshness (silent) |
| User-initiated action confirmed | Status Toast |
| AI retrying transient errors | Activity Card state (silent) |

If an event isn't in this table, it does not notify. Add rows by proposal only.
