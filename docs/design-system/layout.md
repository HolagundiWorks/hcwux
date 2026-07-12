# Layout

Screen structure for orchestration interfaces: the app shell, the Mission Dashboard grid, information zones, and responsive behavior.

---

## 1. App Shell

```
┌──────────────────────────────────────────────────────────────┐
│  Top Bar: workspace ▾ · mission switcher · level switcher ·  │
│           decision badge (◆2) · theme · account              │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│  Rail      │   Content region                                │
│  (nav)     │   (Mission Dashboard by default)                │
│            │                                                 │
│  Dashboard │                                                 │
│  Decisions │                                                 │
│  Artifacts │                                                 │
│  Risks     │                                                 │
│  Activity  │                                                 │
│            │                                                 │
├────────────┴─────────────────────────────────────────────────┤
│  Status Bar: current phase · AI state · next milestone · ETA │
└──────────────────────────────────────────────────────────────┘
```

- **Top Bar** (56px, sticky, elevation 2 when scrolled): global context and the **decision badge** — the count of pending decisions, visible from every screen in the product. It is the one element that never scrolls away.
- **Rail** (240px expanded / 64px collapsed): five destinations maximum, matching the framework's hierarchy. No nested nav; depth is handled by drill-down inside content, not by menu trees.
- **Status Bar** (36px, fixed): the ambient answer to "what is happening right now" — phase, AI activity verb, ETA. Read-only; clicking opens the Activity Card.
- **Content region**: everything else. Only this region changes between destinations and modes.

## 2. Mission Dashboard Grid

The default screen (Level 2 / Orchestrator). 12-column grid, `space-6` gutters, max content width 1280px, centered.

```
┌─────────────────────────────────────────────── 12 cols ─────┐
│ Zone A · Mission Header (mission, objectives, phase)   12   │
├──────────────────────────────────┬──────────────────────────┤
│ Zone B · Pending Decisions   8   │ Zone C · Executive   4   │
│ (empty state collapses to 1 row) │ Summary (sticky)         │
├──────────────────────────────────┤                          │
│ Zone D · Progress Board      8   │                          │
├──────────────────────────────────┼──────────────────────────┤
│ Zone E · Risk Board          6   │ Zone F · Activity    6   │
├──────────────────────────────────┴──────────────────────────┤
│ Zone G · Recent Artifacts (horizontal card row)        12   │
└─────────────────────────────────────────────────────────────┘
```

**Zone order is normative.** It encodes the framework's priority: decisions above progress, progress above risk, artifacts as the floor. Implementations may tune column spans but must never place any zone above Pending Decisions except the Mission Header.

Zone rules:

- **A — Mission Header:** always visible, never collapses. Contains the single `mission`-role sentence, ≤5 objective chips, phase indicator with ETA.
- **B — Pending Decisions:** when ≥1 decision exists, this zone carries the page's strongest visual weight. When empty it collapses to a single quiet row: "No decisions waiting · AI is clear to proceed" — the calm state is a *feature*, users must learn that an empty queue means freedom to leave.
- **C — Executive Summary:** sticky on scroll; the one-screen rollup (status, %, open decisions, top risk, next milestone, confidence).
- **D — Progress Board:** Completed / In Progress / Remaining columns.
- **E/F — Risk Board & Activity:** peers; neither may exceed the height of D without scrolling internally.
- **G — Artifacts:** most recently updated first.

## 3. The Four-Question Test

At default zoom (100%), viewport 1440×900, an Orchestrator-level dashboard must answer all four framework questions **above the fold**:

| Question | Answered by | Zone |
| --- | --- | --- |
| What is the mission? | Mission sentence | A |
| What has been completed? | Progress Board + summary % | D, C |
| What requires my judgment? | Decision Queue + badge | B, top bar |
| What happens next? | Next step in Activity + next milestone | F, C |

A layout change that pushes any of these below the fold fails review.

## 4. Drill-Down Layer (Right Drawer)

Descending the hierarchy never navigates away — context stays on screen.

- Clicking any card opens a **right drawer** (480px, elevation 3) with the next level of detail: decision → full option comparison; artifact → document view; activity → step log.
- Drawers stack one level deep at most. Going deeper (e.g. artifact → implementation → code) replaces drawer content and adds a breadcrumb: `Artifact ▸ Technical Summary ▸ Code`.
- Level 1 (engineering) content inside a drawer is visually marked: `surface-sunken` background, `code` type, an "ENGINEERING DETAIL" overline. The user should always *feel* the altitude change.
- `Esc` closes the drawer top-down; dashboard state (scroll, expansion) is preserved.

## 5. Mode Layouts

The five cognitive modes ([Patterns §1](patterns.md)) are layout presets on the same shell:

| Mode | Shell changes |
| --- | --- |
| Design | Rail collapses; content becomes full-bleed canvas; status bar hides; only decision badge remains |
| Transition | Content becomes single centered column (720px): decision summary → freeze list → execution plan checklist |
| Orchestration | Default dashboard grid (above) |
| Execution | Rail and status bar hide; focused editor full-bleed; toasts suppressed (queued) |
| Review | Content splits into comparison view (before/after 50:50); risk and validation panels docked right |

Mode switches animate at `slow` (320ms) and are user-initiated or AI-*proposed* (never AI-forced): the AI may surface "Ready to move to Review" as a decision card, but the human clicks.

## 6. Responsive Behavior

| Breakpoint | Layout |
| --- | --- |
| ≥ 1280 | Full grid as specified |
| 960–1279 | Zone C moves above B as a horizontal summary strip; B–G go single column, 8-col wide |
| 600–959 | Single column; rail becomes bottom tab bar (Dashboard, Decisions, Artifacts, More); status bar merges into Mission Header |
| < 600 (mobile) | **Decision-first mode:** the app opens on the Decision Queue, not the dashboard. Mobile is for judgment and monitoring, not orchestration setup. Executive Summary is one swipe away. |

The mobile inversion is deliberate: on a phone, the framework's question 3 ("what requires my judgment?") is the whole product.

## 7. Empty, Loading, and Degraded States

- **First run (no mission):** the dashboard renders a single centered Mission composer ("What should be true when this is done?") — never an empty grid of hollow cards.
- **Loading:** skeletons match final layout exactly (no layout shift). Skeletons never pulse faster than `slow`.
- **AI unreachable / stale:** the Status Bar turns `risk-medium-subtle` with "Last update 4m ago — reconnecting"; all data on screen remains readable. Stale is a state, not a blank.
