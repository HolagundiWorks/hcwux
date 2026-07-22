#!/usr/bin/env node
/**
 * Voice lint — warn on commanding ambient copy in kit src (docs optional via --docs).
 * Exit 0 always (warn mode) unless --strict.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const roots = process.argv.includes("--docs") ? ["src", "docs"] : ["src"];

const RULES = [
  { id: "are-you-sure", re: /Are you sure\?/g, hint: "Prefer VOICE.confirmHeadingSlip" },
  { id: "you-must", re: /\bYou must\b/gi, hint: "Prefer invitational wording (non-P0)" },
  { id: "do-not-ignore", re: /\bDo not ignore\b/gi, hint: "Prefer judgment invitation" },
  { id: "immediately", re: /\bAct immediately\b/gi, hint: "Reserve for P0 safety only" },
];

const SKIP = [
  /node_modules/,
  /dist\//,
  /CHANGELOG/,
  /HCW-UX-VOICE/,
  /voice-lint/,
  /\.test\./,
  /maturity\.test/,
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const p = join(dir, name);
    if (SKIP.some((r) => r.test(p))) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|md|html|mjs|js)$/.test(name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const r of roots) {
  for (const file of walk(join(root, r))) {
    const text = readFileSync(file, "utf8");
    const rel = relative(root, file);
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(text))) {
        const line = text.slice(0, m.index).split("\n").length;
        hits.push({ file: rel, line, rule: rule.id, hint: rule.hint, snip: m[0] });
      }
    }
  }
}

if (hits.length === 0) {
  console.log("voice-lint: clean");
  process.exit(0);
}

console.log(`voice-lint: ${hits.length} warning(s)`);
for (const h of hits.slice(0, 50)) {
  console.log(`  ${h.file}:${h.line}  [${h.rule}] ${h.snip} — ${h.hint}`);
}
if (hits.length > 50) console.log(`  … +${hits.length - 50} more`);
process.exit(strict ? 1 : 0);
