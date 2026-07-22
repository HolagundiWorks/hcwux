// Emit dist/tokens.json + dist/tokens.css from the compiled token-export module.
// Runs after `tsc` so Figma Variables / Tokens Studio can import without TS.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { buildTokenExport } from "../dist/token-export.js";

mkdirSync("dist", { recursive: true });

let version = "0.0.0";
try {
  version = JSON.parse(readFileSync("package.json", "utf8")).version ?? version;
} catch {
  /* keep default */
}

const { json, css } = buildTokenExport(version);
writeFileSync("dist/tokens.json", `${JSON.stringify(json, null, 2)}\n`);
writeFileSync("dist/tokens.css", css.endsWith("\n") ? css : `${css}\n`);
console.log("wrote dist/tokens.json + dist/tokens.css");
