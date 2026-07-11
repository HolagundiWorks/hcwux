# AI Orchestration UX Framework

**Designing AI interfaces for reduced cognitive fatigue.**

> **Core Principle** — The interface should adapt to the user's **cognitive role**, not the AI's implementation role.

This repository contains the design framework. Start here, then see the full specification in [`docs/ai-orchestration-ux-framework.md`](docs/ai-orchestration-ux-framework.md).

---

## Vision

Traditional AI interfaces are conversation-first. The future AI interface should be **mission-first**.

Instead of reading conversations, the user supervises progress. The AI becomes an autonomous execution engine while the human remains the architect and decision maker.

## The Four Questions

The interface should continuously answer:

1. **What is the mission?**
2. **What has been completed?**
3. **What requires my judgment?**
4. **What happens next?**

If the user can answer those four questions in under 30 seconds, the interface is succeeding.

## Guiding Principle

> The AI should not behave like a chatbot. It should behave like a disciplined engineering organization.

The human should never manage implementation. The human manages **intent**. The AI manages **execution**.

## Contents

| Path | Purpose |
| --- | --- |
| [`docs/ai-orchestration-ux-framework.md`](docs/ai-orchestration-ux-framework.md) | The framework: philosophy, interface hierarchy, dashboard spec, reporting levels, cognitive modes, notification policy, success metrics |
| [`docs/design-system/`](docs/design-system/README.md) | **Orchestra** — the full UX design system implementing the framework: foundations, layout, component specs, patterns, voice & tone, accessibility |
| [`tokens/`](tokens/) | Design tokens: `orchestra.tokens.json` (source of truth) + `orchestra.css` (CSS custom properties, light/dark) |
| [`styleguide/index.html`](styleguide/index.html) | Living styleguide — the Mission Dashboard and component gallery rendered with real tokens (open locally in a browser) |

## Design System at a Glance

Orchestra turns the framework into buildable specification:

- **Semantic tokens** — seven color meanings (`mission`, `progress`, `decision`, `risk`, `frozen`, `info`, neutrals), eight type roles mapped to the information hierarchy, light + dark themes.
- **Normative layout** — app shell, dashboard zones in priority order (decisions always on top), drill-down drawer model, five cognitive-mode layout presets, mobile decision-first inversion.
- **Component specs** — anatomy, content rules, states, behavior, and accessibility for the Mission Header, Decision Card & Queue, Frozen Decision Registry, Progress Board, Activity Card, Risk Board, Artifact Workspace, Executive Summary, Level Switcher, and notification surfaces.
- **Behavioral patterns** — decision lifecycle, interruption budget, reporting-level invariants, trust-and-verification rules.
- **Voice & tone** — the exact message templates the AI must use (Mission Update, Decision Request, Risk Report, Escalation, Completion).
