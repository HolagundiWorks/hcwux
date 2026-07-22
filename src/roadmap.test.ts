import { describe, expect, it } from "vitest";
import { SCHEMES, CAPACITY } from "./tokens.js";
import { buildTokensJson, buildTokensCss, buildTokenExport } from "./token-export.js";
import { createHcwTheme } from "./theme.js";
import { createHcwRtlCacheOptions, DEFAULT_LOCALE } from "./rtl.js";

describe("token export (Figma bridge)", () => {
  it("exports every scheme role", () => {
    const json = buildTokensJson("1.4.0");
    for (const scheme of Object.keys(SCHEMES) as (keyof typeof SCHEMES)[]) {
      const roles = Object.keys(SCHEMES[scheme]).sort();
      expect(Object.keys(json.color[scheme]!).sort()).toEqual(roles);
    }
    expect(json.size.spacingUnit?.$value).toBe("8px");
    expect(json.capacity.decisionAlternatives?.$value).toBe(CAPACITY.decisionAlternatives);
    expect(json.$extensions["com.hcw.ui-kit"].version).toBe("1.4.0");
  });

  it("emits CSS custom properties for light and dark", () => {
    const css = buildTokensCss();
    expect(css).toContain("--hcw-color-accent:");
    expect(css).toContain('[data-hcw-scheme="dark"]');
    expect(css).toContain("--hcw-touch-target:");
    const { json, css: again } = buildTokenExport();
    expect(json.color.light).toBeDefined();
    expect(again).toContain(":root");
  });
});

describe("RTL foundation", () => {
  it("createHcwTheme sets theme.direction", () => {
    expect(createHcwTheme().direction).toBe("ltr");
    expect(createHcwTheme({ direction: "rtl" }).direction).toBe("rtl");
  });

  it("createHcwRtlCacheOptions keys by direction", () => {
    expect(createHcwRtlCacheOptions("ltr").key).toBe("hcw-ltr");
    expect(createHcwRtlCacheOptions("rtl", ["plugin"]).key).toBe("hcw-rtl");
    expect(createHcwRtlCacheOptions("rtl", ["plugin"]).stylisPlugins).toEqual(["plugin"]);
  });

  it("DEFAULT_LOCALE is en-IN", () => {
    expect(DEFAULT_LOCALE).toBe("en-IN");
  });
});
