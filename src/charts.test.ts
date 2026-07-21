import { describe, expect, it } from "vitest";
import {
  CHART_CHROME,
  CHART_MARKERS,
  chartChromeFor,
  chartMarkerAt,
  chartRootSx,
  withChartSeriesColors,
} from "./charts.js";
import {
  DATA_VIZ,
  DATA_VIZ_DIVERGING,
  DATA_VIZ_SEMANTIC,
  DATA_VIZ_SEQUENTIAL,
  SCHEMES,
  chartAreaFill,
  chartColorAt,
  chartPalette,
  chartSeriesColors,
  divergingColors,
  sequentialColors,
} from "./tokens.js";

describe("data-viz palettes", () => {
  it("categorical helpers stay ordered and wrap", () => {
    expect(chartSeriesColors(3)[0]).toBe(DATA_VIZ.blue);
    expect(chartColorAt(0)).toBe(DATA_VIZ.blue);
    expect(chartColorAt(7)).toBe(DATA_VIZ.blue);
    expect(chartColorAt(-1)).toBe(DATA_VIZ.gray);
  });

  it("sequential and diverging sample closed ramps", () => {
    expect(DATA_VIZ_SEQUENTIAL.length).toBeGreaterThanOrEqual(5);
    expect(DATA_VIZ_DIVERGING.length).toBe(7);
    expect(sequentialColors(1)[0]).toBe(DATA_VIZ_SEQUENTIAL[3]);
    expect(sequentialColors(3)[0]).toBe(DATA_VIZ_SEQUENTIAL[0]);
    expect(sequentialColors(3)[2]).toBe(DATA_VIZ_SEQUENTIAL[DATA_VIZ_SEQUENTIAL.length - 1]);
    expect(divergingColors(3)[1]).toBe(DATA_VIZ.gray);
    expect(chartPalette("diverging", 5)).toHaveLength(5);
    expect(chartPalette("categorical", 2)).toEqual(chartSeriesColors(2));
  });

  it("semantic roles map to support / viz neutrals — not brand accent", () => {
    expect(DATA_VIZ_SEMANTIC.positive).toBe(SCHEMES.light.supportSuccess);
    expect(DATA_VIZ_SEMANTIC.negative).toBe(SCHEMES.light.supportError);
    expect(Object.values(DATA_VIZ_SEMANTIC)).not.toContain(SCHEMES.light.accent);
  });

  it("chartAreaFill builds a translucent band from a stroke", () => {
    expect(chartAreaFill(DATA_VIZ.blue, 0.2)).toBe("rgba(15, 98, 254, 0.2)");
  });
});

describe("chart chrome · markers · series wiring", () => {
  it("markers encode series without colour alone", () => {
    expect(chartMarkerAt(0)).toBe("circle");
    expect(chartMarkerAt(CHART_MARKERS.length)).toBe("circle");
    expect(new Set(CHART_MARKERS).size).toBe(CHART_MARKERS.length);
  });

  it("chrome follows the active scheme", () => {
    expect(CHART_CHROME.tickLabel).toBe(SCHEMES.light.textSecondary);
    expect(chartChromeFor(SCHEMES.dark).tooltipBg).toBe(SCHEMES.dark.ink);
    expect(chartChromeFor(SCHEMES.highContrast).gridStroke).toBe(
      SCHEMES.highContrast.borderSubtle,
    );
  });

  it("withChartSeriesColors fills missing colours and preserves overrides", () => {
    const wired = withChartSeriesColors(
      [{ id: "a", label: "A" }, { id: "b", label: "B", color: "#112233" }],
      { markers: true },
    );
    expect(wired[0]?.color).toBe(DATA_VIZ.blue);
    expect(wired[0]?.markerShape).toBe("circle");
    expect(wired[1]?.color).toBe("#112233");
    expect(wired[1]?.markerShape).toBe("square");
  });

  it("chartRootSx targets MUI X chart chrome selectors", () => {
    const sx = chartRootSx();
    expect(sx["& .MuiChartsAxis-tickLabel"].fill).toBe(CHART_CHROME.tickLabel);
    expect(sx["& .MuiChartsTooltip-root"].borderRadius).toBe(0);
  });
});
