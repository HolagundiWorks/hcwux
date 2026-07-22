// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { KitRoot } from "./MuiRoot.js";

afterEach(cleanup);

describe("KitRoot direction · locale", () => {
  it("sets dir, lang, and data attributes", () => {
    const { container } = render(
      <KitRoot direction="rtl" locale="ar">
        <span>مرحبا</span>
      </KitRoot>,
    );
    const wrap = container.querySelector("[data-hcw-direction]");
    expect(wrap?.getAttribute("data-hcw-direction")).toBe("rtl");
    expect(wrap?.getAttribute("dir")).toBe("rtl");
    expect(wrap?.getAttribute("lang")).toBe("ar");
  });
});
