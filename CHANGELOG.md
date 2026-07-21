# @hcw/ui-kit changelog

All notable changes to the HCW Design System package. Versioning follows semver;
the package is workspace-consumed (source-only), so versions mark **design-contract**
changes, not npm releases.

## 0.6.0 — 2026-07-21

### Added
- **`LAYOUT` tokens** — Carbon-inspired shell/grid organisation without Carbon's
  visual language: 12-column grid (`columns`), gutter/margin 16, rail widths
  (240 / collapsed 56), 20/80 fractions, stage padding multipliers, content max
  width, taskbar height, dock clearance. `GlassRail` + `TASKBAR_HEIGHT` consume
  them.
- **`layoutSx`** recipes (`rail` · `stage` · `content` · `grid` · `page`) in
  `chrome-sx.ts` for consistent organisation at call sites.
- **Spacing mid-steps** — `SPACING.compact` (12) and `SPACING.section` (40),
  aligning the ladder with Carbon productive density while keeping HCW names.
- **Type hierarchy** — `TYPE_SCALE` gains `label` · `subtitle` · `heading` ·
  `display`; theme typography `fontSize`s and Taskbar clock wire from the ladder.
  Styleguide documents the full scale + 12-col grid specimen.

### Docs
- Token governance: grid · organisation · hierarchy contract (12-col MUI, not
  Carbon 16-col). MATERIAL-UI-DIRECTION + HCW-UI-KIT spatial table + KB borrow
  row updated.

## 0.5.3 — 2026-07-21

### Removed
- **Orchestra design exploration** — deleted the parallel indigo/Inter visual
  language (`tokens/orchestra.*`, `styleguide/`, `docs/design-system/`,
  `docs/ai-orchestration-ux-prototype.html`). AI-orchestration doctrine remains
  (`docs/ai-orchestration-ux-framework.md` · `docs/esti/HCW-AI-ORCHESTRATION-UX.md`);
  product UI uses `@hcw/ui-kit` only (Radiant Orange · Urbanist).

### Fixed
- **Scheme-aware accent helpers** — `hexToRgba`, `underlineAccent`,
  `glassAccentWash`, `focusRingFor`, `ddFlatFor`, `liquidGlassButtonFor` derive
  from the active scheme accent instead of baking light `#FF4F18` into underlines,
  washes, focus rings, Select hover, DataGrid selection hover, and liquid-glass
  glow. Theme + dark/HC recipes + chrome-sx consume them; `portal-chrome.scss`
  exposes `--hcw-accent` / `--hcw-accent-glow` (mirrors light `colors.accent`).
- **`docs/styleguide.html` high-contrast theme** — CSS + theme toggle now cycle
  light · dark · highContrast (`#C93A00` accent), matching `SCHEMES.highContrast`.

### Docs
- Clarified accent rule: fills/CTAs **and** active chrome glyph tints; body links
  stay slate. Noted `DATA_VIZ.orange` is a chart series hue, not the brand accent.

## 0.5.2 — 2026-07-12
