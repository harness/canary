export const HARNESS_ACCOUNT_ID = "l7B_kbSEQD2wjrM7PShm5w";
export const HARNESS_ORG = "PROD";
export const HARNESS_PROJECT = "Harness_Commons";
export const HARNESS_REPO = "canary";

export const HARNESS_CODE_REPO_BASE =
  process.env.HARNESS_CODE_REPO_BASE ??
  `https://harness0.harness.io/ng/account/${HARNESS_ACCOUNT_ID}/all/code/orgs/${HARNESS_ORG}/projects/${HARNESS_PROJECT}/repos/${HARNESS_REPO}`;

export const HARNESS_CODE_API_URL =
  process.env.HARNESS_CODE_API_URL ??
  `https://harness0.harness.io/gateway/code/api/v1/repos/${HARNESS_ACCOUNT_ID}/${HARNESS_ORG}/${HARNESS_PROJECT}/${HARNESS_REPO}/+/pullreq?routingId=${HARNESS_ACCOUNT_ID}`;

export const PAGE_SIZE = 10;

export function buildPrUrl(prNumber) {
  return `${HARNESS_CODE_REPO_BASE}/pulls/${prNumber}`;
}

export function buildPrApiUrl(prNumber) {
  return `https://harness0.harness.io/gateway/code/api/v1/repos/${HARNESS_ACCOUNT_ID}/${HARNESS_ORG}/${HARNESS_PROJECT}/${HARNESS_REPO}/+/pullreq/${prNumber}?routingId=${HARNESS_ACCOUNT_ID}`;
}

export function shouldSkipChangelog(title) {
  return /\[skip changelog\]/i.test(title);
}

export function authorHandle(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseCommitSubject(subject) {
  const match = subject.match(/\(#(\d+)\)\s*$/);
  if (!match) return null;

  const prNumber = Number(match[1]);
  const title = subject.replace(/\s*\(#\d+\)\s*$/, "").trim();

  return { prNumber, title };
}
