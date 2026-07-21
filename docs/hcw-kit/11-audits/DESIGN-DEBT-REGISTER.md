# Design debt register — LIVING

**The single queue of known design debt.** Every audit deposits here; every fix
withdraws. Agents: update this file in the same change that alters a fact
(Rulebook §14). Ordered by severity × reach. **Updated:** 2026-07-21.

## Open

**None.** D18 closed 2026-07-12 (3 raw-`fontSize`-on-text → `TYPE_SCALE`). Remaining
scope is **roadmap-class** (below) — product/design programmes, not design defects.

*Assessed & sanctioned (no change): `ZonalComplianceCalculator`'s centralised
9-colour SVG plot palette — canvas/SVG is an explicit token-rule exception; the
values are bespoke AA-tuned and don't map to categorical `DATA_VIZ`, so forcing
tokens would regress contrast.*

## Roadmap-class (not debt — tracked in 13-Roadmaps; require product/design programmes)

- **RTL / i18n** (ex-D15) — a product feature programme, not a design defect.
- **Figma library / variables bridge** (ex-D16) — design-tool deliverable outside agent reach.

## Component conformance (Quality-checklist §Gate)

| Component | Gate status |
| --- | --- |
| Surface, GlassRail, ActionDock, TaskbarFooter, SectionDock, HealthGlassOrb, BrandMark | ✓ shipped pre-checklist; re-audit opportunistically |
| StatusDot, DataState, ConfirmModal, PageBreadcrumb, ToastHost, Avatar | ✓ gate items met at promotion; render tests + visual-regression shipped |
| AwarenessStrip, ActionOutcomeBanner | ✓ promoted 0.7.0 with psychology suite |

## Retired (most recent first)

