// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FatigueOfferBanner } from "./FatigueOfferBanner.js";
import { HcwTelemetryRoot } from "./HcwTelemetryRoot.js";
import {
  clearLatestFatigueOffer,
  installFatigueTracking,
  resetFatigueSession,
  resetFatigueTrackingInstall,
} from "./fatigue.js";
import { FATIGUE, VOICE } from "./tokens.js";
import {
  clearUxEventObservers,
  logInterrupt,
  resetUxEventSink,
  setUxEventSink,
} from "./uxEvents.js";
import {
  exportSessionDecisionAudits,
  listSessionDecisionAudits,
  recordFreezeAudit,
  recordDecisionAudit,
  freezeDecision,
  resetDecisionAudit,
  setDecisionAuditSink,
} from "./decisionAudit.js";
import { estimateOrientMultiplier, isLoadRisk } from "./calibration.js";

afterEach(cleanup);

describe("FatigueOfferBanner", () => {
  beforeEach(() => {
    resetUxEventSink();
    clearUxEventObservers();
    resetFatigueTrackingInstall();
    resetFatigueSession();
    installFatigueTracking();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-22T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
    clearLatestFatigueOffer();
    resetUxEventSink();
    clearUxEventObservers();
    resetFatigueTrackingInstall();
    resetFatigueSession();
  });

  it("shows invitational offer from latest fatigue signal", () => {
    setUxEventSink(() => {});
    for (let i = 0; i < FATIGUE.interruptPerHourWarn; i++) logInterrupt("judgment", true);
    render(<FatigueOfferBanner onEnableCalm={() => {}} />);
    expect(screen.getByText(VOICE.fatigueCalmOffer)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try calm mode" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: VOICE.cancelLabel }));
    expect(screen.queryByText(VOICE.fatigueCalmOffer)).toBeNull();
  });

  it("supports controlled signal without auto store", () => {
    render(
      <FatigueOfferBanner
        signal={{
          kind: "session_duration",
          level: "watch",
          offer: VOICE.fatiguePauseOffer,
          at: Date.now(),
        }}
      />,
    );
    expect(screen.getByText(VOICE.fatiguePauseOffer)).toBeTruthy();
  });
});

describe("decision audit", () => {
  beforeEach(() => {
    resetDecisionAudit();
    resetUxEventSink();
  });

  it("records session ring, sink, and ux.audit", () => {
    const sunk: string[] = [];
    const events: string[] = [];
    setDecisionAuditSink((r) => sunk.push(r.action));
    setUxEventSink((name) => events.push(name));
    recordDecisionAudit({ decisionId: "d1", action: "opened", question: "Approve?" });
    recordFreezeAudit("d1", { chosen: "Yes", reason: "Within budget" });
    expect(listSessionDecisionAudits()).toHaveLength(2);
    expect(exportSessionDecisionAudits()[1]?.action).toBe("frozen");
    expect(sunk).toEqual(["opened", "frozen"]);
    expect(events.filter((e) => e === "ux.audit")).toHaveLength(2);
  });

  it("freezeDecision emits decision + audit", () => {
    const events: string[] = [];
    setUxEventSink((name) => events.push(name));
    freezeDecision("d2", { chosen: "Accent", reason: "Brand law", msOpen: 1200 });
    expect(events).toEqual(["ux.decision", "ux.audit"]);
    expect(listSessionDecisionAudits().at(-1)?.chosen).toBe("Accent");
  });
});

describe("HcwTelemetryRoot", () => {
  it("renders children and optional fatigue slot stays empty without signal", () => {
    render(
      <HcwTelemetryRoot fatigueOffer>
        <div>app</div>
      </HcwTelemetryRoot>,
    );
    expect(screen.getByText("app")).toBeTruthy();
  });
});

describe("calibration heuristics", () => {
  it("raises multiplier under overload", () => {
    expect(estimateOrientMultiplier({})).toBe(1);
    expect(estimateOrientMultiplier({ workingChunks: 7, interruptsLastHour: 12 })).toBeGreaterThan(1.2);
    expect(isLoadRisk({ workingChunks: 7, interruptsLastHour: 12, pendingDecisions: 8 })).toBe(true);
  });
});
