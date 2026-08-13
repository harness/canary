import type { CheckReport } from "../../core/check";
import type { Finding, InstanceSnapshot } from "../../core/types";
import { componentDisplayName } from "../../core/match";
import { buildFigmaUrl } from "../../core/proposal";

export type HandoffInput = {
  fileName: string;
  fileKey: string | null;
  pageName: string;
  catalogLabel: string;
  report: CheckReport;
  openProposalTitles?: string[];
};

export function buildHandoffPack(input: HandoffInput): string {
  const { report } = input;
  const figmaUrl = buildFigmaUrl(input.fileKey ?? undefined, undefined);
  const result = `FAIL (${report.summary.fail}) / PASS (${report.summary.pass}) / WARN (${report.summary.warn}) / INFO (${report.summary.info})`;

  const failures = report.findings.filter((f) => f.severity === "fail");
  const failureLines =
    failures.length === 0
      ? ["- (none)"]
      : failures.map((f) => formatFailure(f));

  const proposalLines =
    input.openProposalTitles && input.openProposalTitles.length > 0
      ? input.openProposalTitles.map((t) => `- ${t}`)
      : ["- (none yet — use Propose on a failure)"];

  // Keys and names of anything the catalog could not identify: the one piece of
  // live-file data a catalog maintainer needs to add the missing mapping.
  const unmapped = report.instances.filter((i) => i.status === "unmapped");
  const unmappedSection =
    unmapped.length === 0
      ? []
      : [
          "### Not in catalog",
          ...unmapped.map((i) => formatUnmapped(i.snapshot)),
          "",
        ];

  return [
    "## Standards Check (DS Contracts)",
    `- File: ${input.fileName || "—"}`,
    `- Page: ${input.pageName || "—"}`,
    `- Catalog: ${input.catalogLabel}`,
    `- Result: ${result}`,
    `- Instances: ${report.summary.instanceCount} (mapped ${report.summary.mappedCount}, not in catalog ${report.summary.unmapped})`,
    `- Figma: ${figmaUrl ?? "—"}`,
    "",
    "### Failures",
    ...failureLines,
    "",
    ...unmappedSection,
    "### Open proposals",
    ...proposalLines,
    "",
  ].join("\n");
}

function formatUnmapped(s: InstanceSnapshot): string {
  const bits = [
    componentDisplayName(s),
    `node ${s.nodeId}`,
    s.componentKey ? `key ${s.componentKey}` : "no component key",
    s.componentSetKey ? `set key ${s.componentSetKey}` : null,
    s.componentSetName ? `set "${s.componentSetName}"` : null,
  ].filter(Boolean);
  return `- ${bits.join(" — ")}`;
}

function formatFailure(f: Finding): string {
  const bits = [
    f.catalogId ?? "unmapped",
    f.propName ? `\`${f.propName}\`` : null,
    f.message,
    f.nodeId ? `(node ${f.nodeId})` : null,
  ].filter(Boolean);
  return `- ${bits.join(" — ")}`;
}
