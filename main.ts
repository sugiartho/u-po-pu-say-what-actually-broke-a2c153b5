// Say What Actually Broke — make.fun entry.
// Writes one brutal-truth error line to /output/entry.txt.
// Node 22, standard library only. No network, no dependencies.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? HERE;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const SOURCE = join(BOT_DIR, "LINE.txt");

function fail(message: string): never {
  throw new Error(`say-what-broke: ${message}`);
}

function readSource(): string {
  let raw: string;
  try {
    raw = readFileSync(SOURCE, "utf-8");
  } catch {
    fail(`cannot read ${SOURCE}`);
  }
  return raw.replace(/\r\n/g, "\n").replace(/\n$/, "");
}

function assertOneLine(text: string): void {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 200) {
    problems.push(`length ${text.length} is outside 1-200`);
  }
  if (text.trim().length === 0) problems.push("only whitespace");
  if (text.includes("\n")) problems.push("more than one line");
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(text)) {
    problems.push("control characters present");
  }
  if (text !== text.trim()) problems.push("leading or trailing whitespace");
  if (/TODO|FIXME|XXX/.test(text)) problems.push("placeholder text present");
  if (/  +/.test(text)) problems.push("double spaces present");
  if (!/[.!?]$/.test(text)) problems.push("does not end with terminal punctuation");
  if (problems.length > 0) fail(problems.join("; "));
}

function report(text: string): void {
  const bytes = Buffer.byteLength(text, "utf-8");
  console.log(`line ok: ${text.length} chars, ${bytes} bytes`);
}

function emit(text: string): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const target = join(OUT_DIR, "entry.txt");
  writeFileSync(target, text, "utf-8");
  const back = readFileSync(target, "utf-8");
  if (back !== text) fail("read-back mismatch after write");
  console.log(`wrote ${text.length} chars to ${target}`);
}

const line = readSource();
assertOneLine(line);
report(line);
emit(line);
