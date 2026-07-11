# Mission Components

Implements framework §5.1–5.3. These components define *where the user is* — they are structural, always visible, and deliberately the calmest elements on screen.

---

## 1. Mission Header

### Purpose
States the mission in one sentence and anchors every other element to it. If a user screenshots only this component, a stranger should understand what the system is doing.

### Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ WORKSPACE / MISSION                              (overline) │
│ Build Repository Cleanup Framework           (mission type) │
│                                                             │
│ [Remove legacy code ✓] [Archive docs ✓] [Update refs ●]     │
│ [Validate links ○] [Release-ready repo ○]  (objective chips)│
│                                                             │
│ Phase: Implementation ━━━━━●──── Validation                 │
│ 64% · Est. completion 2:40 PM        (phase indicator)      │
└─────────────────────────────────────────────────────────────┘
```

### Content rules
- Mission sentence: **≤ 80 characters**, imperative mood, outcome-oriented ("Build X", "Migrate Y"). No conjunctions chaining two missions — two missions means two dashboards.
- Written/edited by the human (or AI-proposed, human-confirmed). The AI may never silently rewrite the mission.
- One Mission Header per screen. It never collapses, but compresses to a single line (sentence + phase %) when scrolled, docking under the Top Bar.

### States
| State | Treatment |
| --- | --- |
| Active | Default; `text-primary` on `surface` |
| Complete | `progress-subtle` background band; sentence prefixed with ✓ |
| Blocked | Thin `risk-high` top border + "Blocked" chip; links to blocking item |
| Draft (no freeze yet) | `text-secondary` sentence + "Draft" chip in `info` tones |

### Accessibility
- Rendered as `<header>` with `<h1>` for the mission sentence — the only `h1` on the page.
- Phase and % changes announce politely via `aria-live="polite"` at most once per minute.

---

## 2. Objective List

### Purpose
The mission decomposed into at most 5 verifiable outcomes (framework cap). Chips, not prose — objectives are scannable in one fixation each.

### Anatomy
Chip: `[status-glyph  label]` — pill radius, `label` type, 1px border.

### Content rules
- **Hard cap: 5.** The composer disables adding a sixth and suggests splitting the mission.
- Each objective ≤ 40 characters, outcome-phrased ("Links validated", not "Work on links").
- Order is priority order; drag to reorder (human only).

### States
| State | Glyph | Tokens |
| --- | --- | --- |
| Remaining | ○ | `text-tertiary` on `surface`, `border` |
| In progress | ● | `mission-accent` on `mission-subtle` |
| Complete | ✓ | `progress-accent` on `progress-subtle` |
| At risk | ▲ | `risk-medium` on `risk-medium-subtle` |
| Blocked | ▲ | `risk-high` on `risk-high-subtle` |

### Behavior
- Click → drill-down drawer listing the tasks and artifacts mapped to that objective.
- Status is AI-maintained; **completion of the final objective triggers the Mission Complete interrupt** (see [notifications.md](notifications.md)).

---

## 3. Phase Indicator

### Purpose
Shows position in the mission lifecycle (Discovery → Architecture → Implementation → Validation → Documentation → Review → Complete) with progress and ETA — the "where are we" instrument.

### Anatomy

```
Discovery ─ Architecture ─ [Implementation ●] ─ Validation ─ … ─ Complete
                            64% · Est. 2:40 PM
```

Horizontal stepper: past phases as filled dots (`progress-accent`), current as labeled node (`mission-accent`, `card-title` type), future as hollow dots (`text-tertiary`). Below: percent (tabular numerals) + ETA.

### Content rules
- Phase names come from the mission template; 7 maximum, one word each where possible.
- ETA is always range-honest: show "~2:40 PM" or "2–3 min", never false precision. If the AI cannot estimate, show "estimating…" — never a made-up number.

### States
- **Regressed** (a phase reopened): the reopened phase gets a `risk-medium` ring; a one-line reason appears beneath ("Validation reopened: 3 links failed").
- **Paused:** current node hollow with ⏸; status bar mirrors it.

### Behavior
- Hover/focus on any phase → popover with that phase's entry/exit criteria and completed-at timestamp.
- Phase transitions are AI-executed but logged; transition into Review or Complete always produces a Decision Card first (human confirms).

### Do / Don't
- **Do** keep the stepper linear even if execution parallelizes internally — the user's mental model is a pipeline.
- **Don't** animate the progress bar continuously; it updates in discrete, honest steps.
- **Don't** show sub-task counts here; that is the Progress Board's job.
