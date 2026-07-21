# AI Orchestration UX Framework

**Designing AI interfaces for reduced cognitive fatigue.**

> **Core Principle** — The interface should adapt to the user's **cognitive role**, not the AI's implementation role.

**HCW / ESTI application:** [`esti/HCW-AI-ORCHESTRATION-UX.md`](esti/HCW-AI-ORCHESTRATION-UX.md) adapts this doctrine to AORMS using HCW kit primitives (`@hcw/ui-kit`). There is no parallel visual language — product UI uses the kit's Radiant Orange / Urbanist tokens only.

---

## 1. Vision

Traditional AI interfaces are conversation-first. The future AI interface should be **mission-first**.

Instead of reading conversations, the user should supervise progress. The AI becomes an autonomous execution engine while the human remains the architect and decision maker.

---

## 2. Design Philosophy

### 2.1 Human Role

The user is **not the implementer**. The user is one of:

- Architect
- Product Owner
- Engineering Manager
- Domain Expert
- Orchestrator

The interface should therefore present information at the level of **decisions** rather than implementation.

### 2.2 AI Role

The AI is responsible for:

- Planning
- Executing
- Validating
- Reporting
- Requesting clarification only when necessary

The AI should not continuously expose implementation details.

---

## 3. Cognitive Principles

| Minimize | Maximize |
| --- | --- |
| Decision fatigue | Situation awareness |
| Context switching | Mission clarity |
| Working memory load | Progress visibility |
| Information overload | Confidence |
| Re-reading conversations | Executive control |

---

## 4. Interface Hierarchy

Information should be layered:

```
Mission
    ↓
Objectives
    ↓
Current Phase
    ↓
Progress
    ↓
Pending Decisions
    ↓
Risks
    ↓
Artifacts
    ↓
Implementation
```

Implementation should always be the deepest layer. Most users should rarely need to open it.

---

## 5. Default Dashboard

### 5.1 Mission

A single sentence.

> **Example:** Build Repository Cleanup Framework

### 5.2 Objectives

Maximum **5** objectives.

> **Example**
>
> - Remove legacy code
> - Archive deprecated documentation
> - Update references
> - Validate links
> - Produce release-ready repository

### 5.3 Current Phase

Phases include:

- Discovery
- Architecture
- Implementation
- Validation
- Documentation
- Review
- Complete

Display: **Current Phase** · **Progress** · **Estimated Completion**

### 5.4 Progress

Instead of a conversation, display **Completed / In Progress / Remaining**.

> **Example**
>
> **Completed**
> - ✓ Repository scanned
> - ✓ Dead code identified
> - ✓ Legacy docs archived
>
> **In Progress**
> - • Documentation update
>
> **Remaining**
> - • Link validation
> - • Final review

### 5.5 AI Activity Feed

Not a chat. Display:

| Field | Example |
| --- | --- |
| Currently Working On | Updating documentation |
| Expected Duration | 2 minutes |
| Next Step | Validate cross references |

No code shown.

---

## 6. Pending Decisions

**This is the highest priority section.** Only display decisions requiring human judgment.

Each decision card contains:

- Question
- Recommended option
- Alternative options
- Impact
- Deadline

> **Example — Decision Required**
>
> | Field | Value |
> | --- | --- |
> | Question | Choose documentation structure |
> | Recommendation | Architecture-first |
> | Impact | Affects entire repository |
> | Time required | 1 minute |

---

## 7. Frozen Decisions

Inspired by the Engineering Design Freeze and Military Command Intent. These decisions **cannot change without explicit approval**.

> **Example**
>
> | Decision | Value |
> | --- | --- |
> | Design System | HCW-UI-Kit |
> | Architecture | pnpm monorepo |
> | Language | TypeScript |
> | Database | PostgreSQL |
> | Security Standard | OWASP |

Frozen decisions reduce AI drift.

---

## 8. Risk Dashboard

The AI continuously reports risks by severity.

