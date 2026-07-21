// Perf bundle budget — asserts the built kit stays within a size ceiling.
// Runs in CI after `build`; fails the job if dist grows past the budget so kit
// bloat is caught at review time rather than in a consumer's bundle.
import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

// Ceiling for total gzipped dist JS. Raised to 50 KB with 1.3.0 orchestration /
// capacity / telemetry exports (~45.5 KB gzipped). Raise deliberately (with a
// CHANGELOG note) when the kit grows further.
const BUDGET_GZIP_KB = 50;

let raw = 0;
let gz = 0;
for (const f of readdirSync("dist")) {
  if (f.endsWith(".js")) {
    const b = readFileSync(join("dist", f));
    raw += b.length;
    gz += gzipSync(b).length;
  }
}

const gzKB = gz / 1024;
console.log(
  `dist JS: ${(raw / 1024).toFixed(1)} KB raw · ${gzKB.toFixed(1)} KB gzipped ` +
    `(budget ${BUDGET_GZIP_KB} KB gzipped)`,
);

if (gzKB > BUDGET_GZIP_KB) {
  console.error(`✗ bundle budget exceeded: ${gzKB.toFixed(1)} KB > ${BUDGET_GZIP_KB} KB gzipped`);
  process.exit(1);
}
console.log("✓ within bundle budget");
