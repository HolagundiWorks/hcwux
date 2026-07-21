// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  CAPACITY,
  COGA,
  cogaFor,
  densityFor,
  createHcwTheme,
  enforceCapacity,
  assertCapacity,
  trimDockActions,
  KpiStrip,
  MissionHeader,
  ObjectiveList,
  PhaseStrip,
  ConfidenceBand,
  DecisionQueue,
  FreezeTable,
  setUxEventSink,
  resetUxEventSink,
  logUxEvent,
  publishOutcome,
  resetOutcomes,
  ActionDockProvider,
  ActionDock,
  useScreenActions,
  type DockAction,
} from "./index.js";

afterEach(() => {
  cleanup();
  resetUxEventSink();
  resetOutcomes();
});

describe("capacity enforcement", () => {
  it("trims and warns on overflow", () => {
    const events: Array<{ name: string; payload: Record<string, unknown> }> = [];
    setUxEventSink((name, payload) => events.push({ name, payload }));
    const items = [1, 2, 3, 4, 5, 6];
    expect(enforceCapacity("kpi", items)).toHaveLength(CAPACITY.kpiStrip);
    expect(events.some((e) => e.name === "ux.capacity_warn")).toBe(true);
    expect(assertCapacity("dock", 2)).toBe(2);
  });

  it("trimDockActions keeps primary/danger within cap", () => {
    const actions: DockAction[] = [
      { id: "a", label: "A", zone: "center", onClick: () => {}, tone: "default" },
      { id: "b", label: "B", zone: "center", onClick: () => {}, tone: "default" },
      { id: "c", label: "C", zone: "center", onClick: () => {}, tone: "default" },
      { id: "d", label: "D", zone: "right", onClick: () => {}, tone: "primary" },
      { id: "e", label: "E", zone: "left", onClick: () => {}, tone: "danger" },
      { id: "f", label: "F", zone: "center", onClick: () => {}, tone: "default" },
    ];
    const trimmed = trimDockActions(actions);
    expect(trimmed.length).toBe(CAPACITY.dockVisibleActions);
    expect(trimmed.map((a) => a.id)).toContain("d");
    expect(trimmed.map((a) => a.id)).toContain("e");
  });
});

describe("KpiStrip", () => {
  it("caps at CAPACITY.kpiStrip", () => {
    render(
      <KpiStrip
        items={[
          { id: "1", label: "A", value: "1" },
          { id: "2", label: "B", value: "2" },
          { id: "3", label: "C", value: "3" },
          { id: "4", label: "D", value: "4" },
          { id: "5", label: "E", value: "5" },
        ]}
      />,
    );
    expect(screen.getByLabelText("Key measures").querySelectorAll("li")).toHaveLength(
      CAPACITY.kpiStrip,
    );
  });
});

describe("orchestration primitives", () => {
  it("renders mission, objectives (capped), phase, confidence, decisions, freeze", () => {
    render(
      <>
        <MissionHeader title="Ship kit 1.3" status="Active" />
        <ObjectiveList
          items={Array.from({ length: 7 }, (_, i) => ({
            id: String(i),
            label: `Obj ${i}`,
          }))}
        />
        <PhaseStrip phase="Build" progress={0.4} eta="~2h" />
        <ConfidenceBand band="medium" />
        <DecisionQueue
          items={[
            {
              id: "d1",
              question: "Approve palette?",
              recommendation: "Keep Radiant Orange",
              alternatives: ["A", "B", "C", "D"],
            },
          ]}
        />
        <FreezeTable
          items={[{ id: "f1", label: "Accent", value: "Radiant Orange" }]}
        />
      </>,
    );
    expect(screen.getByLabelText("Mission").textContent).toContain("Ship kit 1.3");
    expect(screen.getByLabelText("Objectives").querySelectorAll("li")).toHaveLength(
      CAPACITY.railObjectives,
    );
    expect(screen.getByLabelText("Current phase").textContent).toContain("Build");
    expect(screen.getByLabelText("Medium confidence").textContent).toMatch(/confidence/i);
    expect(screen.getByLabelText("Pending decisions")).toBeTruthy();
    expect(screen.getByLabelText("Frozen decisions").textContent).toContain("Frozen");
  });
});

describe("COGA calm on theme / KitRoot metrics", () => {
  it("calm raises targets and bumps caption type", () => {
    expect(densityFor("comfortable", "calm").button).toBeGreaterThanOrEqual(COGA.calmTargetMinPx);
    expect(cogaFor("calm").type.caption).toBe(cogaFor("default").type.label);
    const calm = createHcwTheme({ coga: "calm" });
    const def = createHcwTheme();
    expect(calm.typography.caption.fontSize).not.toBe(def.typography.caption.fontSize);
    expect(densityFor("compact", "calm").input).toBeGreaterThanOrEqual(COGA.calmTargetMinPx);
  });
});

describe("logUxEvent + dock outcome coupling", () => {
  beforeEach(() => resetOutcomes());

  it("emits via sink", () => {
    const events: string[] = [];
    setUxEventSink((name) => events.push(name));
    logUxEvent("ux.orient", { surfaceId: "t10" });
    expect(events).toEqual(["ux.orient"]);
  });

  it("dock track+outcome publishes and logs", () => {
    const events: Array<{ name: string; payload: Record<string, unknown> }> = [];
    setUxEventSink((name, payload) => events.push({ name, payload }));

    function Screen() {
      useScreenActions(
        [
          {
            id: "save",
            label: "Save",
            zone: "right",
            tone: "primary",
            onClick: () => {},
            outcome: { status: "success", label: "Saved" },
            track: true,
          },
        ],
        [],
      );
      return <ActionDock />;
    }

    render(
      <ActionDockProvider>
        <Screen />
      </ActionDockProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(events.some((e) => e.name === "ux.dock")).toBe(true);
    expect(events.some((e) => e.name === "ux.outcome")).toBe(true);
  });

  it("publishOutcome emits ux.outcome", () => {
    const events: string[] = [];
    setUxEventSink((name) => events.push(name));
    act(() => {
      publishOutcome({ status: "success", label: "Ok" });
    });
    expect(events).toContain("ux.outcome");
  });
});