> **Example**
>
> | Severity | Risk |
> | --- | --- |
> | High | Authentication inconsistency |
> | Medium | Duplicate documentation |
> | Low | Minor formatting differences |

---

## 9. Artifact Workspace

**Artifacts replace conversations.** Artifacts include:

- Architecture documents
- Specifications
- Checklists
- Audit reports
- Research notes
- Design decisions
- Decision logs
- UI reviews
- Security reviews
- Testing reports

Artifacts are **versioned**. Conversation is temporary; artifacts are permanent.

---

## 10. Executive Summary

Always available. Maximum **one screen**. Contains:

- Mission status
- Overall progress
- Open decisions
- Current risks
- Next milestone
- Confidence score

Nothing more.

---

## 11. Drill-Down Model

Information expands only when requested:

```
Mission
    ↓
Objectives
    ↓
Artifacts
    ↓
Technical Summary
    ↓
Implementation
    ↓
Code
```

**Never expose implementation by default.**

---

## 12. AI Communication Rules

Instead of saying:

> "I updated the repository."

Say:

> **Mission Update — Documentation Cleanup**
>
> | Field | Value |
> | --- | --- |
> | Status | Completed |
> | Next | Archive deprecated guides |
> | Waiting for | No action required |
> | Estimated completion | 3 minutes |

---

## 13. AI Reporting Levels

### Level 0 — Internal AI *(hidden)*

- Chain of thought
- Internal planning
- Intermediate reasoning

### Level 1 — Engineering *(visible on demand)*

- Code
- APIs
- Technical logs
- Database changes

### Level 2 — Orchestrator *(default, visible)*

- Mission
- Progress
- Risks
- Pending decisions
- Artifacts
- Confidence
- Next actions

### Level 3 — Executive *(one-page overview)*

- Mission
- KPIs
- Milestones
- Budget
- Timeline
- Health

---

## 14. Cognitive State Support

### 14.1 Design Mode

| Aspect | Behavior |
| --- | --- |
| Environment | Silence |
| Interface | Canvas, whiteboard, research, mind maps |
| AI behavior | Explore, challenge assumptions, generate options, **no implementation** |

### 14.2 Transition Mode

| Aspect | Behavior |
| --- | --- |
| Interface | Decision summary, design freeze, execution plan, checklist |
| AI behavior | Compress, summarize, lock decisions, prepare execution |

### 14.3 Orchestration Mode

| Aspect | Behavior |
| --- | --- |
| Interface | Mission dashboard, artifacts, progress, decision queue, risk board |
| AI behavior | Execute, monitor, report, escalate |

### 14.4 Execution Mode

| Aspect | Behavior |
| --- | --- |
| Interface | Focused editor, minimal navigation, no notifications, music enabled (user preference) |
| AI behavior | Assist only when requested; avoid introducing new design ideas |

### 14.5 Review Mode

| Aspect | Behavior |
| --- | --- |
| Interface | Comparison view, quality reports, validation results, change summary |
| AI behavior | Audit, critique, suggest improvements; do not redesign architecture unless requested |

---

## 15. Notification Policy

**Only interrupt the user for:**

- Strategic decisions
- Blockers
- Conflicting requirements
- Failed validation
- Mission completion

**Never interrupt for:**

- Progress updates
- Intermediate implementation
- Routine generation
- Minor improvements

---

## 16. Success Metrics

Measure interface success by:

- Reduced context switching
- Fewer unnecessary AI interruptions
- Lower cognitive load
- Faster decision making
- Higher artifact completion rate
- Reduced conversation length
- Increased mission completion rate

---

## 17. Guiding Principle

> The AI should not behave like a chatbot. It should behave like a **disciplined engineering organization**.

The human should never manage implementation. The human should manage **intent**. The AI should manage **execution**.

The interface should continuously answer four questions:

1. What is the mission?
2. What has been completed?
3. What requires my judgment?
4. What happens next?

**If the user can answer those four questions in under 30 seconds, the interface is succeeding.**
