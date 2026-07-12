# Orchestra Design System

**The UX system for mission-first AI orchestration interfaces.**

Orchestra implements the [AI Orchestration UX Framework](../ai-orchestration-ux-framework.md). Where the framework says *what* the interface must do (mission-first, decision-centric, implementation hidden by default), Orchestra specifies *how*: tokens, layout, components, interaction patterns, voice, and accessibility.

---

## System Principles

Every component and pattern in Orchestra is derivable from these five rules. When a spec is silent, decide by principle order — earlier wins.

1. **Judgment first.** Anything requiring human judgment outranks everything else — in position, contrast, and interruption rights. Nothing else may compete for attention with a pending decision.
2. **Calm by default.** The interface is quiet while the AI works. No streaming text, no spinners-as-theater, no animation that exists to look busy. Motion communicates state change only.
3. **Altitude, not volume.** Information is layered Mission → Objectives → Progress → Artifacts → Implementation. Each layer summarizes the one below it. Users descend deliberately; the UI never pushes them down.
4. **Artifacts over conversation.** Durable outputs (documents, decisions, reports) are the primary objects. Chat, where it exists at all, is an input method — never the record.
5. **Answer the four questions in 30 seconds.** What is the mission? What is done? What needs my judgment? What happens next? Every screen at the default (Orchestrator) level must answer all four without scrolling.

## Naming

- Token prefix: `--orc-*` (CSS) / `orc.*` (JSON). The system is brand-agnostic; rebranding means swapping token values, never component code.
- Semantic color roles are named for **meaning in the orchestration model**, not hue: `mission`, `progress`, `decision`, `risk`, `frozen`, `info`. A component asks for `--orc-decision-accent`, never "amber".

## Structure

| Section | Contents |
| --- | --- |
| [Foundations](foundations.md) | Color, typography, spacing, elevation, motion, iconography — the token layer and its usage rules |
| [Layout](layout.md) | App shell, dashboard grid, information zones, density, responsive behavior |
| [Components](components/README.md) | Full specs: anatomy, states, behavior, content rules, accessibility |
| [Patterns](patterns.md) | Cognitive modes, reporting levels, decision lifecycle, drill-down, notification policy |
| [Voice & Tone](voice-and-tone.md) | AI communication rules, message templates, microcopy standards |
| [Accessibility](accessibility.md) | Contrast, keyboard, screen reader, cognitive accessibility requirements |
| [Tokens](../../tokens/) | `orchestra.tokens.json` (source of truth) and `orchestra.css` (CSS custom properties) |
| [Styleguide](../../styleguide/index.html) | Living demo — the Mission Dashboard rendered with real components |

## Component Inventory

| Component | Spec | Framework section it implements |
| --- | --- | --- |
| Mission Header, Objective List, Phase Indicator | [components/mission.md](components/mission.md) | Default Dashboard §5.1–5.3 |
| Progress Board, Activity Card | [components/progress.md](components/progress.md) | §5.4–5.5 |
| Decision Card, Decision Queue, Frozen Decision Registry | [components/decisions.md](components/decisions.md) | §6–7 |
| Risk Board, Risk Badge | [components/risks.md](components/risks.md) | §8 |
| Artifact Card, Artifact Workspace | [components/artifacts.md](components/artifacts.md) | §9 |
| Executive Summary, Confidence Meter | [components/executive-summary.md](components/executive-summary.md) | §10 |
| Level Switcher, Drill-Down Disclosure | [components/navigation.md](components/navigation.md) | §11, §13 |
| Interrupt Dialog, Status Toast, Escalation Banner | [components/notifications.md](components/notifications.md) | §15 |

## How to Use This System

- **Designers:** start from [Layout](layout.md) for screen structure, then compose from component specs. Never introduce a new color meaning or type size — extend the token layer first, by proposal.
- **Engineers:** import `tokens/orchestra.css`, build components to spec including states and accessibility sections (they are requirements, not suggestions).
- **AI agents rendering UI:** the [Voice & Tone](voice-and-tone.md) templates define the exact shape of every AI-authored message. Level 2 (Orchestrator) formatting is the default; Level 1 detail only on explicit request.

## Versioning

Tokens and component specs are versioned together (currently `0.1.0`). Breaking changes to semantic token names or component anatomy require a major bump and a migration note in the spec's changelog section.
