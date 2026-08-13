/**
 * Build GitHub issue deep-links for Path P proposals.
 */

const MAX_URL = 6000;

export function buildGitHubIssueUrl(opts: {
  repo: string; // org/repo
  title: string;
  body: string;
  labels?: string;
}): { url: string; bodyTruncated: boolean } {
  const repo = opts.repo
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
  const base = `https://github.com/${repo}/issues/new`;
  const params = new URLSearchParams();
  params.set("title", opts.title);
  if (opts.labels?.trim()) params.set("labels", opts.labels.trim());

  const withBody = `${base}?${params.toString()}&body=${encodeURIComponent(opts.body)}`;
  if (withBody.length <= MAX_URL) {
    return { url: withBody, bodyTruncated: false };
  }

  // Fall back: open issue without body (caller should copy markdown)
  return { url: `${base}?${params.toString()}`, bodyTruncated: true };
}
