import { describe, it, expect } from "vitest";
import { checkInstances } from "../src/core/check";
import { catalogFigmaNames } from "../src/core/match";
import { collectFromNodes, type CollectableNode } from "../src/main/collect";
import { pilotIndex } from "./helpers/pilotCatalog";

const index = pilotIndex();
const catalogNames = catalogFigmaNames(index);
const catalogKeys = [...index.byComponentKey.keys()];
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
    catalogKeys,
  });
  return checkInstances(collected.snapshots, index, opts);
}

describe("Button definition selected in the source library", () => {
  it("checks the Button variant once and folds its icon slots into it", async () => {
    const componentSet = {
      type: "COMPONENT_SET",
      name: "Button/Md/Text",
      key: "188019ff5a5c45f3009b963213c98e95dc1c780f",
    };
    const sourceVariant = {
      id: "28553:15462",
      name: "variant=primary, 👁 disabled=off, state=default, theme=⚫ default",
      type: "COMPONENT",
      key: "source-variant-key",
      parent: componentSet,
      variantProperties: {
        variant: "primary",
        "👁 disabled": "off",
        state: "default",
        theme: "⚫ default",
      },
      children: [
        iconInstance("28553:15463", "prefix"),
        iconInstance("28553:15465", "suffix"),
      ],
    } as CollectableNode;

    const report = await check([sourceVariant]);

    expect(report.instances).toHaveLength(1);
    expect(report.instances[0]?.snapshot).toMatchObject({
      nodeId: "28553:15462",
      componentSetName: "Button/Md/Text",
      componentSetKey: "188019ff5a5c45f3009b963213c98e95dc1c780f",
      properties: {
        variant: "primary",
        "👁 disabled": "off",
        state: "default",
        theme: "⚫ default",
      },
    });
    expect(report.instances[0]?.status).toBe("checked");
    expect(
      report.instances.map((instance) => instance.snapshot.nodeName),
    ).not.toEqual(expect.arrayContaining(["prefix", "suffix"]));
    expect(report.summary).toMatchObject({
      pass: 1,
      fail: 0,
      unmapped: 0,
      mappedCount: 1,
    });
  });

  it("audits variants inside a selected cataloged component set", async () => {
    const componentSet = {
      id: "28553:15461",
      name: "❖Button/Md/Text",
      type: "COMPONENT_SET",
      key: "188019ff5a5c45f3009b963213c98e95dc1c780f",
    };
    const variants = ["primary", "secondary"].map((variant, index) => ({
      id: `28553:${15462 + index}`,
      name: `variant=${variant}, 👁 disabled=off, state=default, theme=⚫ default`,
      type: "COMPONENT",
      key: `source-variant-key-${index}`,
      parent: componentSet,
      variantProperties: {
        variant,
        "👁 disabled": "off",
        state: "default",
        theme: "⚫ default",
      },
      children: [iconInstance(`28553:${15563 + index}`, "prefix")],
    })) as CollectableNode[];
    const sourceSet = { ...componentSet, children: variants } as CollectableNode;

    const report = await check([sourceSet]);

    expect(report.instances).toHaveLength(2);
    expect(
      report.instances.every((instance) => instance.status === "checked"),
    ).toBe(true);
    expect(
      report.instances.map((instance) => instance.snapshot.nodeName),
    ).not.toContain("prefix");
    expect(
      report.findings.some((finding) => finding.code === "FAIL_DETACHED"),
    ).toBe(false);
    expect(report.summary).toMatchObject({
      pass: 2,
      fail: 0,
      unmapped: 0,
      mappedCount: 2,
    });
  });
});

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

  it("accepts a local source-library instance matched by its published set key", async () => {
    const componentSet = {
      type: "COMPONENT_SET",
      name: "❖Button/Md/Text",
      key: "188019ff5a5c45f3009b963213c98e95dc1c780f",
    };
    const sourceLibraryButton: CollectableNode = {
      id: "30044:12148",
      name: "❖Button/Md/Text",
      type: "INSTANCE",
      componentProperties: {
        variant: { value: "ai", type: "VARIANT" },
        size: { value: "md", type: "VARIANT" },
        theme: { value: "⚫ default", type: "VARIANT" },
      },
      getMainComponentAsync: async () => ({
        name: "variant=ai, state=default, theme=⚫ default",
        key: "source-variant-key",
        remote: false,
        parent: componentSet,
      }),
    };

    const report = await check([sourceLibraryButton]);

    expect(
      report.findings.some((finding) => finding.code === "FAIL_DETACHED"),
    ).toBe(false);
    expect(report.summary).toMatchObject({
      pass: 1,
      fail: 0,
      unmapped: 0,
      mappedCount: 1,
    });
  });
});
