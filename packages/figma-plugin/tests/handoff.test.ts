import { describe, it, expect } from "vitest";
import { buildHandoffPack } from "../src/ui/lib/handoffPack";
import { buildJiraIssueUrl } from "../src/ui/lib/issueLinks";
import type { CheckReport } from "../src/core/check";

const report: CheckReport = {
  healthByCatalog: {
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
  findings: [
    {
      code: "FAIL_SHARED_VALUE",
      severity: "fail",
      nodeId: "1:2",
      catalogId: "canary.button",
      propName: "variant",
      message: 'variant "subtle" not allowed',
    },
  ],
  instances: [],
  summary: {
    pass: 8,
    fail: 2,
    warn: 0,
    info: 1,
    unmapped: 0,
    instanceCount: 10,
    mappedCount: 10,
  },
};

describe("buildHandoffPack", () => {
  it("includes summary and failures", () => {
    const md = buildHandoffPack({
      fileName: "Product",
      fileKey: "ABC",
      pageName: "Home",
      catalogLabel: "Canary (Harness) 0.1.0",
      report,
      openProposalTitles: ['Add variant "subtle"'],
    });
    expect(md).toContain("## Standards Check (Canary Copilot)");
    expect(md).toContain("FAIL (2) / PASS (8)");
    expect(md).toContain("canary.button");
    expect(md).toContain('Add variant "subtle"');
    expect(md).toContain("https://www.figma.com/design/ABC");
    expect(md).toContain("canary.button: 92/100 healthy");
    expect(md).toContain("evidence 87%, automated 80%");
  });

  it("lists keys for anything not in the catalog", () => {
    const md = buildHandoffPack({
      fileName: "Product",
      fileKey: "ABC",
      pageName: "Home",
      catalogLabel: "Canary (Harness) 0.1.0",
      report: {
        ...report,
        instances: [
          {
            snapshot: {
              nodeId: "1:544",
              nodeName: "Save",
              mainComponentName: "variant=primary, state=default",
              componentKey: "variant-key",
              componentSetName: "❖Mystery",
              componentSetKey: "set-key",
              isFromLibrary: true,
              properties: {},
            },
            status: "unmapped",
            ok: false,
            findings: [],
          },
        ],
      },
    });
    expect(md).toContain("### Not in catalog");
    expect(md).toContain("❖Mystery");
    expect(md).toContain("key variant-key");
    expect(md).toContain("set key set-key");
  });
});

describe("issueLinks", () => {
  it("builds a prefilled Harness Jira issue URL", () => {
    const { url, descriptionTruncated } = buildJiraIssueUrl({
      siteUrl: "https://harness.atlassian.net/",
      projectId: "11439",
      issueTypeId: "10309",
      summary: "Proposal",
      description: "hello",
      labels: "ds-contracts, proposal",
    });
    expect(descriptionTruncated).toBe(false);
    expect(url).toContain(
      "https://harness.atlassian.net/secure/CreateIssueDetails!init.jspa",
    );
    expect(url).toContain("pid=11439");
    expect(url).toContain("issuetype=10309");
    expect(url).toContain("summary=Proposal");
    expect(url).toContain("description=hello");
    expect(new URL(url).searchParams.getAll("labels")).toEqual([
      "ds-contracts",
      "proposal",
    ]);
  });
});
