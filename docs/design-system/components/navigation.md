# Navigation Components

Implements framework §11 (Drill-Down Model) and §13 (Reporting Levels). Chrome class: navigation exists to make descent *deliberate* and ascent instant.

---

## 1. Level Switcher

### Purpose
Sets the viewer's reporting altitude for the whole workspace: **Executive (L3) · Orchestrator (L2, default) · Engineering (L1)**. Level 0 (AI internals) has no UI — it is not a setting, it does not exist here.

### Anatomy
Segmented control in the Top Bar: `[ Exec | Orchestrator | Engineering ]` — `label` type, selected segment `mission-subtle` bg + `mission-accent` text.

### Behavior
- Switching levels re-renders content density, it never changes *what is true*: same mission, same numbers, different depth.
  - **L3:** Executive Summary only, enlarged.
  - **L2:** Mission Dashboard (default).
  - **L1:** dashboard plus engineering panels unlocked — step logs expanded, artifact technical sections open, monospace content visible, compact density.
- Per-user, per-mission persistence. Deep links carry level (`?level=1`) so a shared link shows what the sender saw.
- Keyboard: `Ctrl/Cmd+1/2/3`.
- Descending to L1 shows a one-time hint: "Engineering view — implementation detail is visible. The AI still manages execution." The model must stay explicit: seeing code ≠ owning code.

---

## 2. Drill-Down Drawer

### Purpose
The single container for descending the hierarchy (Mission → … → Code) without losing dashboard context. Specified structurally in [Layout §4](../layout.md); this spec covers component behavior.

### Anatomy

```
┌─ drawer (480px, elevation 3) ──────────────┐
│ Artifact ▸ Technical Summary ▸ Code   ✕    │  (breadcrumb = altitude trail)
│ ────────────────────────────────────────── │
│ [content at current depth]                 │
│                                            │
│ ▾ ENGINEERING DETAIL ────────────────────  │  (L1 zone: sunken bg, mono)
│   …                                        │
└────────────────────────────────────────────┘
```

### Behavior
- One drawer, content replaced on deeper navigation; breadcrumb grows. Breadcrumb segments are the "up" affordance; `Esc` closes entirely.
- The drawer never opens by itself. Only explicit user intent (click/Enter on a card, deep link) — the system must never *push* the user down the hierarchy.
- Level 1 zones inside any drawer content are collapsed by default at L2, expanded at L1, and always styled distinctly: `surface-sunken`, `code` type, "ENGINEERING DETAIL" overline.
- Focus is trapped while open; on close, focus returns to the invoking card.

---

## 3. Disclosure ("show me more")

### Purpose
Inline, single-step depth control used inside cards: "▸ Step log", "▸ 2 alternatives", "▸ Technical detail". The atom the drill-down model is built from.

### Rules
- Label states **what will be revealed and its altitude**, not "more" — e.g. "▸ Step log (Level 1)".
- Chevron rotates 90° at `fast`; content expands at `base`. State persists per user per card.
- A disclosure may not contain another disclosure of the *same* level — nested same-level folding hides content twice and breaks the "one step down" contract. Crossing levels (L2 card → L1 detail) is exactly what it's for.
- `aria-expanded` on the trigger; revealed region labeled by the trigger.

### Do / Don't
- **Do** default every disclosure closed at Orchestrator level. Open-by-default equals noise.
- **Don't** hide *decisions or risks* behind disclosures — judgment and threats are never optional information.
