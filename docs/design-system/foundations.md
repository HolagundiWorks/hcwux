# Foundations

Token layer and usage rules. Source of truth: [`tokens/orchestra.tokens.json`](../../tokens/orchestra.tokens.json); CSS bindings: [`tokens/orchestra.css`](../../tokens/orchestra.css).

---

## 1. Color

### 1.1 Model

Orchestra's palette is **semantic-first**. Components reference meaning-named tokens; raw hex ramps are internal. There are exactly seven meanings, and no component may invent an eighth:

| Role | Meaning | Light accent | Dark accent | Used by |
| --- | --- | --- | --- | --- |
| `mission` | Identity, primary action, focus | `#4F46E5` | `#818CF8` | Mission header, primary buttons, active nav, focus rings |
| `progress` | Done, validated, healthy | `#15803D` | `#4ADE80` | Completed items, success states, confidence ≥ high |
| `decision` | Awaiting human judgment | `#B45309` | `#FBBF24` | Decision cards, decision count badge, interrupt dialogs |
| `risk.high` | Threat to mission | `#B91C1C` | `#F87171` | High-risk rows, failed validation, blockers |
| `risk.medium` | Needs monitoring | `#B45309` | `#FBBF24` | Medium-risk rows |
| `risk.low` | Noted, no action | `#6B7280` | `#8A93A1` | Low-risk rows |
| `frozen` | Locked, immutable without approval | `#0E7490` | `#22D3EE` | Frozen decision registry, lock badges |
| `info` | Neutral system information | `#1D4ED8` | `#60A5FA` | Informational toasts, links in body text |

Each role has an `accent` (text/icon/border on surface) and a `subtle` (tinted background) variant. **Rule: accent-on-subtle, never accent-on-accent.** A decision badge is `decision-accent` text on `decision-subtle` background.

### 1.2 Usage rules

- **Decision amber and risk-medium amber are intentionally the same hue.** Both mean "needs human attention"; context (card vs. risk row) disambiguates. Do not introduce a separate hue for one of them.
- Neutral surfaces carry ≥ 95% of any screen. Accents are for state, never decoration. If a screen looks colorful, it is either full of pending decisions and risks (correct) or misusing tokens (fix it).
- `mission-accent` is the only color permitted on interactive affordances (buttons, links, focus). Decision cards use `decision` tones for their *frame*, but their action buttons are still `mission`.
- Text on `subtle` backgrounds uses the role's `accent` for labels/badges but `text-primary` for sentences — long text in accent colors is banned.
- All accent-on-surface and text-on-subtle pairs meet WCAG 2.2 AA (≥ 4.5:1). Verify when changing any value; both themes.

### 1.3 Theming

Light is default; dark via `[data-theme='dark']` or `prefers-color-scheme`. Dark theme raises surface lightness for raised layers instead of shadows (`surface` → `surface-raised`), because shadow contrast dies on dark canvases. Never hardcode a hex in component CSS — theming is entirely token substitution.

---

## 2. Typography

### 2.1 Faces

- UI: **Inter** (fallback system stack). Enable `ss01`/tabular numerals for metric displays.
- Code / Level 1 detail: **JetBrains Mono** (fallback `ui-monospace`).

### 2.2 Roles

Type roles map **one-to-one onto the information hierarchy** — altitude is expressed typographically, so users can feel what layer they are on without reading labels.

| Role | Spec | Use for | Hierarchy layer |
| --- | --- | --- | --- |
| `mission` | 28/34 · 650 · −0.01em | The mission sentence. One per screen, ever. | Mission |
| `section` | 20/28 · 600 | Dashboard section titles (Progress, Decisions, Risks) | Objectives / sections |
| `card-title` | 16/24 · 600 | Card headings: decision question, artifact name, risk title | Cards |
| `body` | 14/22 · 400 | All running text | Content |
| `label` | 13/18 · 500 | Field labels, button text, nav items | Chrome |
| `meta` | 12/16 · 400 | Timestamps, versions, counts, attribution | Metadata |
| `overline` | 11/16 · 600 · +0.06em · uppercase | Category tags: "DECISION REQUIRED", "FROZEN", "HIGH RISK" | State markers |
| `code` | 13/20 · mono | Level 1 engineering content only | Implementation |

### 2.3 Rules

- **No ad-hoc sizes.** Eight roles cover every need; a ninth requires a token proposal.
- Line length for body text: 45–75 characters. Dashboard cards cap at ~60ch.
- `mission` role appears exactly once per screen. If two things look like missions, the hierarchy is broken.
- Numbers that update (progress %, counts, ETA) use tabular numerals to prevent layout shimmer.
- Monospace appearing anywhere above Level 1 is a spec violation — it means implementation is leaking upward.

---

## 3. Spacing & Sizing

- **4px base scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 (`--orc-space-1..16`).
- Card internal padding: `space-4` (16px) compact, `space-6` (24px) default.
- Section gaps on the dashboard: `space-8` (32px). Card-to-card in a list: `space-3` (12px).
- Minimum touch/click target: 40×40px (44×44 on touch-primary devices).
- Density has two modes — **Comfortable** (default, Orchestrator level) and **Compact** (Level 1 engineering views, tables). Density is a container-level switch, never per-component.

## 4. Radius & Elevation

- Radius: `sm` 6px (badges, inputs) · `md` 10px (cards) · `lg` 14px (drawers, dialogs) · `pill` (status chips).
- Elevation communicates **layer, not importance**: `0` flush content · `1` resting cards · `2` sticky bars, hover-raised cards · `3` interrupt dialogs and drawers only.
- A pending decision card is emphasized by its `decision` border and position — **not** by extra shadow. Reserve elevation 3 for things that literally sit above the workspace.

## 5. Motion

**Calm motion doctrine:** motion exists to explain state change, never to signal activity.

- Durations: `fast` 120ms (hover, toggles) · `base` 200ms (expand/collapse, card entry) · `slow` 320ms (drawer, mode transitions).
- Progress indicators are **determinate whenever possible**. Indeterminate spinners are allowed only for < 2s waits; beyond that, show the Activity Card's "currently working on / expected duration" instead.
- **The only attention-seeking animation in the system** is decision arrival: a single 320ms ease-in scale-settle (0.98 → 1.0) plus the queue badge increment. It plays once. No pulsing, no bouncing, no looping.
- Streaming token-by-token text is banned at Level 2+. AI output appears as completed blocks.
- `prefers-reduced-motion` zeroes all durations; state changes remain visible through color/position.

## 6. Iconography

- Style: outlined, 1.5px stroke, 20×20 default grid (16 for inline meta, 24 for section headers). Recommended base set: [Lucide], restyled per tokens.
- Icons are **always paired with text** in first-instance use; icon-only buttons require tooltips + `aria-label`.
- Reserved glyphs (never reuse for anything else): `◆` decision pending · `❄/lock` frozen · `▲` risk · `✓` complete · `●` in progress · `○` remaining · `↳` drill-down.
- Status is never conveyed by icon color alone — shape or glyph must differ too (see [Accessibility](accessibility.md)).
