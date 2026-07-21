#!/usr/bin/env node

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  HARNESS_CODE_API_URL,
  authorHandle,
  buildPrUrl,
  parseCommitSubject,
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

  return pullRequests.map(mapHarnessPullReq);
}

function fetchFromGitLog() {
  const output = execSync(
    'git log origin/main -100 --format="%aI|%an|%s"',
    { cwd: CANARY_ROOT, encoding: "utf-8" },
  );

  const entries = [];

  for (const line of output.split("\n")) {
    if (!line.trim()) continue;

    const [mergedAt, authorName, ...subjectParts] = line.split("|");
    const subject = subjectParts.join("|");
    const parsed = parseCommitSubject(subject);
    if (!parsed) continue;

    const { prNumber, title } = parsed;
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

  if (entries.length === 0) {
    console.error("No changelog entries found.");
    process.exit(1);
  }

  writeFileSync(CHANGELOG_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Wrote ${CHANGELOG_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
