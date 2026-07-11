# Artifact Components

Implements framework §9 (Artifact Workspace). Record class: **artifacts replace conversations** — they are the permanent, versioned outputs; chat is temporary input.

---

## 1. Artifact Card

### Purpose
One durable output — spec, audit, checklist, decision log, review — represented as a first-class object with type, version, freshness, and provenance.

### Anatomy

```
┌────────────────────────────────────┐
│ SPECIFICATION              v3      │  (overline type-tag · meta version)
│ Documentation Architecture        │  (card-title)
│ Structure, ownership and naming   │  (body, 1-line summary, truncated)
│ rules for all repository docs.    │
│ ─────────────────────────────────  │
│ ✓ current · AI · reviewed by you  │  (meta: freshness · author · review)
│ Updated 12m ago      ❄ frozen-ref │
└────────────────────────────────────┘
```

240–320px wide card, radius `md`, elevation 1 (2 on hover).

### Content rules
- **Type is a closed vocabulary** (one `overline` tag): Architecture · Specification · Checklist · Audit · Research · Decision Log · UI Review · Security Review · Test Report. New types require a system proposal.
- Title ≤ 50 chars; summary exactly one sentence, maintained by the AI on every version.
- Provenance is mandatory: author (AI / human / both), reviewed-by if any.

### States
| State | Treatment |
| --- | --- |
| Current | ✓ `progress-accent` freshness chip |
| Stale (inputs changed since last update) | "may be outdated" chip in `risk-medium` tones + what changed |
| Draft | Dashed border, "draft" chip |
| Superseded | `text-tertiary`, links forward to successor; never deleted |
| Frozen-referenced | ❄ chip — artifact backs a frozen decision; edits require thaw flow |

### Behavior
- Click → drill-down drawer with the rendered document. **Reading order inside:** summary → key points → full content → "Technical detail" (Level 1) disclosure last.
- Versioning is automatic on every AI edit; the drawer has a version rail (v1…vN) with human-readable change notes ("v3: restructured per architecture-first decision"), and any two versions diff in Review-mode comparison view.
- Artifacts are never deleted, only superseded or archived. Archive is human-initiated.

---

## 2. Artifact Workspace

### Purpose
The library view (rail destination "Artifacts") — where the permanent record lives and is browsed by meaning, not by upload date.

### Anatomy
Toolbar (filter by type · objective · freshness · author + search) over a card grid. Left edge: pinned **collections** auto-derived from structure: "Backs frozen decisions", "Needs your review", "Stale", plus per-objective groups.

### Content rules
- Default sort: recently updated. "Needs your review" collection, when non-empty, renders first and is the only visually accented group (`decision-subtle` header).
- Empty state teaches the model: "Artifacts are the permanent output of this mission — documents, audits and decisions. They appear here as the AI produces them."

### Behavior
- The workspace is the mission's **table of contents**, so it must stay small enough to scan: when a type group exceeds 12 cards, older ones auto-fold under "earlier (n)".
- Bulk export (zip / repo commit) preserves type folders and version history manifest.
- Search hits content, not just titles; results open the drawer scrolled to the match.

### Do / Don't
- **Do** route *all* meaningful AI output here. If something matters and isn't an artifact, the AI is talking instead of producing.
- **Don't** surface raw transcripts as artifacts. A conversation summary can become a Research note; the chat log itself stays Level 0/1.
- **Don't** allow untyped artifacts — "Misc" is where records go to die.
