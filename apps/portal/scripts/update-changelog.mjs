#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  authorHandle,
  buildPrApiUrl,
  buildPrUrl,
  shouldSkipChangelog,
} from "./changelog-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANGELOG_PATH = join(__dirname, "../src/data/changelog.json");

function extractSummary(body, title) {
  if (!body) return title;

  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("<!--") ||
      trimmed.startsWith("<details>") ||
      trimmed.startsWith("</details>") ||
      trimmed.startsWith("<summary>")
    ) {
      continue;
    }
    if (trimmed.length > 120) {
      return trimmed.slice(0, 117) + "...";
    }
    return trimmed;
  }

  return title;
}

async function fetchPrFromApi(prNumber) {
  const token = process.env.HARNESS_TOKEN || process.env.HARNESS_API_KEY;
  if (!token) return null;

  const response = await fetch(buildPrApiUrl(prNumber), {
    headers: { "x-api-key": token },
  });

  if (!response.ok) {
    throw new Error(`Harness API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function readEntries() {
  try {
    const parsed = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function main() {
  const prNumber = Number(process.env.PR_NUMBER);
  if (!Number.isFinite(prNumber) || prNumber <= 0) {
    console.error("Missing required environment variable: PR_NUMBER");
    process.exit(1);
  }

  let title = process.env.PR_TITLE?.trim() ?? "";
  let body = process.env.PR_BODY ?? "";
  let mergedAt = process.env.PR_MERGED_AT?.trim() ?? "";
  let author = process.env.PR_AUTHOR?.trim() ?? "";

  if (!title || !author || !mergedAt || !body) {
    try {
      const pr = await fetchPrFromApi(prNumber);
      if (pr) {
        title = title || pr.title?.trim() || `PR #${prNumber}`;
        body = body || pr.description || "";
        mergedAt =
          mergedAt ||
          (pr.merged ? new Date(pr.merged).toISOString() : new Date().toISOString());
        author =
          author ||
          authorHandle(pr.author?.display_name || pr.author?.uid || "unknown");
      }
    } catch (error) {
      console.warn(`Could not fetch PR #${prNumber} from Harness API: ${error.message}`);
    }
  }

  if (!title) {
    console.error("Missing PR title. Set PR_TITLE or HARNESS_TOKEN so the script can fetch it.");
    process.exit(1);
  }

  if (shouldSkipChangelog(title)) {
    console.log("Skipping changelog update: title contains [skip changelog]");
    return;
  }

  const entries = readEntries();

  if (entries.some((entry) => entry.prNumber === prNumber)) {
    console.log(`PR #${prNumber} already in changelog, skipping.`);
    return;
  }

  const entry = {
    prNumber,
    title,
    summary: extractSummary(body, title),
    url: buildPrUrl(prNumber),
    mergedAt: mergedAt || new Date().toISOString(),
    author: authorHandle(author || "unknown"),
  };

  entries.unshift(entry);
  writeFileSync(CHANGELOG_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Added changelog entry for PR #${prNumber}: ${title}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
