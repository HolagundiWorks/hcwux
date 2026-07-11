# HCW-UX — the Human Centric Works design system

**One repository for how HCW builds interfaces:** the shipped component kit
(`@hcw/ui-kit`), the governance that keeps it coherent, and the **AI-Orchestration
UX framework** that guides AI-native surfaces.

> **Core principle** — the interface adapts to the user's **cognitive role**, not the
> AI's implementation role.

Maintained by **Human Centric Works (HCW)**; consumed by the AORMS platform
(AORMS-Studio, portals, licensing console, marketing) and every future HCW surface.

---

## What's here

| Area | Path | What it is |
| --- | --- | --- |
| **The kit** | [`src/`](src) · [`package.json`](package.json) | `@hcw/ui-kit` — tokens, MUI theme, and layered primitives (`Surface`, `GlassRail`, `ActionDock`, `HealthGlassOrb`, `TaskbarFooter`, `SectionDock`, `StatusDot`, `DataState`, `ConfirmModal`, `PageBreadcrumb`, `Avatar`, `BrandMark`, `MuiRoot`). |
| **Design system docs** | [`docs/esti/HCW-UI-KIT.md`](docs/esti/HCW-UI-KIT.md) · [`docs/esti/HCW-UI-UX-PRINCIPLES.md`](docs/esti/HCW-UI-UX-PRINCIPLES.md) | Layers, spatial model, tokens, UX laws, accessibility. |
| **Governance** | [`docs/hcw-kit/`](docs/hcw-kit) | Constitution, token governance, component quality, templates, MUI mapping, audits + debt register, AI-agent rulebook. |
| **AI-Orchestration UX** | [`docs/ai-orchestration-ux-framework.md`](docs/ai-orchestration-ux-framework.md) · [`docs/esti/HCW-AI-ORCHESTRATION-UX.md`](docs/esti/HCW-AI-ORCHESTRATION-UX.md) | The framework (why) and its HCW/ESTI-native application (how). |

---

## The thesis: depth encodes importance

Three material languages stack by z-depth — pick a layer by an element's **role**,
never by taste:

| Need | Layer |
| --- | --- |
| Table, body copy, list | `flat` |
| Dialog, summary card, panel | `soft` |
| Dock, alert, active widget | `glass` |
| Marketing / translucent rail | `clearGlass` |
| Full-width section heading band | `headingGlass` |

Full spatial model (rail · stage · footer · dock) and marketing rules:
[`docs/esti/HCW-UI-KIT.md`](docs/esti/HCW-UI-KIT.md).

---

## AI-Orchestration UX — the four questions

Traditional AI interfaces are conversation-first. HCW surfaces are **mission-first**:
the human supervises progress and manages *intent*; the AI manages *execution*. Every
AI surface must answer, in under 30 seconds:

1. **What is the mission?**
2. **What has been completed?**
3. **What requires my judgment?**
4. **What happens next?**

> The AI should not behave like a chatbot. It should behave like a disciplined
> engineering organization.

Framework: [`docs/ai-orchestration-ux-framework.md`](docs/ai-orchestration-ux-framework.md).
HCW/ESTI application: [`docs/esti/HCW-AI-ORCHESTRATION-UX.md`](docs/esti/HCW-AI-ORCHESTRATION-UX.md).

---

## Using the kit

Install as a git dependency (pin a commit for reproducibility):

```json
"@hcw/ui-kit": "github:HolagundiWorks/hcwux#<commit-sha>"
```

The package builds on install (`prepare` → `tsc` → `dist/`), so consumers get compiled
JS + type declarations. Mount:

```tsx
import {
  MuiRoot,
  ActionDockProvider,
  ActionDock,
  TaskbarFooter,
  GlassRail,
  Surface,
  useScreenActions,
} from "@hcw/ui-kit";

<MuiRoot>
  <ActionDockProvider>
    <GlassRail rail={<>…nav…</>}>
      <Surface layer="soft" sx={{ p: 2 }}>…</Surface>
    </GlassRail>
    <ActionDock />
    <TaskbarFooter left={…} center={…} right={…} />
  </ActionDockProvider>
</MuiRoot>
```

Brand font + portal chrome, once per app entry:

```ts
import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/500.css";
import "@fontsource/urbanist/600.css";
import "@fontsource/urbanist/700.css";
import "@hcw/ui-kit/portal-chrome.scss";
```

**Peers** (provided by the consuming app): `react`, `react-dom`, `@mui/material`,
`@mui/x-data-grid`, `@mui/x-date-pickers`, `@emotion/react`, `@emotion/styled`,
`dayjs`.

---

## Working on the kit

```bash
pnpm install      # installs dev deps; prepare builds dist/
pnpm build        # tsc -> dist/ (+ copies portal-chrome.scss)
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest (jsdom) — token/primitive/render contracts
```

**Redesign rule:** shared chrome changes land **once**, in this package
(`src/tokens.ts` → `src/chrome-sx.ts` → component → `src/portal-chrome.scss`).
App screens import kit primitives; they never own glass/radius recipes. Contribution,
semver, and deprecation policy: [`GOVERNANCE.md`](GOVERNANCE.md) ·
[`CHANGELOG.md`](CHANGELOG.md).

**Governance reading order:** [`docs/hcw-kit/README.md`](docs/hcw-kit/README.md) →
Constitution → AI-agent rulebook → HCW-UI-KIT + UX principles → debt register.

---

*HCW-UX · Human Centric Works · `@hcw/ui-kit`*
