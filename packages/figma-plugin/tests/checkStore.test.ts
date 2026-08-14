import { describe, it, expect } from "vitest";
import {
  completedCheckState,
  emptyCheckState,
  failedCheckState,
  isLiveMessageVisible,
  progressingCheckState,
  reportForFocus,
  startingCheckState,
  summaryLine,
  type CheckFocus,
} from "../src/ui/state/checkStore";
import type { CheckReport } from "../src/core/check";

const report = {
  summary: {
    instanceCount: 1,
    mappedCount: 1,
    unmapped: 0,
    pass: 1,
    fail: 0,
    warn: 0,
    info: 0,
  },
  instances: [],
  findings: [],
} as unknown as CheckReport;

function summaryFor(partial: Partial<CheckReport["summary"]>): string {
  return summaryLine({
    ...report,
    summary: { ...report.summary, ...partial },
  } as CheckReport);
}

describe("check state transitions", () => {
  it("clears a previous error when a new check starts", () => {
    const errored = failedCheckState(emptyCheckState(), "boom", {
      code: "COLLECT_FAILED",
    });
    const next = startingCheckState(errored, "selection");
    expect(next.error).toBeNull();
    expect(next.errorCode).toBeNull();
    expect(next.running).toBe(true);
    expect(next.scanned).toBe(0);
    expect(next.liveMessage).toBe("Checking selection…");
    expect(next.focus).toBeNull();
  });

  it("clears prior results when nothing is selected", () => {
    const withReport = completedCheckState(
      emptyCheckState(),
      {
        report,
        snapshots: [],
        fileKey: "abc",
        fileName: "File",
        pageName: "Page 1",
        truncated: false,
        scanned: 1,
      },
      "Checked 1 component — 0 fail, 1 pass",
    );
    const next = failedCheckState(withReport, "Nothing is selected.", {
      code: "NO_SELECTION",
      clearResults: true,
    });
    expect(next.error).toBe("Nothing is selected.");
    expect(next.errorCode).toBe("NO_SELECTION");
    expect(next.report).toBeNull();
    expect(next.running).toBe(false);
  });

  it("keeps Catalog focus while checking a component", () => {
    const focus: CheckFocus = {
      catalogId: "canary.badge",
      exportName: "StatusBadge",
      figmaName: "❖StatusBadge",
    };
    const next = startingCheckState(emptyCheckState(), "selection", focus);
    expect(next.focus).toEqual(focus);
    expect(next.liveMessage).toBe("Checking selection for StatusBadge…");
  });

  it("tracks scan progress", () => {
    const next = progressingCheckState(emptyCheckState(), 120);
    expect(next).toMatchObject({
      running: true,
      scanned: 120,
      liveMessage: "Scanned 120 instances…",
    });
  });

  it("clears the error when a report arrives and preserves focus", () => {
    const focus: CheckFocus = {
      catalogId: "canary.badge",
      exportName: "StatusBadge",
      figmaName: "❖StatusBadge",
    };
    const errored = {
      ...failedCheckState(emptyCheckState(), "boom"),
      focus,
    };
    const next = completedCheckState(
      errored,
      {
        report,
        snapshots: [],
        fileKey: "abc",
        fileName: "File",
        pageName: "Page 1",
        truncated: false,
        scanned: 1,
      },
      "Checked 1 instances — 0 fail, 1 pass",
    );
    expect(errored.error).toBe("boom");
    expect(next.error).toBeNull();
    expect(next.running).toBe(false);
    expect(next.report).toBe(report);
    expect(next.focus).toEqual(focus);
  });
});

describe("summaryLine", () => {
  it("reads as one sentence for a clean single component", () => {
    expect(summaryFor({})).toBe("Checked 1 component — 0 fail, 1 pass");
  });

  it("calls out components that are not in the catalog", () => {
    expect(
      summaryFor({ instanceCount: 4, mappedCount: 1, unmapped: 3, pass: 1 }),
    ).toBe("Checked 4 components — 0 fail, 1 pass, 3 not in catalog");
  });

  it("never claims a pass when nothing could be verified", () => {
    const line = summaryFor({
      instanceCount: 4,
      mappedCount: 0,
      unmapped: 4,
      pass: 0,
    });
    expect(line).toBe("Checked 4 components — 0 fail, 0 pass, 4 not in catalog");
  });

  it("prefixes the Catalog export when focused", () => {
    expect(
      summaryLine(report, {
        catalogId: "canary.badge",
        exportName: "StatusBadge",
        figmaName: "❖StatusBadge",
      }),
    ).toBe("StatusBadge: Checked 1 component — 0 fail, 1 pass");
  });
});

describe("reportForFocus", () => {
  const mixed = {
    healthByCatalog: {
      "canary.badge": {
        catalogId: "canary.badge",
        score: 86,
        status: "needsAttention",
        blocked: false,
        blockers: [],
        evaluationCoverage: 75,
        automationCoverage: 50,
        dimensions: [],
      },
      "canary.button": {
        catalogId: "canary.button",
        score: 92,
        status: "healthy",
        blocked: false,
        blockers: [],
        evaluationCoverage: 87,
        automationCoverage: 80,
        dimensions: [],
      },
    },
    summary: {
      instanceCount: 2,
      mappedCount: 1,
      unmapped: 1,
      pass: 1,
      fail: 0,
      warn: 0,
      info: 1,
    },
    findings: [],
    instances: [
      {
        catalogId: "canary.badge",
        status: "checked",
        ok: true,
        findings: [],
        snapshot: { nodeId: "1:1", nodeName: "Badge" },
      },
      {
        status: "unmapped",
        ok: false,
        findings: [
          {
            code: "INFO_UNMAPPED",
            severity: "info",
            nodeId: "1:2",
            message: "Not in catalog",
          },
        ],
        snapshot: { nodeId: "1:2", nodeName: "prefix" },
      },
    ],
  } as unknown as CheckReport;

  it("returns the full report when there is no focus", () => {
    expect(reportForFocus(mixed, null)).toBe(mixed);
  });

  it("keeps only instances for the focused catalog id", () => {
    const focused = reportForFocus(mixed, {
      catalogId: "canary.badge",
      exportName: "StatusBadge",
      figmaName: "❖StatusBadge",
    });
    expect(focused.instances).toHaveLength(1);
    expect(focused.instances[0]?.catalogId).toBe("canary.badge");
    expect(focused.summary).toMatchObject({
      instanceCount: 1,
      mappedCount: 1,
      unmapped: 0,
      pass: 1,
    });
    expect(focused.healthByCatalog).toEqual({
      "canary.badge": mixed.healthByCatalog["canary.badge"],
    });
  });
});

describe("isLiveMessageVisible", () => {
  it("hides the live region while an error banner shows the same copy", () => {
    const errored = failedCheckState(
      emptyCheckState(),
      "Couldn’t read instances from the canvas.",
    );
    // Announced to assistive tech, but not printed twice on screen.
    expect(errored.liveMessage).toBe(errored.error);
    expect(isLiveMessageVisible(errored)).toBe(false);
  });

  it("shows progress and result messages", () => {
    expect(isLiveMessageVisible(progressingCheckState(emptyCheckState(), 5))).toBe(
      true,
    );
    expect(isLiveMessageVisible(emptyCheckState())).toBe(false);
  });
});
