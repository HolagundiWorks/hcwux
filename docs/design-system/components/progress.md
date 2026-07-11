# Progress Components

Implements framework §5.4 (Progress) and §5.5 (AI Activity Feed). Awareness class: these replace reading conversation scrollback with glanceable state.

---

## 1. Progress Board

### Purpose
Answers "what has been completed?" as three fixed columns — Completed, In Progress, Remaining — at task granularity (one level below objectives, well above implementation).

### Anatomy

```
┌ Progress ────────────────────────────── 12 done · 1 active · 4 left ┐
│ COMPLETED (12)        │ IN PROGRESS (1)     │ REMAINING (4)         │
│ ✓ Repository scanned  │ ● Documentation     │ ○ Link validation     │
│ ✓ Dead code identified│   update            │ ○ Cross-ref audit     │
│ ✓ Legacy docs archived│   ▸ 3 of 7 files    │ ○ Changelog           │
│   … show all          │                     │ ○ Final review        │
└──────────────────────────────────────────────────────────────────────┘
```

Columns: `overline` headers with counts, task rows in `body` type. Completed shows the 3 most recent + "show all"; Remaining shows next 4 + count.

### Content rules
- Task labels ≤ 50 chars, outcome-phrased, written by the AI **at orchestration altitude**: "Legacy docs archived", never "ran `git mv docs/old …`".
- Every task maps to exactly one objective (visible as a chip on hover/drill-down).
- In Progress holds what the AI is *actually* concurrently doing — usually 1, never > 3 rows. More than that means the AI is reporting at the wrong granularity.

### States
| Row state | Glyph / tokens |
| --- | --- |
| Completed | ✓ `progress-accent`; row text `text-secondary` (done = quiet) |
| In progress | ● `mission-accent`; optional determinate sub-progress ("3 of 7 files") |
| Remaining | ○ `text-tertiary` |
| Failed validation | ▲ `risk-high` + one-line reason; also raises a Risk row |
| Skipped (per decision) | ⊘ `text-tertiary` strikethrough + link to the decision that skipped it |

### Behavior
- Rows update as discrete transitions (no live percent creep per row). New completions slide in at `base` duration; no sound, no toast.
- Click any row → drill-down drawer: task detail, artifacts produced, Level 1 log behind a disclosure.
- Column counts feed the Executive Summary percent — one source of truth, computed as completed / total tasks.

### Accessibility
- Semantically three `<ul>` lists under one `role="region"` labeled "Progress". Column membership is announced ("Completed list, 12 items"), not conveyed by position alone.

### Do / Don't
- **Do** let Completed grow long and boring — that's the record working.
- **Don't** render this as a kanban with drag-and-drop. The human doesn't move tasks; the AI does. This is an instrument, not a workspace.

---

## 2. Activity Card

### Purpose
The "not a chat" replacement for streaming output: what the AI is doing *right now*, how long it expects to take, and what comes next. The single place where AI liveness is expressed.

### Anatomy

```
┌ AI Activity ───────────────────────────────┐
│ ● Working                                   │
│                                             │
│ Currently     Updating documentation        │
│ Expected      ~2 minutes                    │
│ Next          Validate cross-references     │
│                                             │
│ ▸ Step log (Level 1)                        │
└─────────────────────────────────────────────┘
```

Three fixed field rows (`label` keys in `text-tertiary`, values in `body`/`text-primary`), a state dot, and a Level 1 disclosure. No code, no scrollback, no token stream.

### Content rules
- "Currently" is a **gerund phrase ≤ 6 words** at orchestration altitude ("Updating documentation", not "Editing api-reference.md line 214").
- "Expected" follows honest-ETA rules (range or "estimating…"). "Next" is the next *step*, not the whole plan.
- Field values are replaced whole; text never types itself out.

### States
| State | Dot | Notes |
| --- | --- | --- |
| Working | ● `mission-accent`, slow 3s opacity breathe (the one permitted ambient motion; disabled under reduced-motion) | |
| Waiting on you | ◆ `decision-accent` | "Waiting for: decision — Choose doc structure" links to the card |
| Validating | ● `progress-accent` | |
| Paused | ⏸ `text-tertiary` | Shows who paused and resume affordance |
| Error / retrying | ▲ `risk-medium` | "Retrying (2 of 4)…" — retries are visible, not hidden |
| Idle (mission complete) | ✓ `progress-accent` | Card compresses to one row |

### Behavior
- Updates in place; the card never grows. History belongs to the step log (drill-down), which is an append-only Level 1 list with timestamps.
- If "Expected" is exceeded by 2×, the card self-annotates: "Taking longer than expected — still on it" (and only escalates per [notification policy](../patterns.md) if actually blocked).
- Mirrored in miniature in the Status Bar (verb + ETA only).

### Do / Don't
- **Do** keep exactly one Activity Card per mission, even with parallel sub-agents — the AI summarizes itself; parallelism is Level 1 detail.
- **Don't** put buttons here besides pause/resume and the disclosure. Steering the AI happens through decisions, not by poking the activity feed.
