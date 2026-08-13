import { useEffect, useMemo, useState } from "preact/hooks";
import type { CheckReport, InstanceResult } from "../../core/check";
import type { Finding } from "../../core/types";
import {
  componentDisplayName,
  type CatalogIndex,
} from "../../core/match";
import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FindingRow } from "../components/FindingRow";
import { Spinner } from "../components/Spinner";
import {
  emptyCheckState,
  groupInstancesByCatalog,
  isLiveMessageVisible,
  reportForFocus,
  UNMAPPED_GROUP_LABEL,
  type CheckFocus,
  type CheckUiState,
} from "../state/checkStore";
import { buildHandoffPack } from "../lib/handoffPack";
import {
  PROBLEM_PAGE_SIZE,
  partitionInstances,
} from "../lib/checkList";

type Props = {
  state: CheckUiState;
  index: CatalogIndex;
  catalogLabel: string;
  onCheckSelection: () => void;
  onCheckPage: () => void;
  onSelectNode: (nodeId: string) => void;
  onPropose: (finding: Finding) => void;
  onCopyHandoff: (markdown: string) => void;
  onRetry?: () => void;
  onDismissError?: () => void;
};

type SectionSeverity = {
  fail: number;
  warn: number;
  info: number;
  pass: number;
};

type CheckSection = {
  key: string;
  kind: "catalog" | "unmapped";
  title: string;
  status?: string;
  meta: string;
  severity: SectionSeverity;
  items: InstanceResult[];
};

function sectionSeverity(items: InstanceResult[]): SectionSeverity {
  let fail = 0;
  let warn = 0;
  let info = 0;
  let pass = 0;
  for (const inst of items) {
    if (inst.status === "unmapped") {
      if (inst.findings.some((f) => f.severity === "fail")) fail += 1;
      else info += 1;
      continue;
    }
    if (inst.ok) pass += 1;
    else fail += 1;
    for (const f of inst.findings) {
      if (f.severity === "warn") warn += 1;
      if (f.severity === "info") info += 1;
    }
  }
  return { fail, warn, info, pass };
}

function buildSections(
  report: CheckReport,
  index: CatalogIndex,
  focus: CheckFocus | null,
): CheckSection[] {
  const groups = groupInstancesByCatalog(report.instances);
  const sections: CheckSection[] = [];

  for (const group of groups) {
    if (group.catalogId === UNMAPPED_GROUP_LABEL) {
      sections.push({
        key: "unmapped",
        kind: "unmapped",
        title: "Not in catalog",
        meta: `${group.items.length} instance${group.items.length === 1 ? "" : "s"} · couldn’t match to a catalog component`,
        severity: sectionSeverity(group.items),
        items: group.items,
      });
      continue;
    }

    const entry = index.entries.find((e) => e.id === group.catalogId);
    const title =
      focus?.catalogId === group.catalogId
        ? focus.exportName
        : (entry?.code.export ?? group.catalogId);
    const figmaName =
      focus?.catalogId === group.catalogId
        ? focus.figmaName
        : (entry?.figma.name ?? "—");
    const pkg = entry?.code.package ?? "";
    sections.push({
      key: group.catalogId,
      title,
      kind: "catalog",
      status: entry?.status,
      meta: [group.catalogId, `Figma: ${figmaName}`, pkg].filter(Boolean).join(" · "),
      severity: sectionSeverity(group.items),
      items: group.items,
    });
  }

  sections.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "unmapped" ? 1 : -1;
    return a.title.localeCompare(b.title);
  });

  return sections;
}

function severitySummary(s: SectionSeverity): string {
  const parts: string[] = [];
  if (s.fail) parts.push(`${s.fail} fail`);
  if (s.warn) parts.push(`${s.warn} warn`);
  if (s.info) parts.push(`${s.info} info`);
  if (s.pass) parts.push(`${s.pass} pass`);
  return parts.join(" · ") || "No findings";
}

