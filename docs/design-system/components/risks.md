# Risk Components

Implements framework §8 (Risk Dashboard). Awareness class: risks inform supervision; only *blocking* risks interrupt.

---

## 1. Risk Board

### Purpose
The AI's continuously-maintained register of threats to the mission, triaged High / Medium / Low, so the human audits exposure at a glance instead of discovering problems in scrollback.

### Anatomy

```
┌ Risks ──────────────────────────────── 1 high · 1 medium · 1 low ┐
│ ▲ HIGH    Authentication inconsistency                            │
│           Two auth flows diverged; may block release.             │
│           Mitigation: unify in Validation · ▸ detail              │
│ ▲ MED     Duplicate documentation                                 │
│ ▲ LOW     Minor formatting differences                            │
└───────────────────────────────────────────────────────────────────┘
```

Rows grouped by severity, high first. High rows are expanded by default (title + one-line consequence + mitigation); medium/low are single collapsed rows.

### Content rules
- Title ≤ 60 chars, named as a *condition*, not an event log ("Authentication inconsistency", not "I noticed auth might be broken").
- High risks must carry: consequence (one line), proposed mitigation, and which objective they threaten.
- Severity definitions are normative — the AI classifies against them, not vibes:
  - **High:** plausibly prevents an objective or violates a frozen decision.
  - **Medium:** degrades quality/timeline; objective still reachable.
  - **Low:** cosmetic or informational; no action expected.

### States
| State | Treatment |
| --- | --- |
| Open | Severity tokens (`risk-high/medium/low` accent on subtle) |
| Mitigating | Severity chip + ● "mitigation in progress" in `mission-accent` |
| Resolved | Moves to a "resolved (n)" disclosure at board foot; row in `text-tertiary` with ✓ |
| Accepted | Human explicitly accepted via decision card; row gets "accepted · you · date" chip and stops counting toward health |
| Escalated | High risk that became blocking → also fires an Escalation Banner |

### Behavior
- New high risks: no popup — the row appears, the board's count updates, and the Executive Summary health reflects it. The risk becomes an interruption **only** when it blocks execution or needs a judgment call (then it arrives as a Decision Card: "Accept risk / Mitigate now / Pause").
- Click row → drawer: evidence, affected artifacts, mitigation options, history.
- Every severity change is logged with reason; silent reclassification is forbidden.

### Accessibility
- `role="region"` labeled "Risks"; severity is announced in text ("High risk:") — never color-only. Glyph shape (filled/half/outline triangle) additionally distinguishes severities.

### Do / Don't
- **Do** let the AI close its own low/medium risks when evidence clears, with a log entry.
- **Don't** use the board as a to-do list — a risk with a committed fix underway is a task in Progress, plus a "mitigating" state here.
- **Don't** inflate severity for attention. If the AI needs a decision, it should ask for one.

---

## 2. Risk Badge

### Purpose
Compact severity indicator reused everywhere a risk is referenced (progress rows, artifact cards, executive summary, drawers).

### Anatomy
`▲ HIGH` — glyph + `overline` text in severity accent on severity subtle, pill radius, 20px height.

### Rules
- Always paired with a title or in a labeled column; a bare badge floating without context is banned.
- Clicking a badge anywhere deep-links to the row on the Risk Board — one source of truth.
