// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import {
  CAPACITY,
  COGA,
  INTERRUPTION,
  STATUS_SHAPE,
  TRUST,
  VOICE,
} from "./tokens.js";
import { pushToast, resetToasts, useToasts } from "./Toast.js";
import {
  clearOutcome,
  publishOutcome,
  resetOutcomes,
  useActionOutcome,
} from "./ActionOutcome.js";
import { AwarenessStrip } from "./AwarenessStrip.js";
import { StatusDot } from "./StatusDot.js";

afterEach(cleanup);

function ToastProbe() {
  const list = useToasts();
  return (
    <div>
      <div data-testid="count">{list.length}</div>
      <div data-testid="kinds">{list.map((t) => t.kind).join(",")}</div>
    </div>
  );
}

function OutcomeLabel() {
  const o = useActionOutcome();
  return <div data-testid="outcome">{o?.label ?? "none"}</div>;
}

describe("CAPACITY · INTERRUPTION · TRUST · VOICE · COGA tokens", () => {
  it("caps working memory near Cowan's 4±1", () => {
    expect(CAPACITY.workingMemoryChunks).toBe(4);
    expect(CAPACITY.toastStack).toBe(INTERRUPTION.maxConcurrentToasts);
    expect(CAPACITY.openLoops).toBeLessThanOrEqual(CAPACITY.workingMemoryChunks);
    expect(CAPACITY.awarenessLines).toBe(3);
  });

  it("defines interruption, COGA floors, and invitational voice", () => {
    expect(INTERRUPTION.maxConcurrentToasts).toBe(2);
    expect(INTERRUPTION.maxAmbientMotion).toBe(1);
    expect(COGA.targetMinPx).toBe(44);
    expect(COGA.calmTargetMinPx).toBeGreaterThanOrEqual(COGA.targetMinPx);
    expect(TRUST.judgmentNeedsLabel).toMatch(/judgment would help/i);
    expect(VOICE.stance).toBe("empathic-partner");
    expect(VOICE.preferInvitation).toBe(true);
    expect(STATUS_SHAPE.critical).toBe("square");
  });
});

describe("toast interruption budget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetToasts();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("never keeps more than maxConcurrentToasts", () => {
    render(<ToastProbe />);
    act(() => {
      pushToast({ kind: "info", title: "A" }, 0);
      pushToast({ kind: "info", title: "B" }, 0);
      pushToast({ kind: "info", title: "C" }, 0);
    });
    expect(screen.getByTestId("count").textContent).toBe(String(INTERRUPTION.maxConcurrentToasts));
  });

  it("prefers dropping non-errors when trimming", () => {
    render(<ToastProbe />);
    act(() => {
      pushToast({ kind: "error", title: "Fail" }, 0);
      pushToast({ kind: "info", title: "A" }, 0);
      pushToast({ kind: "info", title: "B" }, 0);
    });
    expect(screen.getByTestId("kinds").textContent).toContain("error");
    expect(screen.getByTestId("count").textContent).toBe(String(INTERRUPTION.maxConcurrentToasts));
  });
});

describe("action outcome store", () => {
  beforeEach(() => resetOutcomes());

  it("publishes latest outcome for evaluation gulf closure", () => {
    render(<OutcomeLabel />);
    expect(screen.getByTestId("outcome").textContent).toBe("none");
    act(() => {
      publishOutcome({ status: "success", label: "Saved" });
    });
    expect(screen.getByTestId("outcome").textContent).toBe("Saved");
    act(() => {
      clearOutcome();
    });
    expect(screen.getByTestId("outcome").textContent).toBe("none");
  });
});

describe("AwarenessStrip", () => {
  it("renders Endsley ladder and caps open loops", () => {
    const loops = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      label: `Loop ${i}`,
    }));
    render(
      <AwarenessStrip
        state="Running"
        meaning="Half done"
        next="Approve drawing"
        judgment
        loops={loops}
      />,
    );
    expect(screen.getByText("Running")).toBeTruthy();
    expect(screen.getByText(/Your judgment would help here/i)).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(CAPACITY.openLoops);
  });

  it("returns null when idle", () => {
    const { container } = render(<AwarenessStrip />);
    expect(container.firstChild).toBeNull();
  });
});

describe("StatusDot shapes", () => {
  it("renders square and triangle marks without throwing", () => {
    const { rerender } = render(<StatusDot color="red" label="Critical" shape="square" />);
    expect(screen.getByText("Critical")).toBeTruthy();
    rerender(<StatusDot color="orange" label="Watch" shape="triangle" />);
    expect(screen.getByText("Watch")).toBeTruthy();
  });
});
