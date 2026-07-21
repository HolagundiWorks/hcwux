# MUI → HCW mapping

**Every MUI component in use, mapped to its HCW treatment.** MUI is the rendering
engine; HCW owns the appearance and the pattern (Constitution I). Inventory source:
distinct `@mui/material` imports across `frontend/src` (60 as of 2026-07-11 — keep
current via the MUI Specialist role).

**Treatment legend** — 🟦 **HCW primitive** (import from `@hcw/ui-kit`) ·
🟩 **themed** (use the MUI name; appearance fully owned by `createAormsTheme`) ·
⬜ **neutral** (layout/typography plumbing; sanctioned direct use) ·
🟥 **restricted** (use the HCW pattern instead) · 🟨 **gap** (not yet governed).

**Carbon marriage:** we borrow Carbon's **enterprise density / organisation**
(`LAYOUT`, `SPACING`, `DENSITY`, type ladder) and reject Carbon React, IBM Plex,
indigo, and 16-column Grid. App `--cds-*` is a frozen consumer compat layer —
never extended in the kit.

## Actions
| MUI | Treatment | HCW form |
| --- | --- | --- |
| Button | 🟩 themed | flat → glass-hover CTA; danger via `color="error"`; page-level CTAs go to **ActionDock** (`useScreenActions`), never inline |
| IconButton | 🟩 themed | density-sized in-content; persistent chrome ≥44px via `chromeIconSx` (`DENSITY.touchTarget`) |
| ToggleButton/Group | 🟩 themed | selected = accent wash |
| Fab / SpeedDial | 🟥 restricted | use ActionDock — no floating action buttons |

## Surfaces & structure
| MUI | Treatment | HCW form |
| --- | --- | --- |
| Paper / Card / CardActionArea | 🟩 themed (flat, square) | for lifted objects use 🟦 `Surface layer="soft|glass"` |
| Accordion (+Summary/Details) | 🟩 themed | hairline dividers, no boxes |
| Drawer | 🟩 themed | solid pop fill + hairline |
| AppBar | 🟩 themed | ribbon chrome (`AppRibbon` app shell) |
| Divider | ⬜ neutral | hairline via theme divider colour |
| Box / Stack / Grid / Container | ⬜ neutral | layout plumbing; **12-col** via `LAYOUT.columns` / `layoutSx.grid` — not Carbon 16-col |

## Inputs
| MUI | Treatment | HCW form |
| --- | --- | --- |
| TextField / OutlinedInput / FilledInput | 🟩 themed | neumorphic recessed wells (`NEU_INSET` recipes); default `size="small"` |
| Select / Autocomplete / MenuItem | 🟩 themed | DD_FLAT rest → button-like hover |
| Checkbox / Radio / Switch / Slider | 🟩 themed | accent-active, FOCUS_RING |
| InputAdornment / FormControlLabel / FormControl | ⬜ neutral | search: `TextField` + `sx={searchFieldSx}` + start adornment; toolbar: `sx={layoutSx.listToolbar}` |
| DatePicker (X) | 🟩 themed | field inherits inputs; popup `MuiPickerPopper` / `MuiDateCalendar` / `MuiPickerDay` / header — flat pop, accent selected day |

## Data display
| MUI | Treatment | HCW form |
| --- | --- | --- |
| Table family | 🟩 themed | structural headers, hairline rows |
| DataGrid (X) | 🟩 themed | transparent chrome, accent selection |
| Chip | 🟩 themed (square) | **status is never a filled Chip** → 🟦 `StatusDot`/app `StatusTag` |
| Avatar | 🟥 restricted | 🟦 kit `Avatar` (injected colour) / app `StaffAvatar` |
| Badge | 🟩 themed | accent primary |
| Tooltip | 🟩 themed | ink slab (`colors.ink`), square, token border |
| Typography | ⬜ neutral | variants only; micro-type via `TYPE_SCALE` |
| List family | 🟩 themed | selected = layer02; Subheader micro-uppercase; densified via `density`; toolbar `layoutSx.listToolbar` |
| Charts (X) | 🟩 governed | `chartPalette` / `withChartSeriesColors` + `chartRootSx`; categorical · sequential · diverging · semantic; markers via `CHART_MARKERS` (not colour alone); never brand accent as default series |

## Feedback
| MUI | Treatment | HCW form |
| --- | --- | --- |
| Alert / AlertTitle | 🟩 themed | standard error/warning = tinted glass (Layer 3); **filled** = solid support fills (ToastHost); info/success quiet when standard |
| Snackbar | 🟥 restricted | 🟦 kit `ToastHost` + `pushToast` |
| Dialog family | 🟩 themed (NEU_POP) | confirm-destroy via 🟦 `ConfirmModal`; must carry `aria-labelledby` |
| CircularProgress / LinearProgress / Skeleton | 🟩 themed | loading grammar via 🟦 `DataState` |
| Backdrop / Modal (raw) | 🟥 restricted | Dialog only |

## Navigation
| MUI | Treatment | HCW form |
| --- | --- | --- |
| Tabs / Tab | 🟩 themed | transparent + inset top alert line; height from `densityFor(...).tab` |
| Menu / Popover | 🟩 themed (FLAT_POP) | keyboard contract per AppRibbon pattern |
| Breadcrumbs | 🟥 restricted | 🟦 kit `PageBreadcrumb` (linkComponent injection) |
| Link | 🟩 themed | slate, never accent |
| Pagination / Stepper | 🟩 themed | PaginationItem accent-selected; StepIcon active/completed + connector hairline |

## HCW-only primitives (no MUI counterpart)
`Surface` · `GlassRail` · `ActionDock`/`useScreenActions` · `SectionDock` ·
`TaskbarFooter` · `HealthGlassOrb` · `BrandMark` · `StatusDot` · `DataState` ·
`ConfirmModal` · `PageBreadcrumb` · `ToastHost` · `Avatar`.

## Rule

A 🟥 usage or an un-themed 🟨 in new code is a compliance defect (register it).
When a 🟨 pattern is first needed seriously, it is governed (themed or wrapped)
**before** the feature ships — Constitution VI.
