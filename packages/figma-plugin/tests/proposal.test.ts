import { describe, it, expect } from "vitest";
import {
  proposalToMarkdown,
  findingToProposalDefaults,
} from "../src/core/proposal";
import type { Finding, ProposalDraft } from "../src/core/types";

describe("proposalToMarkdown", () => {
  it("snapshots Path P markdown for variant += subtle", () => {
    const draft: ProposalDraft = {
      title: 'Add canary.button variant value "subtle"',
      type: "shared",
      problem:
        "Product needs a quieter emphasis than secondary for dense toolbars.",
      attemptedWorkaround:
        "Tried secondary and ghost; both too strong or too weak for the density.",
      requestedChange: 'Button.variant += "subtle"',
      surfaces: [
        "Code (@harnessio/ui)",
        "Catalog (legal API & bindings)",
        "Code Connect",
        "Figma library",
      ],
      designOnlyNote: undefined,
      acceptanceSuggestion:
        "Catalog shared.values includes subtle; Code Connect maps; Figma variant option ships.",
      authorName: "Alex Designer",
      authorPersona: "Figma designer",
      figmaFileKey: "AIgjIyUzcuZzuVnuoOyhQE",
      figmaNodeId: "10:20",
      figmaUrl: "https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE?node-id=10-20",
      catalogId: "canary.button",
    };

    expect(proposalToMarkdown(draft)).toMatchInlineSnapshot(`
      "# Proposal: Add canary.button variant value "subtle"

      ## Type
      - [x] shared API (code + Figma)
      - [ ] designOnly (Figma ergonomics)
      - [ ] codeOnly (runtime)
      - [ ] pattern rule
      - [ ] new component
      - [ ] token

      ## Problem
      Product needs a quieter emphasis than secondary for dense toolbars.

      ## Attempted workaround
      Tried secondary and ghost; both too strong or too weak for the density.

      ## Requested change
      Button.variant += "subtle"

      ## Surfaces affected
      - [x] Code (@harnessio/ui)
      - [x] Catalog (legal API & bindings)
      - [x] Code Connect
      - [x] Figma library
      - [ ] Patterns
      - [ ] Portal docs

      ## Design-only note (if any)
      —

      ## Acceptance suggestion
      Catalog shared.values includes subtle; Code Connect maps; Figma variant option ships.

      ## Author
      Alex Designer / Figma designer
      Link to branch / Figma frame
      https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE?node-id=10-20
      Catalog: canary.button
      "
    `);
  });
});

describe("findingToProposalDefaults", () => {
  it("prefills from FAIL_SHARED_VALUE", () => {
    const finding: Finding = {
      code: "FAIL_SHARED_VALUE",
      severity: "fail",
      nodeId: "10:20",
      catalogId: "canary.button",
      propName: "variant",
      actual: "subtle",
      expected: ["primary", "secondary", "outline", "ai", "ghost", "link", "transparent"],
      message: 'variant value "subtle" is not in catalog',
      proposeDefaults: {
        type: "shared",
        requestedChange: 'Button.variant += "subtle"',
      },
    };

    const defaults = findingToProposalDefaults(finding, {
      authorName: "Alex",
      authorPersona: "Figma designer",
      figmaFileKey: "FILEKEY",
      fileName: "HDS",
      pageName: "Page 1",
      componentExport: "Button",
    });

    expect(defaults.type).toBe("shared");
    expect(defaults.requestedChange).toContain("subtle");
    expect(defaults.figmaUrl).toContain("FILEKEY");
    expect(defaults.figmaUrl).toContain("node-id=10-20");
    expect(defaults.authorName).toBe("Alex");
  });
});
