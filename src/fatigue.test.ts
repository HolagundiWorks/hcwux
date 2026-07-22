// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FATIGUE,
  VOICE,
} from "./tokens.js";
import {
  evaluateFatigue,
  getFatigueSnapshot,
  installFatigueTracking,
  pulseFatigueSession,
  resetFatigueSession,
  resetFatigueTrackingInstall,
  suggestFatigueCopy,
} from "./fatigue.js";
import {
  clearUxEventObservers,
  logDecision,
  logInterrupt,
  logOrient,
  logUxEvent,
  resetUxEventSink,
  setUxEventSink,
} from "./uxEvents.js";
import { enforceCapacity } from "./capacity.js";

describe("operational fatigue trackers", () => {
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
    resetUxEventSink();
    clearUxEventObservers();
    resetFatigueTrackingInstall();
    resetFatigueSession();
  });

  it("suggests invitational pause/calm copy", () => {
    expect(suggestFatigueCopy("session_duration")).toBe(VOICE.fatiguePauseOffer);
    expect(suggestFatigueCopy("capacity_burst")).toBe(VOICE.fatigueCalmOffer);
  });

  it("flags interrupt density and emits ux.fatigue_signal", () => {
    const events: Array<{ name: string; payload: Record<string, unknown> }> = [];
    setUxEventSink((name, payload) => events.push({ name, payload }));

    for (let i = 0; i < FATIGUE.interruptPerHourWarn; i++) {
      logInterrupt("judgment", true);
    }

    const fatigue = events.filter((e) => e.name === "ux.fatigue_signal");
    expect(fatigue.length).toBeGreaterThanOrEqual(1);
    expect(fatigue[0]?.payload.kind).toBe("interrupt_density");
    expect(fatigue[0]?.payload.offer).toBe(VOICE.fatigueCalmOffer);
    expect(getFatigueSnapshot().interruptsLastHour).toBe(FATIGUE.interruptPerHourWarn);
  });

  it("flags capacity burst via capacity_warn observations", () => {
    const events: string[] = [];
    setUxEventSink((name) => events.push(name));

    for (let i = 0; i < FATIGUE.capacityWarnBurst; i++) {
      enforceCapacity("kpi", [1, 2, 3, 4, 5]);
    }

    expect(events.filter((n) => n === "ux.fatigue_signal")).toContain("ux.fatigue_signal");
    expect(evaluateFatigue().some((a) => a.kind === "capacity_burst")).toBe(true);
  });

  it("tracks decision backlog and long-pending", () => {
    for (let i = 0; i < FATIGUE.pendingDecisionsWarn; i++) {
      logDecision(`d${i}`, "pending");
    }
    expect(evaluateFatigue().some((a) => a.kind === "decision_backlog")).toBe(true);

    resetFatigueSession();
    logDecision("slow", "pending");
    vi.advanceTimersByTime(FATIGUE.longPendingDecisionMs + 1);
    expect(pulseFatigueSession().some((a) => a.kind === "long_pending_decision")).toBe(true);
  });

  it("detects orientation slowing across samples", () => {
    logOrient("s1", 10_000);
    logOrient("s1", 11_000);
    logOrient("s1", 20_000);
    logOrient("s1", 22_000);
    expect(evaluateFatigue().some((a) => a.kind === "orient_slowing")).toBe(true);
  });

  it("cools repeat fatigue_signal emissions", () => {
    const events: string[] = [];
    setUxEventSink((name) => {
      if (name === "ux.fatigue_signal") events.push(name);
    });
    for (let i = 0; i < FATIGUE.interruptPerHourWarn; i++) logInterrupt("error", true);
    const first = events.length;
    for (let i = 0; i < FATIGUE.interruptPerHourWarn; i++) logInterrupt("error", true);
    expect(events.length).toBe(first);
    logUxEvent("ux.fatigue_signal", { kind: "test" }); // ignored by observer loop
  });
});
