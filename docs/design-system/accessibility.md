# Accessibility

Baseline: **WCAG 2.2 AA** across both themes. Orchestra adds orchestration-specific requirements — an interface built to reduce cognitive load must be rigorous about cognitive accessibility, and an interface that updates itself must be rigorous about announcements.

---

## 1. Color & Contrast

- Text and meaningful icons: ≥ 4.5:1 against their background; large text (`section`+) ≥ 3:1; UI component boundaries ≥ 3:1. Verified for **every accent-on-subtle pair in both themes** whenever token values change.
- **Never color-alone.** Every status pairs hue with a glyph or word: decisions ◆ + "DECISION REQUIRED", risks ▲ + severity word, progress ✓/●/○. The dashboard must survive grayscale.
- Focus indicator: 2px `border-focus` ring, 2px offset, on every interactive element — including whole cards.

## 2. Keyboard

Full operation without a pointer, and efficient — supervisors live on this dashboard:

| Binding | Action |
| --- | --- |
| `Tab` / arrows | Zones in priority order (Mission → Decisions → Progress → …); roving tabindex within lists |
| `Enter` on card | Drill-down drawer · `Esc` closes, focus returns to invoker |
| `1–4` / `Enter` / `D` | Select option / confirm / defer, within a focused decision card |
| `g d · g p · g r · g a` | Jump to Decisions / Progress / Risks / Artifacts |
| `Ctrl/Cmd + 1/2/3` | Reporting level Exec / Orchestrator / Engineering |
| `?` | Shortcut overlay |

Drawers and dialogs trap focus while open. Skip-link jumps straight to Pending Decisions.

## 3. Screen Readers & Live Regions

A self-updating dashboard must announce *selectively* — reading every mutation aloud recreates the fatigue Orchestra removes:

| Event | Announcement |
| --- | --- |
| New decision | `aria-live="assertive"` if blocking, else polite: "Decision waiting: Choose documentation structure" |
| Escalation banner | assertive, once |
| Progress/phase changes | polite, coalesced, ≤ 1/min: "Progress: 12 of 17 tasks complete" |
| Activity Card field swaps | **not announced** (on-demand reading only) |
| Toasts | `role="status"` (polite) |

Structure: one `h1` (mission), `h2` per zone, landmarks (`header`, `nav`, `main`, per-zone labeled `region`). Progress bars expose `aria-valuenow/min/max`; confidence and risk values are text first, graphics `aria-hidden`.

## 4. Cognitive Accessibility

These are system requirements, not enhancements — they are the product:

- **Consistent placement:** zones never reflow by content type; the decision badge never moves. Spatial memory is a feature.
- **One question at a time:** interrupt dialogs never stack; queues are ordered; the golden path (approve recommendation) is always the visually primary, first-focused action.
- **Plain language at L2:** ≤ grade-9 reading level for all AI-authored orchestration text; jargon lives at L1.
- **No time pressure by default:** deadlines are shown, but nothing auto-selects on a countdown unless the user opted into standing rules.
- **Reduced motion:** `prefers-reduced-motion` zeroes durations; state changes remain perceivable via color + glyph + position. The Activity dot's breathe animation is removed entirely.
- **Forgiveness:** every action that changes mission state (resolve, freeze, thaw, archive) is undoable for 30s via toast or reversible through history; destructive verbs get consequence-echo confirmations.

## 5. Testing Gates

A component or screen ships only after:

1. Automated checks (axe or equivalent) clean in both themes.
2. Keyboard-only walkthrough completes the four-question test *and* resolves a decision.
3. Screen-reader pass (NVDA + VoiceOver) on the dashboard with a live-updating mission.
4. Grayscale screenshot review — all states still distinguishable.
5. 200% zoom / 320px reflow — no loss of decisions, risks, or summary.
