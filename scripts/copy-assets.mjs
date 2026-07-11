// Copy non-TS assets (SCSS) into dist after the tsc build.
// The kit ships `@hcw/ui-kit/portal-chrome.scss` as a side-effect stylesheet;
// tsc does not emit it, so copy it alongside the compiled JS.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/portal-chrome.scss", "dist/portal-chrome.scss");
console.log("copied src/portal-chrome.scss -> dist/portal-chrome.scss");
