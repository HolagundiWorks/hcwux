import { describe, expect, it } from "vitest";
import { createAormsTheme } from "./theme.js";
import { densityFor } from "./tokens.js";
import { layoutSx, searchFieldSx } from "./chrome-sx.js";

describe("density theme wiring", () => {
  it("compact theme shrinks tabs, inputs, and DataGrid row vars vs comfortable", () => {
    const comfy = createAormsTheme({ density: "comfortable" });
    const compact = createAormsTheme({ density: "compact" });
    const comfyTab = (comfy.components?.MuiTab?.styleOverrides?.root as { minHeight: number }).minHeight;
    const compactTab = (compact.components?.MuiTab?.styleOverrides?.root as { minHeight: number })
      .minHeight;
    expect(compactTab).toBeLessThan(comfyTab);
    expect(densityFor("compact").dataGridRow).toBe(36);
    const dg = compact.components?.MuiDataGrid?.styleOverrides?.root as Record<string, string>;
    expect(dg["--DataGrid-rowHeight"]).toBe("36px");
  });
});

describe("list · search recipes", () => {
  it("exposes listToolbar and searchFieldSx for T2 registers", () => {
    expect(layoutSx.listToolbar.display).toBe("flex");
    expect(searchFieldSx.maxWidth).toBe(360);
  });
});
