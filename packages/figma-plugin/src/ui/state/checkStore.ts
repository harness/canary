import type { CheckReport, InstanceResult } from "../../core/check";
import type { Finding, InstanceSnapshot, ProposalDraft } from "../../core/types";

export type CheckFocus = {
  catalogId: string;
  exportName: string;
  figmaName: string;
};

export type CheckUiState = {
  running: boolean;
  report: CheckReport | null;
  snapshots: InstanceSnapshot[];
  fileKey: string | null;
  fileName: string;
  pageName: string;
  truncated: boolean;
  scanned: number;
  error: string | null;
  /** Machine code for the current error, when known (e.g. NO_SELECTION). */
  errorCode: string | null;
  liveMessage: string;
  /** Set when Check was started from Catalog for one component. */
  focus: CheckFocus | null;
};

export const emptyCheckState = (): CheckUiState => ({
  running: false,
  report: null,
  snapshots: [],
  fileKey: null,
  fileName: "",
  pageName: "",
  truncated: false,
  scanned: 0,
  error: null,
  errorCode: null,
  liveMessage: "",
  focus: null,
});

export const startingCheckState = (
  prev: CheckUiState,
  scope: "selection" | "page",
  focus: CheckFocus | null = null,
): CheckUiState => ({
  ...prev,
  running: true,
  scanned: 0,
  error: null,
  errorCode: null,
  focus,
  liveMessage: focus
    ? `Checking selection for ${focus.exportName}…`
    : scope === "selection"
      ? "Checking selection…"
      : "Checking page…",
});

export const progressingCheckState = (
  prev: CheckUiState,
  scanned: number,
): CheckUiState => ({
  ...prev,
  running: true,
  scanned,
  liveMessage: `Scanned ${scanned} instances…`,
});

/**
 * The message is kept in `liveMessage` so screen readers announce it, but the
 * error banner is the visible surface — see `isLiveMessageVisible`.
 */
export const failedCheckState = (
  prev: CheckUiState,
  message: string,
  opts?: { code?: string | null; clearResults?: boolean },
): CheckUiState => ({
  ...prev,
  ...(opts?.clearResults
    ? {
        report: null,
        snapshots: [],
        truncated: false,
        scanned: 0,
        focus: null,
      }
    : {}),
  running: false,
  error: message,
  errorCode: opts?.code ?? null,
  liveMessage: message,
});

export const completedCheckState = (
  prev: CheckUiState,
  result: Pick<
    CheckUiState,
    | "report"
    | "snapshots"
    | "fileKey"
    | "fileName"
    | "pageName"
    | "truncated"
    | "scanned"
  >,
  liveMessage: string,
): CheckUiState => ({
  ...prev,
  ...result,
  running: false,
  error: null,
  errorCode: null,
  liveMessage,
});

/**
 * Errors already render in the banner; showing the live region too would print
 * the same sentence twice.
 */
export function isLiveMessageVisible(state: CheckUiState): boolean {
  return Boolean(state.liveMessage) && state.error === null;
}

export const UNMAPPED_GROUP_LABEL = "Not in catalog";

export function groupInstancesByCatalog(
  instances: InstanceResult[],
): Array<{ catalogId: string; items: InstanceResult[] }> {
  const map = new Map<string, InstanceResult[]>();
  for (const inst of instances) {
    const key = inst.catalogId ?? UNMAPPED_GROUP_LABEL;
    const list = map.get(key) ?? [];
    list.push(inst);
    map.set(key, list);
  }
  return [...map.entries()].map(([catalogId, items]) => ({ catalogId, items }));
}

function summarizeInstances(instances: InstanceResult[]): CheckReport["summary"] {
  let pass = 0;
  let fail = 0;
  let warn = 0;
  let info = 0;
  let unmapped = 0;
  let mappedCount = 0;

  for (const inst of instances) {
    if (inst.status === "unmapped") {
      unmapped += 1;
      if (inst.findings.some((f) => f.severity === "fail")) fail += 1;
      continue;
    }
    mappedCount += 1;
    if (inst.ok) pass += 1;
    else fail += 1;
    for (const f of inst.findings) {
      if (f.severity === "warn") warn += 1;
      if (f.severity === "info") info += 1;
    }
  }

  return {
    pass,
    fail,
    warn,
    info,
    unmapped,
    mappedCount,
    instanceCount: instances.length,
  };
}

/** Narrow a report to one catalog component (Catalog → Check focus). */
export function reportForFocus(
  report: CheckReport,
  focus: CheckFocus | null,
): CheckReport {
  if (!focus) return report;
  const instances = report.instances.filter((i) => i.catalogId === focus.catalogId);
  const findings = instances.flatMap((i) => i.findings);
  return {
    instances,
    findings,
    summary: summarizeInstances(instances),
  };
}

/** One-line result for the live region, e.g. after Check selection. */
export function summaryLine(report: CheckReport, focus?: CheckFocus | null): string {
  const s = report.summary;
  const noun = s.instanceCount === 1 ? "component" : "components";
  const counts = [`${s.fail} fail`, `${s.pass} pass`];
  if (s.unmapped > 0) counts.push(`${s.unmapped} not in catalog`);
  const base = `Checked ${s.instanceCount} ${noun} — ${counts.join(", ")}`;
  if (!focus) return base;
  return `${focus.exportName}: ${base}`;
}

export type ProposeSeed = Partial<ProposalDraft> & { fromFinding?: Finding };