- 2026-07-21 · **UX psychology pack (0.7.0)** — Cowan capacity caps, interruption budget, AwarenessStrip (Endsley), ActionOutcome (Norman), ConfirmModal slip/mistake (Reason), StatusDot shapes (Treisman/Ware), form/empty contiguity (Mayer), TRUST/COGA tokens.
- 2026-07-21 · **Layout / hierarchy gap closure (0.6.0)** — Carbon density borrowed into HCW tokens only: `LAYOUT` + `layoutSx`, spacing `compact`/`section`, extended `TYPE_SCALE` wired through theme; 12-col grid contract documented (explicitly not Carbon 16-col / Plex / indigo).
- 2026-07-21 · **Orchestra dropped** — removed the parallel indigo/Inter exploration (`tokens/orchestra.*`, `styleguide/`, `docs/design-system/`, indigo mission-dashboard prototype). Single visual language: `@hcw/ui-kit` (Radiant Orange · Urbanist). Accent helpers made scheme-aware; styleguide gained high-contrast theme CSS.
- 2026-07-12 · **Actionable-gap sweep:** D18 closed (3 raw-`fontSize` → `TYPE_SCALE.kpi`/`.body2`; typecheck clean) · **Wizard template T9** documented in [05-TEMPLATES.md](../05-TEMPLATES.md) from `AccountHub.tsx` (catalog now T1–T9) · **perf bundle budget** added to hcwux CI (`scripts/size-budget.mjs`, 40 KB gzip ceiling; current ~29 KB) · ZonalCompliance SVG palette assessed → sanctioned (canvas/SVG exception; no regressioning recolor).
- 2026-07-12 · **D11 closed** — `Clients.tsx` `TagChip` fork (Carbon `--cds-tag-*` Chip) → kit `StatusDot`; both dialogs (New client · Create client login) gained `aria-labelledby` (WCAG 4.1.2). The last agent-actionable debt item — the Open queue is now empty.
- 2026-07-12 · **D3s closed** — owner signed off the dark & high-contrast schemes (accepted as shipped; the marketing-page "chrome stays light" label-cascade caveat is documented and accepted). The last human-gated theme item.
- 2026-07-11 · D2e VR in CI: added the `visual` job to `.github/workflows/ci.yml` (pinned `mcr.microsoft.com/playwright:v1.49.0-jammy`, builds + `vite preview` + asserts, uploads diffs on failure). Committed **linux baselines** generated in that same image — verified deterministic on a clean run — so CI is green on first run (win32 baselines kept for local dev). Vite `allowedHosts: [host.docker.internal]` added so container tooling can reach the dev server.
- 2026-07-11 · D2d VR baselines: 6 committed snapshots (`e2e/tests/visual-regression.spec.ts-snapshots/`, win32) — DS gallery top, 3 scheme specimens, primitives, landing hero; deterministic (reduced-motion + animations-disabled), verified green on a clean run. The very first run earned its keep — it made the dark/HC schemes visible to the agent for the first time and surfaced the marketing-page label-cascade caveat (documented in the specimen + D3s). → CI wiring = D2e
- 2026-07-11 · **Phase-D completion sweep:** D8c — `meta.errorTitle` adopted on **259 mutations across ~99 files** (5 agent batches; every user-facing mutation now titles its failure toast) · D1b — optimistic writes extended to `tasks.update` (shared `listInput`, instant status/priority flips) · D12 — Pagination/Stepper/PickerDay themed in the kit (0.5.0) · D14 — desktop token now fails CLOSED (no localStorage re-persist), `install-surface-tls.sh` provisions all 9 surface hosts, CSP `wss:` tightened to `wss://DOMAIN + *.DOMAIN` · D5 — zero live `@mui/x-charts` usage found; `DATA_VIZ` mandated on first use (mapping stays 🟨 govern-before-use) · D17 — [05-TEMPLATES.md](../05-TEMPLATES.md) documents 8 canonical page anatomies from shipped screens · D3 engineering — `MuiRoot({scheme})` + persisted Settings→Appearance switcher (preview-labelled) · D2c harness — Playwright VR spec + `visual` project (baselines = D2d)
- 2026-07-11 · D2b (render tests): jsdom + testing-library suite for all six promoted primitives (kit 0.4.1, **27 tests total**) — behaviour contracts incl. ConfirmModal's accessible name and DataState's loading/empty grammar → narrowed to D2c (VR snapshots)
- 2026-07-11 · D2 (gallery half): `/design-system` extended as the living gallery — StatusDot + Avatar specimens and a **Schemes section** (light/dark/HC toggle over a ThemeProvider'd specimen panel: buttons, inputs, Switch/Checkbox, StatusDot, Avatar, error alert). DOM-verified rendering in-browser. → narrowed to D2b (VR snapshots + render tests)
- 2026-07-11 · D10 Work tabs: merged Client/Consultant requests into one "Requests" tab (max 7 tabs; legacy slugs alias via `canonicalWorkTab`); NAVIGATION.md synced
- 2026-07-11 · D13 route focus: `RouteFocus` moves focus to `#esti-main` on SPA navigation (WCAG 2.4.3), skipping initial render
- 2026-07-11 · D6 dialog names: **106 dialogs across 64 files** gained `aria-labelledby` (WCAG 4.1.2); only the parallel-WIP `Clients.tsx` dialog remains (D11 scope)
- 2026-07-11 · D8b error context: `meta.errorTitle` mechanism live in the global query/mutation caches; exemplar adoption on all 6 Leads/Users mutations; convention codified in KB R8 → narrowed to D8c (incremental adoption)
- 2026-07-11 · D1 optimistic writes: pattern established at flagship sites (Leads status dropdown un-frozen + instant; Users enable/disable instant + toast) → narrowed to D1b
- 2026-07-11 · D4 canvas/SVG palettes: `DATA_VIZ` categorical token added (kit 0.4.0); PlanReaderPanel fully token-driven; ZonalCompliance palette centralised + 7px annotation darkened to hold AA
- 2026-07-11 · D7 loading grammar: 15 bare "Loading…" replaced with skeletons across 13 files (agent batch + PortalMinutes straggler)
- 2026-07-11 · D9 Office menu: grouped into Office/Finance ListSubheader groups (SectionMenu learned nested groups); NAVIGATION.md synced
- 2026-07-11 · Toast + Avatar promoted (0.3.0); first kit test suite (15 tests)
- 2026-07-11 · Dark/HC recipes implemented (0.2.0) → moved to D3 (sign-off)
- 2026-07-11 · PageBreadcrumb promoted (router-agnostic injection); last real-text inline fontSize cleared
- 2026-07-11 · KnowledgeBankPortal stale APIs + contract violations repaired; tree green
- 2026-07-11 · Kit governance: semver 0.1.0+, CHANGELOG, GOVERNANCE, sideEffects
- 2026-07-11 · Scheme layer + scale tokens + 8 controls themed (0.1.0)
- 2026-07-11 · StatusDot/DataState/ConfirmModal promoted; StatusTag delegates
- 2026-07-11 · A11y wave: nested-main, 44px targets, keyboard paths, skip link, aria-current, document.title, reduced-motion, autofill (24 files)
- 2026-07-11 · Licensing console filled TagChips → StatusDot (12 files)
