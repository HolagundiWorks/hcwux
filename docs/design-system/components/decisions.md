# Decision Components

Implements framework §6 (Pending Decisions) and §7 (Frozen Decisions). **Highest priority class in the system.** Everything about these components — position, contrast, interruption rights — is allowed to outrank every other component.

---

## 1. Decision Card

### Purpose
Presents one question requiring human judgment, packaged so it can be resolved in under a minute: recommendation first, alternatives available, impact and deadline explicit.

### Anatomy

```
┌──────────────────────────────────────────────────── decision-subtle bg
│ ◆ DECISION REQUIRED            impact: repository-wide · ~1 min
│                                                       (overline + meta)
│ Choose documentation structure                        (card-title)
│
│ ┌─ RECOMMENDED ────────────────────────────────┐
│ │ ◉ Architecture-first                         │
│ │   Groups docs by system design; best for     │
│ │   long-term maintenance.                     │
│ └──────────────────────────────────────────────┘
│ ○ Feature-first — faster onboarding, more duplication
│ ○ Flat — simplest, degrades at scale
│
│ Why this matters: affects every documentation task     (body, 1–2 lines)
│ downstream; hard to reverse after Phase 4.
│
│ [ Approve recommendation ]  [ Choose different ]  [ Defer ▾ ]
│                                          Waiting since 2:31 PM (meta)
└─────────────────────────────────────────────────────────
```

Frame: 1.5px `decision-accent` left border, `decision-subtle` background, radius `md`, elevation 1.

### Content rules
- **Question ≤ 70 chars**, phrased as a choice, not a status ("Choose X", "Approve Y?").
- **2–4 options.** One option only → not a decision, it's a notification (AI should proceed and report). Five or more → AI must pre-cluster before asking.
- Recommendation is mandatory and always first, with a one-sentence rationale. Alternatives get one line each.
- "Why this matters" (impact) is mandatory: what it affects + reversibility.
- Every option label must make sense without reading the others.
- No implementation detail. Options are described by consequence, not by code. A "View engineering detail" disclosure at the card foot opens Level 1 in the drawer for users who want it.

### States
| State | Treatment |
| --- | --- |
| Pending (default) | As above |
| Urgent (deadline < 1h or blocking) | Border 2px; deadline chip in `risk-high` tones: "Blocking execution" |
| Deferred | Collapsed to one row, `text-secondary`, snooze timestamp; returns to Pending on expiry |
| Resolved | Collapses to a log row: "✓ Architecture-first · you · 2:33 PM"; moves to Decision Log after 30s |
| Auto-resolved (policy) | As Resolved with "auto per standing rule" chip in `info` tones; always reviewable |

### Behavior
- **Arrival:** the system's single permitted attention animation (320ms scale-settle) + decision badge increments. No sound, no modal — unless the decision is *blocking*, which escalates to an [Interrupt Dialog](notifications.md).
- **Approve recommendation** is the primary action and the largest target — the golden path is one click.
- **Defer** offers 1h / 4h / tomorrow / "let AI decide". "Let AI decide" converts recommendation to action and logs it as delegated.
- Keyboard: cards are a roving-tabindex list; `1–4` select an option, `Enter` confirms, `D` defers.
- Resolving a decision writes a **Decision Log artifact entry** automatically (question, options, choice, who, when, rationale).

### Accessibility
- `role="group"` with `aria-labelledby` = question. Options are a radiogroup.
- Deadline urgency is announced ("blocking" read aloud), not only color-coded.

### Do / Don't
- **Do** batch related trivial choices into one card with sub-choices.
- **Don't** ever emit a decision card for something the Frozen registry already answers — that's drift; the AI must re-read the freeze first.
- **Don't** use decision cards for FYIs. An FYI is a toast or a progress row.

---

## 2. Decision Queue

### Purpose
Zone B of the dashboard: all pending decisions, ordered, plus the resolved log. The user's inbox — and the only inbox in the product.

### Anatomy
Header row: `◆ Decisions (2)` + "resolve all recommended" bulk action (enabled when every pending card has a recommendation). Cards stacked, `space-3` gaps. Footer link: "Decision log →".

### Behavior
- **Sort is fixed:** blocking first, then by deadline, then FIFO. Not user-sortable — predictability beats preference here.
- Queue length > 5 is a system health smell; the header shows a hint to the AI's operator: "Consider standing rules for recurring choices" linking to policy settings.
- **Empty state** (the calm state): single row, `progress-subtle` tint — "No decisions waiting. AI is clear to proceed. Next check-in: end of Validation." Must feel like *permission to leave*.

---

## 3. Frozen Decision Registry

### Purpose
Implements the design-freeze / command-intent concept: decisions that are settled and **cannot change without explicit human approval**. Reduces AI drift and re-litigation.

### Anatomy

```
┌ ❄ FROZEN DECISIONS ──────────────── frozen-subtle header band ┐
│ ❄ Design system      Carbon          frozen 05 Jul · you      │
│ ❄ Architecture       Modular         frozen 05 Jul · you      │
│ ❄ Language           TypeScript      frozen 06 Jul · AI ✓you  │
│ ❄ Database           PostgreSQL      frozen 06 Jul · you      │
│ ❄ Security standard  OWASP ASVS      frozen 06 Jul · you      │
│                                    [ Propose change… ]        │
└───────────────────────────────────────────────────────────────┘
```

Table rows: lock glyph (`frozen-accent`), decision name (`label`), value (`card-title` weight at `body` size), meta (frozen date + who). Registry lives on its own rail destination and as a compact strip in the drill-down drawer whenever a decision card is open (the AI's constraints, visible while judging).

### Content rules
- Value column ≤ 30 chars; detail lives in the linked Decision Log entry.
- Every frozen row links to the artifact that justified it.

### Behavior
- **Nothing edits in place.** "Propose change…" opens a structured thaw request: what, why, blast radius (AI-computed list of affected artifacts/tasks), and creates a *Decision Card* for the human. Approving a thaw re-freezes the new value and logs the supersession chain.
- The AI treats this registry as hard constraints; any AI plan step that would violate a frozen decision must halt and emit a thaw-request decision card instead of proceeding.
- Rows are immutable history: superseded values remain visible via "history" disclosure per row.

### Do / Don't
- **Do** freeze early and small — five strong constraints beat twenty weak ones.
- **Don't** let freezes accumulate stale: registry shows age; rows > 90 days old get a quiet "still current?" review affordance (not a decision card).
