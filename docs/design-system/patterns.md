# Patterns

Cross-component behavior: cognitive modes, reporting levels, the decision lifecycle, and the interruption budget. Components define pieces; patterns define how the system behaves over time.

---

## 1. Cognitive Modes

Implements framework §14. A mode is a coordinated preset of **layout + AI behavior + notification posture**. The user (or an AI *proposal*) switches modes; the system never switches silently.

| Mode | Layout ([Layout §5](layout.md)) | AI behavior contract | Notifications |
| --- | --- | --- | --- |
| **Design** | Full-bleed canvas; chrome minimal | Explore, challenge assumptions, generate options. **Implementation is forbidden** — the AI may prototype ideas as Research artifacts only | Decisions queue silently; only blockers interrupt |
| **Transition** | Single 720px column: decision summary → freeze list → execution plan | Compress and summarize the design phase; propose the freeze set; prepare execution plan for sign-off | The freeze sign-off itself is the one Interrupt |
| **Orchestration** | Mission Dashboard (default) | Execute, monitor, report at L2, escalate per policy | Full routing table active |
| **Execution** (human is heads-down) | Chrome hidden, focused editor | Assist only when asked; **introduce no new design ideas**; hold non-blocking questions | Everything queued except blockers; digest on exit |
| **Review** | Comparison view + docked validation/risk panels | Audit, critique, suggest improvements; do not redesign architecture unless asked | Failed checks surface as banner immediately |

Mode transitions worth designing explicitly:

- **Design → Transition** is the system's most valuable moment: the AI drafts the freeze candidates from the design conversation ("You settled on TypeScript — freeze it?"). Every freeze is a human click.
- **Any → Execution** stashes dashboard state; **Execution → any** replays a digest: "While you were heads-down: 2 tasks completed, 1 decision queued."
- Mode is per-human, per-mission. The AI's execution continues regardless of the human's mode — modes shape the *human's* interface, not the AI's work.

## 2. Reporting Levels (altitude)

Implements framework §13. Levels are *views of the same truth*, not different products:

| Level | Audience | Surface | Content |
| --- | --- | --- | --- |
| L0 — Internal | nobody | none | Chain of thought, internal planning. Not rendered, not a setting |
| L1 — Engineering | on demand | sunken zones, drawers, compact density, mono | Code, APIs, logs, DB changes, step logs |
| L2 — Orchestrator | **default** | Mission Dashboard | Mission, progress, risks, decisions, artifacts, confidence, next actions |
| L3 — Executive | one page | enlarged Executive Summary | Status, KPIs, milestones, budget, timeline, health |

Invariants:

- **Numbers agree across levels.** L3's 64% is L2's 64% is derivable from L1's task list. Any divergence is a defect.
- Content *below* your level is reachable in ≤ 2 clicks (disclosure → drawer); content *above* your level is always one click (the summary never hides).
- L1 styling (mono, sunken, overline-tagged) is mandatory wherever L1 content appears, at any level — altitude must be *felt*.

## 3. Decision Lifecycle

The full path of a judgment through the system:

```
AI encounters choice
   │  can policy/freeze answer it? ──yes──▶ auto-resolve, log entry, no UI
   ▼ no
Decision Card created (queue, badge +1)
   │  blocking? ──yes──▶ Interrupt Dialog, execution pauses
   ▼ no
Waits in queue ──deadline nears──▶ urgency state ──expires──▶ AI takes
   │                                                  recommendation,
   ▼                                                  logs as defaulted*
Human resolves (approve / choose other / defer / delegate)
   ▼
Decision Log artifact entry (question, options, choice, who, rationale)
   ▼
Strategic + settled? ──▶ human freezes it ──▶ Frozen Registry constraint
```

\* Auto-default on expiry is **opt-in per mission** ("standing rules"); default behavior is to block and escalate instead.

Design consequences:

- Every card must be resolvable *from the card* (recommendation-first, one-click golden path).
- Every resolution is an artifact — the Decision Log is the mission's memory and audit trail.
- The Frozen Registry is the *output* of good decision hygiene, and the *input* that prevents repeat questions: the AI checks freezes and the log before ever creating a card.

## 4. The Interruption Budget

The notification routing table ([notifications.md](components/notifications.md)) defines *what may* interrupt; this pattern defines *how much*:

- Target: **≤ 3 interruptions per working session** (dialog + banner combined). The system tracks it; exceeding budget three sessions running surfaces a hint to create standing rules or adjust decision granularity.
- Batching: non-blocking decisions arriving < 10 min apart coalesce into one queue update, one badge change.
- Quiet hours follow the user's OS focus state where available; blockers ignore quiet hours only if the mission has a deadline attribute.

## 5. Trust & Verification Pattern

Autonomy is only comfortable when checkable. Every AI claim on the dashboard obeys **"glance → verify in two clicks"**:

- Any status ("task complete", "validation passed", "risk resolved") links to its evidence: the artifact, the check output, the log — never a bare assertion.
- Validation results always show *what was checked*, not just ✓ ("142 links checked, 0 broken").
- The AI's confidence value must carry drivers (see [executive-summary.md](components/executive-summary.md)).
- Honest-uncertainty rules: ETAs are ranges, "estimating…" beats invented numbers, retries are visible.

## 6. Success Metrics (instrumentation)

Framework §16 metrics, mapped to measurable events so the system can prove it reduces fatigue:

| Metric | Instrument |
| --- | --- |
| Reduced context switching | Mode switches + drawer-depth descents per session |
| Fewer unnecessary interruptions | Interrupts dismissed-without-action rate |
| Faster decisions | Card-created → resolved median; % golden-path (approve recommended) |
| Artifact completion | Artifacts reaching "current, reviewed" per mission |
| Reduced conversation | Free-text messages sent per mission (should trend ↓) |
| Mission completion | Missions reaching Complete vs. abandoned |
| 30-second test | Time from dashboard open → first decision interaction |
