import type { Finding, ProposalDraft, ProposalType } from "./types.js";

export type ProposalContext = {
  authorName: string;
  figmaFileKey?: string;
  fileName?: string;
  pageName?: string;
  componentExport?: string;
};

const TYPE_LINES: Array<{ type: ProposalType; label: string }> = [
  { type: "shared", label: "shared API (code + Figma)" },
  { type: "designOnly", label: "designOnly (Figma ergonomics)" },
  { type: "codeOnly", label: "codeOnly (runtime)" },
  { type: "pattern", label: "pattern rule" },
  { type: "component", label: "new component" },
  { type: "token", label: "token" },
];

const SURFACE_LINES = [
  "Code (@harnessio/ui)",
  "Catalog (legal API & bindings)",
  "Code Connect",
  "Figma library",
  "Patterns",
  "Portal docs",
] as const;

function checked(on: boolean): string {
  return on ? "[x]" : "[ ]";
}

function surfaceSelected(surfaces: string[], label: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase();
  const set = new Set(surfaces.map(norm));
  if (set.has(norm(label))) return true;
  // Allow short aliases from callers / older drafts
  if (
    label.toLowerCase().startsWith("code") &&
    [...set].some((s) => s === "code" || s.startsWith("code "))
  )
    return true;
  if (
    label.toLowerCase().startsWith("catalog") &&
    [...set].some((s) => s.startsWith("catalog"))
  )
    return true;
  if (label === "Figma library" && (set.has("figma") || set.has("figma library")))
    return true;
  return false;
}

/**
 * Render Path P proposal markdown matching
 * 05-contribution-and-standards-check.md §5 template headings exactly.
 */
export function proposalToMarkdown(draft: ProposalDraft): string {
  const typeBlock = TYPE_LINES.map(
    ({ type, label }) => `- ${checked(draft.type === type)} ${label}`,
  ).join("\n");

  const surfacesBlock = SURFACE_LINES.map(
    (label) => `- ${checked(surfaceSelected(draft.surfaces, label))} ${label}`,
  ).join("\n");

  const designOnlyNote = draft.designOnlyNote?.trim() || "—";
  const acceptance = draft.acceptanceSuggestion?.trim() || "—";

  const authorLines = [
    draft.authorName.trim() || "—",
    "Link to branch / Figma frame",
    draft.figmaUrl?.trim() || "—",
  ];
  if (draft.catalogId) {
    authorLines.push(`Catalog: ${draft.catalogId}`);
  }

  return [
    `# Proposal: ${draft.title}`,
    "",
    "## Type",
    typeBlock,
    "",
    "## Problem",
    draft.problem,
    "",
    "## Attempted workaround",
    draft.attemptedWorkaround,
    "",
    "## Requested change",
    draft.requestedChange,
    "",
    "## Surfaces affected",
    surfacesBlock,
    "",
    "## Design-only note (if any)",
    designOnlyNote,
    "",
    "## Acceptance suggestion",
    acceptance,
    "",
    "## Author",
    ...authorLines,
    "",
  ].join("\n");
}

function nodeIdForUrl(nodeId: string): string {
  // Figma URLs use hyphenated node ids
  return nodeId.replace(":", "-");
}

export function buildFigmaUrl(
  fileKey: string | undefined,
  nodeId: string | undefined,
): string | undefined {
  if (!fileKey) return undefined;
  const base = `https://www.figma.com/design/${fileKey}`;
  if (!nodeId) return base;
  return `${base}?node-id=${nodeIdForUrl(nodeId)}`;
}

/**
 * Prefill a proposal draft from a Check finding.
 */
export function findingToProposalDefaults(
  finding: Finding,
  ctx: ProposalContext,
): Partial<ProposalDraft> {
  const fromFinding = finding.proposeDefaults ?? {};
  const figmaUrl =
    fromFinding.figmaUrl ??
    buildFigmaUrl(ctx.figmaFileKey, finding.nodeId);

  const exportName = ctx.componentExport ?? finding.catalogId ?? "Component";
  const prop = finding.propName;
  const actual = finding.actual;

  const title =
    fromFinding.title ??
    (prop && actual
      ? `Add ${finding.catalogId ?? exportName} ${prop} value "${actual}"`
      : `Proposal for ${finding.code} on ${finding.nodeId}`);

  const requestedChange =
    fromFinding.requestedChange ??
    (prop && actual
      ? `${exportName}.${prop} += "${actual}"`
      : finding.message);

  const problem =
    fromFinding.problem ??
    finding.message;

  const attemptedWorkaround =
    fromFinding.attemptedWorkaround ??
    (finding.expected?.length
      ? `Tried existing catalog values: ${finding.expected.join(", ")}`
      : "Reviewed catalog shared / designOnly lists.");

  return {
    ...fromFinding,
    title,
    type: fromFinding.type ?? "shared",
    problem,
    attemptedWorkaround,
    requestedChange,
    surfaces: fromFinding.surfaces ?? [
      "Code (@harnessio/ui)",
      "Catalog (legal API & bindings)",
      "Figma library",
    ],
    authorName: ctx.authorName,
    figmaFileKey: ctx.figmaFileKey,
    figmaNodeId: finding.nodeId,
    figmaUrl,
    catalogId: finding.catalogId ?? fromFinding.catalogId,
  };
}
