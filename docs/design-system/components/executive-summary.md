# Executive Summary Components

Implements framework §10 (Executive Summary) and the Level 3 reporting view. Rollup class: always available, never more than one screen.

---

## 1. Executive Summary

### Purpose
The one-glance rollup — mission status, progress, open decisions, top risk, next milestone, confidence. Zone C of the dashboard (sticky) and the *entire* content of the Level 3 (Executive) view.

### Anatomy

```
┌ Executive Summary ──────────────────┐
│ STATUS        On track ✓            │
│ PROGRESS      64% ▓▓▓▓▓▓▓░░░░       │
│ DECISIONS     2 waiting ◆  →        │
│ TOP RISK      ▲ Auth inconsistency →│
│ NEXT          Validation · ~2:40 PM │
│ CONFIDENCE    High ●●●○             │
└─────────────────────────────────────┘
```

Six fixed rows: `overline` keys, values in `body`/`card-title`. Radius `md`, `surface` background, elevation 1.

### Content rules
- **Exactly these six rows. Nothing may be added** — the component's value is its rigidity. Framework: "Nothing more."
- STATUS vocabulary is closed: `On track` (progress tones) · `Attention needed` (decision/medium tones) · `At risk` (high tones) · `Blocked` (high tones + reason) · `Complete`.
- STATUS is **computed, not authored**: Blocked if any blocking item; At risk if any open high risk; Attention needed if decisions waiting > SLA or medium risks ≥ 3; else On track. The AI cannot editorialize its own health.
- TOP RISK shows the single highest open risk; "none" is a valid, calm value.
- PROGRESS = completed/total tasks from the Progress Board — same number, same source, everywhere.

### Behavior
- Every row deep-links (→) to its source component. The summary is a map, not a destination.
- Updates at most once per 30s, with value cross-fade at `fast` — an instrument, not a ticker.
- In Level 3 view, the same rows render enlarged with KPI/milestone/timeline detail beneath each — still one screen, no scroll at 1440×900.

### Accessibility
- `role="region"` "Executive summary". Confidence and progress values are text first, graphic second (bar/dots are `aria-hidden` reinforcement).

---

## 2. Confidence Meter

### Purpose
The AI's calibrated self-assessment that the mission will complete as planned — surfaced honestly so trust is earned by track record, not tone.

### Anatomy
`High ●●●○` — word + 4-dot scale (`progress-accent` fill for High, `decision-accent` for Medium, `risk-high` for Low). Word first: the dots are redundant encoding.

### Content rules
- Scale: **Low · Medium · High · Very high.** No percentages — false precision breeds false trust.
- Hover/focus popover must state *drivers*: "High — all validations passing; one open medium risk" — a confidence value without reasons is banned.

### Behavior
- Any drop of ≥ 1 level self-annotates on the summary for 24h ("was High, now Medium — auth inconsistency found"). Confidence never silently recovers either; the popover keeps a 7-day sparkline history.
- Confidence dropping to Low triggers the notification policy's *blocker* class (it interrupts) — Low confidence means the plan itself is in doubt.

### Do / Don't
- **Do** keep confidence about *mission completion*, not about individual answers.
- **Don't** let marketing tones leak in — confidence is an engineering instrument; over-claiming here poisons every other number on the dashboard.
