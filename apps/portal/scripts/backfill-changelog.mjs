#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  HARNESS_CODE_API_URL,
  authorHandle,
  buildPrUrl,
  parseCommitSubject,
  shouldSkipChangelog,
} from "./changelog-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANGELOG_PATH = join(__dirname, "../src/data/changelog.json");
const CANARY_ROOT = join(__dirname, "../../..");

const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? 10);
const fromGit = process.argv.includes("--from-git");

function extractSummary(description, title) {
  if (!description) return title;

  for (const line of description.split("\n")) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("<!--") ||
      trimmed.startsWith("<details>")
    ) {
      continue;
    }
    return trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed;
  }

  return title;
}

function mapHarnessPullReq(pr) {
  const title = pr.title?.trim() || `PR #${pr.number}`;
  return {
    prNumber: pr.number,
    title,
    summary: extractSummary(pr.description, title),
    url: buildPrUrl(pr.number),
    mergedAt: pr.merged ? new Date(pr.merged).toISOString() : new Date().toISOString(),
    author: authorHandle(pr.author?.display_name || pr.author?.uid || "unknown"),
  };
}

async function fetchFromHarnessApi() {
  const token = process.env.HARNESS_TOKEN || process.env.HARNESS_API_KEY;
  if (!token) {
    throw new Error("HARNESS_TOKEN or HARNESS_API_KEY is required for API backfill");
  }

  const url = `${HARNESS_CODE_API_URL}&state=merged&sort=merged&order=desc&limit=${limit}`;
  const response = await fetch(url, {
    headers: { "x-api-key": token },
  });

  if (!response.ok) {
    throw new Error(`Harness API error: ${response.status} ${response.statusText}`);
  }

  const pullRequests = await response.json();
  if (!Array.isArray(pullRequests)) {
    throw new Error("Unexpected Harness API response");
  }

  return pullRequests
    .map(mapHarnessPullReq)
    .filter((entry) => !shouldSkipChangelog(entry.title));
}

function deepenGitHistory() {
  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      cwd: CANARY_ROOT,
      encoding: "utf-8",
    }).trim();
    if (shallow !== "true") return;

    try {
      execFileSync("git", ["fetch", "--unshallow"], { cwd: CANARY_ROOT, stdio: "inherit" });
    } catch {
      execFileSync("git", ["fetch", "--deepen=100"], { cwd: CANARY_ROOT, stdio: "inherit" });
    }
  } catch {
    // Not a git checkout, or fetch is unavailable. git log uses whatever history we have.
  }
}

function gitLog(ref) {
  return execFileSync("git", ["log", ref, "-100", "--format=%aI|%an|%s"], {
    cwd: CANARY_ROOT,
    encoding: "utf-8",
  });
}

function fetchFromGitLog() {
  deepenGitHistory();

  let output;
  try {
    // HEAD works in detached CI/Netlify clones. origin/main often does not exist there.
    output = gitLog("HEAD");
  } catch {
    output = gitLog("origin/main");
  }

  const entries = [];

  for (const line of output.split("\n")) {
    if (!line.trim()) continue;

    const [mergedAt, authorName, ...subjectParts] = line.split("|");
    const subject = subjectParts.join("|");
    const parsed = parseCommitSubject(subject);
    if (!parsed) continue;

    const { prNumber, title } = parsed;
    if (shouldSkipChangelog(title)) continue;

    entries.push({
      prNumber,
      title,
      summary: title,
      url: buildPrUrl(prNumber),
      mergedAt,
      author: authorHandle(authorName),
    });

    if (entries.length >= limit) break;
  }

  return entries;
}

function readExistingEntries() {
  try {
    const parsed = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries) {
  const existing = readExistingEntries();

  if (entries.length === 0) {
    throw new Error("No changelog entries found.");
  }

  // A shallow clone can look like "only a few PRs ever merged". Never shrink
  // the committed changelog in that case.
  if (existing.length > entries.length) {
    console.warn(
      `Refusing to overwrite changelog.json (${existing.length} entries) with ${entries.length} entries. Likely a shallow clone.`,
    );
    return false;
  }

  writeFileSync(CHANGELOG_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Wrote ${CHANGELOG_PATH}`);
  return true;
}

async function main() {
  let entries;

  if (fromGit) {
    entries = fetchFromGitLog();
    console.log(`Backfilled ${entries.length} entries from git log.`);
  } else {
    try {
      entries = await fetchFromHarnessApi();
      console.log(`Backfilled ${entries.length} entries from Harness API.`);
    } catch (error) {
      console.warn(`${error.message}. Falling back to git log.`);
      entries = fetchFromGitLog();
      console.log(`Backfilled ${entries.length} entries from git log.`);
    }
  }

  writeEntries(entries);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
