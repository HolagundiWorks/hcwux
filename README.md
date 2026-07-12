# HCW-UI — the Human Centric Works design system

> **We shape our tools, and thereafter our tools shape us.** An interface is not a
> surface a person looks *at* — it is an environment a person thinks *inside*. Its
> materials are a language, and that language teaches the user, every second, what
> matters.

> ### Human Centric *Works* — not Human Centric *Design*.
> The name is the thesis. HCD is a school of *design*; **HCW is design that _works_.** We
> are not here to make interfaces that look human-centred in a portfolio — we are here to
> make the *work* **work** for the human doing it, under pressure. **Aesthetics serve
> function.** A design earns its place by doing its job, not by how it photographs. This
> is a UI/UX discipline built on **UX-first principles**, not a styling exercise.

**Human Centric Works** designs interfaces around the human's **cognitive state**, not
the software's feature list. Our user is not exploring — they are a professional
operating a tool every day, under pressure, while three other things demand their
attention. For that person the interface has one job: **reduce cognitive load, and
never add to it.** Everything below follows from that.

Where the candybar phone **embraced the screen** — dissolving physical keys into
software on the glass, a *UI-first* revolution — the AI era must **embrace the AI**: not
a chat box bolted to the interface, but a **UX-first** rethink of the workspace around
what the AI now does. The chat window is the physical keyboard of this era; we absorb it
the way the touchscreen absorbed the keyboard. (→
[Orchestration Lives in the Rail](docs/whitepapers/orchestration-lives-in-the-rail.md).)

This repository is the home of that philosophy and the system that enforces it: the
**white papers** (the *why*), the shipped kit `@hcw/ui-kit` (the *how*), and the
governance that keeps it honest. Consumed by the AORMS platform and every future HCW
surface.

---

## The thesis: depth encodes importance

Most design collapses to one of two failures. **Flatland** removes all depth and with
it all hierarchy — everything is equally present, so nothing is. The **glass carnival**
does the opposite: every card blurs, every surface floats, everything competes, and the
interface becomes noise dressed as sophistication.

We reject both. Depth — how far a material rises off the flat plane of the page — is
**not a stylistic choice. It is a scale of demand.** Three material languages stack
along that axis, and an element's material is chosen by its *role*, never by taste:

```
        ▲ demand for attention · actionability
        │
 GLASS  │   ████  the live layer     — "do something now"        (scarce)
        │
 SOFT   │   ▓▓▓▓  objects            — "you are working inside"  (deliberate)
        │
 FLAT   │   ░░░░  information at rest — "read / compare this"     (~90%)
        │
        └──────────────────────────────────────────────► the page
```

- **Flat (hyperminimalist)** — the ground plane and the default: tables, text,
  headings, the canvas. Fog-Gray field, Pure-White cards defined by *spacing and
  hairlines, not boxes*, Coal-Black ink, square corners, no shadow. When in doubt, an
  element is flat. *"I am reading and comparing data."*
- **Soft (neumorphic)** — objects you work *within*: dialogs, panels, widgets,
  recessed input wells. Gently extruded from the page so it reads as a discrete thing
  you have entered. *"I am inside a form."*
- **Glass (glassmorphism)** — the live layer, and the scarcest: button hover, CTAs,
  the ActionDock, priority alerts. Translucent — it lets the moving world show through,
  which is *why* it reads as alive. When glass appears, the eye goes to it, because
  glass is the only thing in the room that floats. *"This wants my click."*

The power isn't the three materials — it's the **progression**. **Flat → Soft →
Glass** is a gradient from *read this* → *operate this* → *act now*, consistent on
every surface, so a user learns one grammar once and reads every screen for free.
**Depth is only meaningful when it is scarce and structured** — so we ration the
higher tiers ruthlessly, and most of every screen stays calm and flat.

Two companions complete the language: **one accent** — Radiant Orange `#FF4F18`, spent
as sparingly as depth, on fills and CTAs only (links use slate) — and **square by
default**, where rounding is *itself* a signal reserved for things you act on (buttons,
dialogs, the dock).

→ The full argument: **[Depth Encodes Importance](docs/whitepapers/depth-encodes-importance.md)**.

---

## White papers

The philosophy underneath the system — read these before the tokens.