function sectionDomId(key: string): string {
  return `check-section-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function InstanceBlock({
  inst,
  onSelectNode,
  onPropose,
}: {
  inst: InstanceResult;
  onSelectNode: (nodeId: string) => void;
  onPropose: (finding: Finding) => void;
}) {
  const findings =
    inst.findings.length > 0
      ? inst.findings
      : inst.status === "checked" && inst.ok
        ? [
            {
              code: "PASS" as const,
              severity: "pass" as const,
              nodeId: inst.snapshot.nodeId,
              catalogId: inst.catalogId,
              message: `All shared props OK for ${componentDisplayName(inst.snapshot)}`,
            },
          ]
        : [];
  const displayName = componentDisplayName(inst.snapshot);
  const layerName = inst.snapshot.nodeName;
  return (
    <div class="ds-instance">
      <p class="ds-instance-title">
        <span>{displayName}</span>
        <span class="ds-code">{inst.snapshot.nodeId}</span>
      </p>
      {layerName !== displayName ? (
        <p class="ds-finding-meta">Layer: {layerName}</p>
      ) : null}
      {findings.map((f: Finding, i: number) => (
        <FindingRow
          key={`${f.code}-${f.propName ?? i}`}
          finding={f}
          onSelect={onSelectNode}
          onPropose={onPropose}
        />
      ))}
    </div>
  );
}

export function CheckTab({
  state,
  index,
  catalogLabel,
  onCheckSelection,
  onCheckPage,
  onSelectNode,
  onPropose,
  onCopyHandoff,
  onRetry,
  onDismissError,
}: Props) {
  const focus = state.focus;
  const report = state.report
    ? reportForFocus(state.report, focus)
    : null;

  const sections = useMemo(
    () => (report ? buildSections(report, index, focus) : []),
    [report, index, focus],
  );

  // Focused component checks keep the full list; page/selection triage hides passes.
  const triageMode = !focus;

  const [showPasses, setShowPasses] = useState<Record<string, boolean>>({});
  const [problemLimit, setProblemLimit] = useState(PROBLEM_PAGE_SIZE);

  const reportKey = report
    ? `${report.summary.instanceCount}-${report.summary.fail}-${report.summary.pass}-${report.summary.unmapped}`
    : "";
  useEffect(() => {
    setProblemLimit(PROBLEM_PAGE_SIZE);
    setShowPasses({});
  }, [reportKey]);

  const totalProblems = useMemo(
    () =>
      triageMode
        ? sections.reduce(
            (n, s) => n + partitionInstances(s.items).problems.length,
            0,
          )
        : 0,
    [sections, triageMode],
  );

  const showJumps = sections.length > 1;

  const jumpTo = (key: string) => {
    document.getElementById(sectionDomId(key))?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  let problemsRendered = 0;

  return (
    <div>
      <div class="ds-row">
        <Button
          variant="primary"
          disabled={state.running}
          onClick={onCheckSelection}
        >
          Check selection
        </Button>
        <Button
          variant="secondary"
          disabled={state.running}
          onClick={onCheckPage}
        >
          Check page
        </Button>
        {report ? (
          <Button
            variant="ghost"
            size="sm"
            class="ds-row-end"
            aria-label="Copy check results"
            onClick={() =>
              onCopyHandoff(
                buildHandoffPack({
                  fileName: state.fileName,
                  fileKey: state.fileKey,
                  pageName: state.pageName,
                  catalogLabel,
                  report,
                }),
              )
            }
          >
            Copy results
          </Button>
        ) : null}
      </div>

      {state.running ? (
        <Spinner
          label={`Scanning… ${state.scanned ? `${state.scanned} instances` : ""}`}
        />
      ) : null}

      {state.error ? (
        <Banner
          tone={state.errorCode === "NO_SELECTION" ? "warn" : "fail"}
          actions={
            <>
              {onRetry && state.errorCode !== "NO_SELECTION" ? (
                <Button size="sm" variant="secondary" onClick={onRetry}>
                  Retry
                </Button>
              ) : null}
              {onDismissError ? (
                <Button size="sm" variant="ghost" onClick={onDismissError}>
                  Dismiss
                </Button>
              ) : null}
            </>
          }
        >
          {state.error}
        </Banner>
      ) : null}

      {state.truncated ? (
        <Banner tone="warn">
          Page scan hit the 2,000 instance cap — results may be incomplete. Narrow
          the page or check a selection instead.
        </Banner>
      ) : null}

      <div
        class={isLiveMessageVisible(state) ? "ds-live ds-live-visible" : "ds-live"}
        aria-live="polite"
        aria-atomic="true"
      >
        {state.liveMessage}
      </div>

      {!state.running && !report && !state.error ? (
        <EmptyState
          title="Select components to check"
          body="Select Canary components, then Check selection. Or Check page to scan everything on this page."
        />
      ) : null}

      {report && report.summary.instanceCount === 0 && !focus ? (
        <Banner tone="info">
          No component instances found here. Select a frame containing Canary
          components, or use Check page.
        </Banner>
      ) : null}

      {report && report.summary.instanceCount === 0 && focus ? (
        <Banner tone="warn">
          No {focus.exportName} instances in this selection. Select a{" "}
          {focus.figmaName} on the canvas, then Check selection for this
          component again — or use Check selection to scan everything selected.
        </Banner>
      ) : null}

      {report && report.summary.instanceCount > 0 ? (
        <Summary report={report} />
      ) : null}

      {showJumps ? (
        <div class="ds-check-jumps" role="navigation" aria-label="Jump to component">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              class={`ds-check-jump ${section.kind === "unmapped" ? "is-unmapped" : ""} ${section.severity.fail ? "has-fail" : ""}`}
              onClick={() => jumpTo(section.key)}
            >
              <span>{section.title}</span>
              {section.severity.fail > 0 ? (
                <span class="ds-check-jump-count">{section.severity.fail}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {sections.map((section) => {
        const { problems, passes } = triageMode
          ? partitionInstances(section.items)
          : { problems: section.items, passes: [] as InstanceResult[] };

        const remainingBudget = Math.max(0, problemLimit - problemsRendered);
        const visibleProblems = problems.slice(0, remainingBudget);
        problemsRendered += visibleProblems.length;
        const hiddenByCap = problems.length - visibleProblems.length;
        const passesOpen = Boolean(showPasses[section.key]);

        return (
          <section
            key={section.key}
            id={sectionDomId(section.key)}
            class={`ds-check-section ${section.kind === "unmapped" ? "is-unmapped" : ""}`}
          >
            <header class="ds-check-section-header">
              <h2 class="ds-entry-title">
                {section.title}
                {section.status ? (
                  <span class="ds-chip">{section.status}</span>
                ) : section.kind === "unmapped" ? (
                  <span class="ds-chip">unverified</span>
                ) : null}
              </h2>
              <p class="ds-finding-meta">{section.meta}</p>
              <p class="ds-check-section-severity">{severitySummary(section.severity)}</p>
            </header>

            {visibleProblems.map((inst) => (
              <InstanceBlock
                key={inst.snapshot.nodeId}
                inst={inst}
                onSelectNode={onSelectNode}
                onPropose={onPropose}
              />
            ))}

            {hiddenByCap > 0 ? (
              <p class="ds-check-more-hint">
                {hiddenByCap} more in this section (over the display cap)
              </p>
            ) : null}

            {triageMode && passes.length > 0 ? (
              <div class="ds-check-passes">
                <button
                  type="button"
                  class="ds-check-passes-toggle"
                  aria-expanded={passesOpen}
                  onClick={() =>
                    setShowPasses((prev) => ({
                      ...prev,
                      [section.key]: !prev[section.key],
                    }))
                  }
                >
                  {passesOpen
                    ? `Hide ${passes.length} pass${passes.length === 1 ? "" : "es"}`
                    : `${passes.length} pass${passes.length === 1 ? "" : "es"} (hidden)`}
                </button>
                {passesOpen
                  ? passes.map((inst) => (
                      <InstanceBlock
                        key={inst.snapshot.nodeId}
                        inst={inst}
                        onSelectNode={onSelectNode}
                        onPropose={onPropose}
                      />
                    ))
                  : null}
              </div>
            ) : null}
          </section>
        );
      })}

      {triageMode && totalProblems > problemLimit ? (
        <div class="ds-check-show-more">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProblemLimit((n) => n + PROBLEM_PAGE_SIZE)}
          >
            Show {PROBLEM_PAGE_SIZE} more
          </Button>
          <span class="hint">
            Showing {Math.min(problemLimit, totalProblems)} of {totalProblems}{" "}
            problems
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Severity-first counts on one line. Zero buckets stay visible — they are
 * information — but recede to secondary grey with a neutral dot; only the
 * buckets that actually fired take colour and weight.
 */
function Summary({ report }: { report: CheckReport }) {
  const s = report.summary;
  const counts = [
    { key: "fail", label: "Fail", value: s.fail },
    { key: "warn", label: "Warn", value: s.warn },
    { key: "info", label: "Info", value: s.info },
    { key: "pass", label: "Pass", value: s.pass },
  ];

  return (
    <div class="ds-summary" aria-label="Check summary">
      <ul class="ds-summary-counts">
        {counts.map((c) => (
          <li
            key={c.key}
            class={`ds-count ds-count-${c.key} ${c.value > 0 ? "is-active" : "is-zero"}`}
          >
            <span class="ds-count-value">{c.value}</span>
            <span class="ds-count-label">{c.label}</span>
          </li>
        ))}
      </ul>
      <p class="ds-summary-meta">
        {s.unmapped} not in catalog · {s.mappedCount}/{s.instanceCount} mapped
      </p>
    </div>
  );
}

export { emptyCheckState };
