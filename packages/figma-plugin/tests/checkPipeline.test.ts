import { describe, it, expect } from "vitest";
import { checkInstances } from "../src/core/check";
import { catalogFigmaNames } from "../src/core/match";
import { collectFromNodes, type CollectableNode } from "../src/main/collect";
import { pilotIndex } from "./helpers/pilotCatalog";

const index = pilotIndex();
const catalogNames = catalogFigmaNames(index);
const opts = { treatMissingLibraryFlagAs: "ignore" } as const;

function iconInstance(
  id: string,
  name: string,
  children: CollectableNode[] = [],
): CollectableNode {
  return {
    id,
    name,
    type: "INSTANCE",
    children,
    componentProperties: {},
    getMainComponentAsync: async () => ({
      name: "❖IconV2",
      key: "icon-key",
      remote: true,
    }),
  };
}

/** The parts Figma leaves behind inside a Canary Button. */
function buttonParts(): CollectableNode[] {
  return [
    iconInstance("1:1510", "prefix", [
      iconInstance("I1:1510;23:1408", "icon-color"),
    ]),
    iconInstance("1:1512", "suffix", [
      iconInstance("I1:1512;3250:96", "icon-color"),
    ]),
  ];
}

async function check(roots: CollectableNode[]) {
  const collected = await collectFromNodes(roots, undefined, undefined, {
    catalogNames,
  });
  return checkInstances(collected.snapshots, index, opts);
}

describe("detach → make component → Check selection", () => {
  it("returns one failure about the button, not its icon parts", async () => {
    const report = await check([
      { id: "1:1500", name: "Button", type: "COMPONENT", children: buttonParts() },
    ]);

    expect(report.instances).toHaveLength(1);
    expect(report.findings).toHaveLength(1);
    expect(report.findings[0]?.code).toBe("FAIL_DETACHED");
    expect(report.findings[0]?.nodeId).toBe("1:1500");
    expect(report.summary).toMatchObject({
      pass: 0,
      fail: 1,
      unmapped: 0,
      instanceCount: 1,
      mappedCount: 1,
    });
  });

  it("never labels an icon part as a passing button", async () => {
    const report = await check([
      { id: "1:1500", name: "Button", type: "COMPONENT", children: buttonParts() },
    ]);
    const names = report.instances.map((i) => i.snapshot.nodeName);
    expect(names).not.toContain("prefix");
    expect(names).not.toContain("icon-color");
  });
});

describe("genuine library instance", () => {
  function libraryButton(
    props: Record<string, { value: unknown; type: string }>,
  ): CollectableNode {
    return {
      id: "1:2000",
      name: "Button",
      type: "INSTANCE",
      children: buttonParts(),
      componentProperties: props,
      getMainComponentAsync: async () => ({
        name: "❖Button/Sm/Text",
        key: "188019ff5a5c45f3009b963213c98e95dc1c780f",
        remote: true,
      }),
    };
  }

  it("passes once and folds its icon parts into that result", async () => {
    const report = await check([
      libraryButton({
        variant: { value: "primary", type: "VARIANT" },
        size: { value: "sm", type: "VARIANT" },
        theme: { value: "⚫ default", type: "VARIANT" },
      }),
    ]);

    expect(report.instances).toHaveLength(1);
    expect(report.instances[0]?.status).toBe("checked");
    expect(report.summary).toMatchObject({ pass: 1, fail: 0, unmapped: 0 });
  });

  it("still fails an illegal shared value", async () => {
    const report = await check([
      libraryButton({
        variant: { value: "subtle", type: "VARIANT" },
        size: { value: "sm", type: "VARIANT" },
      }),
    ]);
    expect(report.findings.map((f) => f.code)).toEqual(["FAIL_SHARED_VALUE"]);
    expect(report.summary.fail).toBe(1);
  });
});