| Paper | What it argues |
| --- | --- |
| [**Depth Encodes Importance**](docs/whitepapers/depth-encodes-importance.md) | The three material languages — **flat → soft → glass** — as a scale of demand. Why the z-axis carries meaning, why glass is scarce, why the screen stays calm. |
| [**The Calm Interface**](docs/whitepapers/the-calm-interface.md) | Design for the operator under pressure, not the explorer. Chrome serves the task, one spatial model, disclose the next step, work without a mouse. |
| [**Orchestration Lives in the Rail**](docs/whitepapers/orchestration-lives-in-the-rail.md) | The core AI move — **content in the stage, orchestration in the rail, command at the bottom bar**. The chat window is the wrong shape for supervising an AI; HCW decomposes it. |
| [**AI-Orchestration UX**](docs/ai-orchestration-ux-framework.md) | Mission-first, not conversation-first. The human supervises *intent*; the AI manages *execution*. ([prototype](docs/ai-orchestration-ux-prototype.html)) |
| [**From the Report to the Model**](docs/whitepapers/from-report-to-model.md) | The spatial turn — from **flat reports to data modelled on the thing itself**. The DOS→GUI leap for information; why calm chrome lets the model speak. |

Index + governance rationale: [`docs/whitepapers/`](docs/whitepapers) ·
[`HCW-DESIGN-PLAYBOOK.md`](docs/HCW-DESIGN-PLAYBOOK.md).

---

## One spatial model, everywhere

The philosophy becomes a building — one geography on every surface, so muscle memory
does the work. Read it back through the depth law: the things that *act* are glass; the
thing you *read and work on* is flat.

- a glass **Rail** — *where am I? · nav · status* — fixed at the edge,
- a flat **Stage** — *the work: tables, editors* — scrolling independently,
- a glass **Taskbar footer** — *tools without leaving context*,
- a single global glass **ActionDock** — *destroy · create · commit* — the one place
  page-level intent lives.

Full spatial model + marketing dialects (clear glass · heading glass):
[`docs/esti/HCW-UI-KIT.md`](docs/esti/HCW-UI-KIT.md) · UX laws → shipped patterns:
[`docs/esti/HCW-UI-UX-PRINCIPLES.md`](docs/esti/HCW-UI-UX-PRINCIPLES.md).

---

## See it

**[`docs/styleguide.html`](docs/styleguide.html)** — a self-contained visual
styleguide (foundations · layers · components · elements · resources), open it in a
browser. The live interactive gallery is AORMS-Studio's `/design-system` route.

---

## For engineers

<details>
<summary>What's in this repo, consuming the kit, and working on it</summary>

### Repository

| Path | What |
| --- | --- |
| [`src/`](src) | `@hcw/ui-kit` — tokens, MUI theme, layered primitives (`Surface`, `GlassRail`, `ActionDock`, `HealthGlassOrb`, `TaskbarFooter`, `SectionDock`, `StatusDot`, `DataState`, `ConfirmModal`, `PageBreadcrumb`, `Avatar`, `BrandMark`, `MuiRoot`). |
| [`docs/whitepapers/`](docs/whitepapers) | The philosophy (above). |
| [`docs/esti/`](docs/esti) · [`docs/hcw-kit/`](docs/hcw-kit) | Foundations, UX principles, governance 00–13 (Constitution, tokens, component quality, templates, MUI mapping, audits, AI-agent rulebook). |
| [`docs/styleguide.html`](docs/styleguide.html) · [`docs/ai-orchestration-ux-prototype.html`](docs/ai-orchestration-ux-prototype.html) | Visual styleguide · AI-orchestration prototype. |

### Consuming the kit

Consumers get a **built** package (compiled JS + type declarations). Install as a git
dependency where git is available, or **vendor** the built `dist/` for self-contained
builds (AORMS `esti` vendors it — its Docker build has no git). Mount:

```tsx
import { MuiRoot, ActionDockProvider, ActionDock, TaskbarFooter,
         GlassRail, Surface, useScreenActions } from "@hcw/ui-kit";
import "@hcw/ui-kit/portal-chrome.scss";
```

Peers (app-provided): `react`, `react-dom`, `@mui/material`, `@mui/x-data-grid`,
`@mui/x-date-pickers`, `@emotion/react`, `@emotion/styled`, `dayjs`. Brand font:
Urbanist via `@fontsource/urbanist`. Full guide: [`docs/ADOPTING-THE-KIT.md`](docs/ADOPTING-THE-KIT.md).

### Working on the kit

```bash
pnpm install    # dev deps; prepare builds dist/
pnpm build      # tsc -> dist/ (+ copies portal-chrome.scss)
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest (jsdom)
pnpm size       # bundle budget
```

Agent contract + never-commit-dist workflow: [`CLAUDE.md`](CLAUDE.md). Shared chrome
changes land **once** here (`src/tokens.ts` → `src/chrome-sx.ts` → component →
`src/portal-chrome.scss`); apps never own glass/radius recipes. Semver + policy:
[`GOVERNANCE.md`](GOVERNANCE.md) · [`CHANGELOG.md`](CHANGELOG.md). Governance reading
order: [`docs/hcw-kit/README.md`](docs/hcw-kit/README.md).

</details>

---

*HCW-UI · Human Centric Works · `@hcw/ui-kit` — be calm, be consistent, be legible, get out of the way.*
