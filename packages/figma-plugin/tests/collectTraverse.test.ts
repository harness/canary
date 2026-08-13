import { describe, it, expect, vi } from "vitest";
import {
  collectFromNodes,
  readMainComponent,
  type CollectableNode,
} from "../src/main/collect";

/**
 * Models `documentAccess: "dynamic-page"`: reading `instance.mainComponent`
 * throws, only `getMainComponentAsync()` works.
 */
function dynamicPageInstance(
  id: string,
  name: string,
  opts: {
    mainName?: string;
    key?: string;
    remote?: boolean;
    properties?: Record<string, { value: unknown; type: string }>;
    children?: CollectableNode[];
    parent?: unknown;
  } = {},
): CollectableNode {
  const node = {
    id,
    name,
    type: "INSTANCE",
    children: opts.children,
    componentProperties: opts.properties ?? {},
    getMainComponentAsync: async () => ({
      name: opts.mainName ?? "❖Button",
      key: opts.key ?? "KEY",
      remote: opts.remote,
      parent: opts.parent,
    }),
  };
  Object.defineProperty(node, "mainComponent", {
    get() {
      throw new Error(
        "Cannot call with documentAccess: dynamic-page. Use node.getMainComponentAsync instead.",
      );
    },
  });
  return node as CollectableNode;
}

function frame(id: string, children: CollectableNode[]): CollectableNode {
  return { id, name: `Frame ${id}`, type: "FRAME", children };
}

describe("collectFromNodes under documentAccess: dynamic-page", () => {
  it("never reads the sync mainComponent property", async () => {
    const result = await collectFromNodes([
      dynamicPageInstance("1:2", "Button", {
        remote: true,
        properties: { variant: { value: "primary", type: "VARIANT" } },
      }),
    ]);

    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0]).toMatchObject({
      nodeId: "1:2",
      nodeName: "Button",
      mainComponentName: "❖Button",
      componentKey: "KEY",
      isFromLibrary: true,
      properties: { variant: "primary" },
    });
    expect(result.snapshots[0].propertyDefinitions).toEqual([
      { name: "variant", type: "VARIANT" },
    ]);
  });

  it("records the component set behind a variant instance", async () => {
    const result = await collectFromNodes([
      dynamicPageInstance("1:544", "❖Button/Md/Text", {
        mainName: "variant=primary, state=default",
        key: "variant-key",
        remote: true,
        parent: {
          type: "COMPONENT_SET",
          name: "❖Button/Md/Text",
          key: "set-key",
        },
      }),
    ]);
    expect(result.snapshots[0]).toMatchObject({
      mainComponentName: "variant=primary, state=default",
      componentKey: "variant-key",
      componentSetName: "❖Button/Md/Text",
      componentSetKey: "set-key",
    });
  });

  it("survives a main component whose parent cannot be read", async () => {
    const guarded = {};
    Object.defineProperty(guarded, "parent", {
      get() {
        throw new Error("Cannot read parent of a remote node");
      },
      enumerable: true,
    });
    const node: CollectableNode = {
      id: "1:545",
      name: "❖Button/Md/Text",
      type: "INSTANCE",
      componentProperties: {},
      getMainComponentAsync: async () =>
        Object.assign(guarded, { name: "variant=primary", key: "k" }),
    };
    const result = await collectFromNodes([node]);
    expect(result.snapshots[0]?.componentSetName).toBeNull();
    expect(result.snapshots[0]?.componentSetKey).toBeNull();
  });

  it("ignores a main component that is not a variant", async () => {
    const result = await collectFromNodes([
      dynamicPageInstance("1:546", "Badge", {
        mainName: "❖Badge",
        parent: { type: "PAGE", name: "Components", key: "page-key" },
      }),
    ]);
    expect(result.snapshots[0]?.componentSetName).toBeNull();
    expect(result.snapshots[0]?.componentSetKey).toBeNull();
  });

  it("falls back to the sync property on legacy runtimes", async () => {
    const legacy: CollectableNode = {
      id: "9:9",
      name: "Legacy",
      type: "INSTANCE",
      componentProperties: {},
      mainComponent: { name: "❖Badge", key: "BKEY", remote: false },
    };
    expect(await readMainComponent(legacy)).toMatchObject({ name: "❖Badge" });

    const result = await collectFromNodes([legacy]);
    expect(result.snapshots[0].mainComponentName).toBe("❖Badge");
    expect(result.snapshots[0].isFromLibrary).toBe(false);
  });

  it("reports isFromLibrary as null when remote is unknown", async () => {
    const result = await collectFromNodes([
      dynamicPageInstance("1:3", "Button"),
    ]);
    expect(result.snapshots[0].isFromLibrary).toBeNull();
  });

  it("handles a detached instance with no main component", async () => {
    const orphan: CollectableNode = {
      id: "4:4",
      name: "Detached",
      type: "INSTANCE",
      componentProperties: {},
      getMainComponentAsync: async () => null,
    };
    const result = await collectFromNodes([orphan]);
    expect(result.snapshots[0].mainComponentName).toBeNull();
    expect(result.snapshots[0].componentKey).toBeNull();
  });

  it("walks frames and collects nested instances", async () => {
    const result = await collectFromNodes([
      frame("f1", [
        frame("f2", [dynamicPageInstance("1:10", "Button")]),
        dynamicPageInstance("1:11", "Card", {
          children: [dynamicPageInstance("1:12", "Icon")],
        }),
      ]),
    ]);
    expect(result.snapshots.map((s) => s.nodeId)).toEqual([
      "1:10",
      "1:11",
      "1:12",
    ]);
    expect(result.scanned).toBe(3);
    expect(result.truncated).toBe(false);
  });

  it("tolerates leaf nodes without children", async () => {
    const result = await collectFromNodes([
      { id: "t1", name: "Text", type: "TEXT" },
    ]);
    expect(result.snapshots).toEqual([]);
    expect(result.scanned).toBe(0);
  });

  it("truncates at the cap and reports progress", async () => {
    const nodes = Array.from({ length: 5 }, (_, i) =>
      dynamicPageInstance(`1:${i}`, `Button ${i}`),
    );
    const onProgress = vi.fn();
    const result = await collectFromNodes(nodes, 3, onProgress);
    expect(result.snapshots).toHaveLength(3);
    expect(result.truncated).toBe(true);
    expect(onProgress).toHaveBeenCalledWith(3);
  });

  it("records the parent id of nested parts", async () => {
    const result = await collectFromNodes([
      dynamicPageInstance("1:11", "Button", {
        children: [dynamicPageInstance("1:12", "prefix")],
      }),
    ]);
    expect(result.snapshots[0]?.parentNodeId).toBeNull();
    expect(result.snapshots[1]?.parentNodeId).toBe("1:11");
  });

  it("surfaces collection failures instead of returning partial data", async () => {
    const broken: CollectableNode = {
      id: "5:5",
      name: "Broken",
      type: "INSTANCE",
      componentProperties: {},
      getMainComponentAsync: async () => {
        throw new Error("node not found");
      },
    };
    await expect(collectFromNodes([broken])).rejects.toThrow("node not found");
  });
});

