/**
 * Build Jira issue deep-links for Path P proposals.
 */

const MAX_URL = 6000;

export function buildJiraIssueUrl(opts: {
  siteUrl: string;
  projectId: string;
  issueTypeId: string;
  summary: string;
  description: string;
  labels?: string;
}): { url: string; descriptionTruncated: boolean } {
  const siteUrl = opts.siteUrl.trim().replace(/\/+$/u, "");
  const base = `${siteUrl}/secure/CreateIssueDetails!init.jspa`;
  const params = new URLSearchParams();
  params.set("pid", opts.projectId.trim());
  params.set("issuetype", opts.issueTypeId.trim());
  params.set("summary", opts.summary);
  for (const label of opts.labels?.split(",").map((value) => value.trim()) ?? []) {
    if (label) params.append("labels", label);
  }

  const withDescription = `${base}?${params.toString()}&description=${encodeURIComponent(opts.description)}`;
  if (withDescription.length <= MAX_URL) {
    return { url: withDescription, descriptionTruncated: false };
  }

  return {
    url: `${base}?${params.toString()}`,
    descriptionTruncated: true,
  };
}
