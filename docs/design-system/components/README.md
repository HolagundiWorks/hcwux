# Components

Full specifications for every Orchestra component. Each spec follows the same contract:

- **Purpose** — what orchestration problem it solves and which framework section it implements
- **Anatomy** — labeled structure diagram
- **Content rules** — what may and may not appear; character limits
- **States & variants** — every visual state, with tokens
- **Behavior** — interaction, keyboard, and data-refresh rules
- **Accessibility** — roles, labels, focus order (requirements, not suggestions)
- **Do / Don't**

## Index

| Spec | Components | Priority class |
| --- | --- | --- |
| [mission.md](mission.md) | Mission Header · Objective List · Phase Indicator | Structure |
| [decisions.md](decisions.md) | Decision Card · Decision Queue · Frozen Decision Registry | **Judgment (highest)** |
| [progress.md](progress.md) | Progress Board · Activity Card | Awareness |
| [risks.md](risks.md) | Risk Board · Risk Badge | Awareness |
| [artifacts.md](artifacts.md) | Artifact Card · Artifact Workspace | Record |
| [executive-summary.md](executive-summary.md) | Executive Summary · Confidence Meter | Rollup |
| [navigation.md](navigation.md) | Level Switcher · Drill-Down Drawer · Disclosure | Chrome |
| [notifications.md](notifications.md) | Interrupt Dialog · Escalation Banner · Status Toast | Interruption |

## Shared rules

- Components consume **semantic tokens only** (`--orc-*`). A hex value in component code is a defect.
- Every card is keyboard-focusable as a unit (`Enter` = drill down) before its internal controls.
- All timestamps render as relative ("4m ago") with absolute time in the tooltip/`title`.
- Any text authored by the AI inside a component must follow [Voice & Tone](../voice-and-tone.md) templates.
- Priority class resolves conflicts: when space or attention budgets collide, Judgment > Awareness > Rollup > Record > Structure > Chrome.