describe("detached components that look like catalog components", () => {
  const catalogNames = ["❖Button", "Button", "❖Badge"];

  /** A Button that was detached and then turned into a local component. */
  function localButton(children: CollectableNode[]): CollectableNode {
    return { id: "1:1500", name: "Button", type: "COMPONENT", children };
  }

  it("reports the local component instead of its inner parts", async () => {
    const result = await collectFromNodes(
      [
        localButton([
          dynamicPageInstance("1:1510", "prefix", {
            children: [dynamicPageInstance("I1:1510;23", "icon-color")],
          }),
          dynamicPageInstance("1:1512", "suffix"),
        ]),
      ],
      undefined,
      undefined,
      { catalogNames },
    );

    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0]).toMatchObject({
      nodeId: "1:1500",
      nodeName: "Button",
      nodeType: "COMPONENT",
      mainComponentName: null,
      componentKey: null,
      isFromLibrary: false,
    });
  });

  it("catches a detached frame that kept the library name", async () => {
    const result = await collectFromNodes(
      [
        {
          id: "1:1600",
          name: "❖Button",
          type: "FRAME",
          children: [dynamicPageInstance("1:1601", "prefix")],
        },
      ],
      undefined,
      undefined,
      { catalogNames },
    );
    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0]?.nodeType).toBe("FRAME");
  });

  it("walks through frames that do not look like catalog components", async () => {
    const result = await collectFromNodes(
      [frame("f1", [dynamicPageInstance("1:10", "Button")])],
      undefined,
      undefined,
      { catalogNames },
    );
    expect(result.snapshots.map((s) => s.nodeId)).toEqual(["1:10"]);
  });

  it("only flags non-instance nodes when catalog names are supplied", async () => {
    const result = await collectFromNodes([
      localButton([dynamicPageInstance("1:1510", "prefix")]),
    ]);
    expect(result.snapshots.map((s) => s.nodeId)).toEqual(["1:1510"]);
  });
});
