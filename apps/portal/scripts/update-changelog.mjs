#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildPrUrl } from "./changelog-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANGELOG_PATH = join(__dirname, "../src/data/changelog.json");

const {
  PR_NUMBER,
  PR_TITLE,
  PR_BODY,
  PR_MERGED_AT,
  PR_AUTHOR,
} = process.env;

function requireEnv(name, value) {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

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

function main() {
  const prNumber = Number(requireEnv("PR_NUMBER", PR_NUMBER));
  const title = requireEnv("PR_TITLE", PR_TITLE);
  const mergedAt = requireEnv("PR_MERGED_AT", PR_MERGED_AT);
  const author = requireEnv("PR_AUTHOR", PR_AUTHOR);
  const url = buildPrUrl(prNumber);

  if (title.includes("[skip changelog]")) {
    console.log("Skipping changelog update: title contains [skip changelog]");
    return;
  }

  let entries = [];
  try {
    entries = JSON.parse(readFileSync(CHANGELOG_PATH, "utf-8"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Failed to read ${CHANGELOG_PATH}: ${err.message}`);
      process.exit(1);
    }
  }

  if (entries.some((entry) => entry.prNumber === prNumber)) {
    console.log(`PR #${prNumber} already in changelog, skipping.`);
    return;
  }

  const entry = {
    prNumber,
    title,
    summary: extractSummary(PR_BODY, title),
    url,
    mergedAt,
    author,
  };

  entries.unshift(entry);
  writeFileSync(CHANGELOG_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Added changelog entry for PR #${prNumber}: ${title}`);
}

main();
