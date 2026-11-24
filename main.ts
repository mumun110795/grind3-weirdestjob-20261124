// Weirdest Job Title: Blind Judge Showdown — entry writer.
//
// Holds a single job title, checks it against the competition gate
// (1 to 60 characters), and writes it as the only line of entry.txt
// inside the resolved output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: real org-chart grammar wrapped around a job that
// only exists because chatbots keep confidently making things up.
const JOB_TITLE = "Head of Apologies for the Hallucinating Chatbot";

const GATE_MIN = 1;
const GATE_MAX = 60;

function assertGatePasses(title: string): void {
  const length = [...title].length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `title is ${length} characters; the gate allows ${GATE_MIN}-${GATE_MAX}`,
    );
  }
  if (title.trim().length === 0) {
    throw new Error("title must not be blank");
  }
}

function outputDirectory(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  return fromEnv && fromEnv.trim() !== "" ? fromEnv : "/output";
}

function main(): void {
  assertGatePasses(JOB_TITLE);

  const dir = outputDirectory();
  // The output dir may be a mounted volume, so it is only ever created
  // (recursively) — never removed.
  mkdirSync(dir, { recursive: true });

  const target = join(dir, "entry.txt");
  writeFileSync(target, JOB_TITLE, "utf8");

  // Read the file back and check it matches the intended entry exactly:
  // a short or altered write would otherwise ship silently.
  const written = readFileSync(target, "utf8");
  if (written !== JOB_TITLE) {
    throw new Error(
      `entry.txt mismatch: expected ${JSON.stringify(JOB_TITLE)}, ` +
        `found ${JSON.stringify(written)}`,
    );
  }
  console.log(`wrote ${target} (${[...JOB_TITLE].length} chars)`);
}

main();
