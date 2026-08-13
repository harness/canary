import {
  PAGE_INSTANCE_CAP,
  isDetachableNodeType,
  looksLikeCatalogComponent,
  normalizeCatalogNames,
  toDetachedSnapshot,
  toInstanceSnapshot,
  type CollectResult,
} from "./collect-pure.js";

export {
  PAGE_INSTANCE_CAP,
  componentPropertyToPrimitive,
  looksLikeCatalogComponent,
  toInstanceSnapshot,
  type CollectResult,
} from "./collect-pure.js";

/** Yield to the event loop every N instances so the UI can paint progress. */
export const PROGRESS_CHUNK = 50;

export type ProgressFn = (scanned: number) => void;

export type CollectOptions = {
  /**
   * Figma names from the loaded catalog. Without them the scan only sees
   * instances, so a detached copy of a library component goes unnoticed.
   */
  catalogNames?: readonly string[];
  /** Published component or component-set keys in the loaded catalog. */
  catalogKeys?: readonly string[];
};

type ComponentSetLike = {
  type?: string;
  name?: string;
  key?: string;
};

type MainComponentLike = {
  name?: string;
  key?: string;
  remote?: boolean;
  parent?: ComponentSetLike | null;
};

/**
 * Structural view of the node fields the collector reads. Figma's SceneNode
 * satisfies this at runtime; declaring it explicitly keeps traversal testable
 * outside the Figma sandbox.
 */
export type CollectableNode = {
  id: string;
  name: string;
  type: string;
  key?: string;
  parent?: ComponentSetLike | null;
  variantProperties?: Record<string, string> | null;
  children?: readonly CollectableNode[];
  componentProperties?: Record<
    string,
    { value: unknown; type: string }
  > | null;
  getMainComponentAsync?: () => Promise<MainComponentLike | null>;
  mainComponent?: MainComponentLike | null;
};

/**
 * Read an instance's main component. `instance.mainComponent` is write-only
 * under `documentAccess: "dynamic-page"` and *throws* on read, so always
 * prefer `getMainComponentAsync()`. The sync fallback only exists for older
 * runtimes that lack the async API.
 */
export async function readMainComponent(
  instance: CollectableNode,
): Promise<MainComponentLike | null> {
  if (typeof instance.getMainComponentAsync === "function") {
    return (await instance.getMainComponentAsync()) ?? null;
  }
  return instance.mainComponent ?? null;
}

/**
 * A variant's main component is named after its property combination and has
 * its own key; the name and key that identify the component live on the
 * enclosing COMPONENT_SET. Reading a remote node's parent can throw, and an
 * unreachable set is not fatal — matching falls back to names.
 */
export function readComponentSet(main: MainComponentLike | null): {
  name: string | null;
  key: string | null;
} {
  try {
    const parent = main?.parent;
    if (!parent || parent.type !== "COMPONENT_SET") {
      return { name: null, key: null };
    }
    return { name: parent.name ?? null, key: parent.key ?? null };
  } catch {
    return { name: null, key: null };
  }
}

async function snapshotFromInstance(
  instance: CollectableNode,
  parentNodeId: string | null = null,
): Promise<ReturnType<typeof toInstanceSnapshot>> {
  const main = await readMainComponent(instance);
  const isFromLibrary =
    main && typeof main.remote === "boolean" ? Boolean(main.remote) : null;
  const componentSet = readComponentSet(main);

  const componentProperties: Record<string, unknown> = {};
  const propertyDefinitions: Array<{ name: string; type: string }> = [];
  const props = instance.componentProperties;
  if (props) {
    for (const [name, def] of Object.entries(props)) {
      componentProperties[name] = def.value;
      propertyDefinitions.push({ name, type: def.type });
    }
  }

  return toInstanceSnapshot({
    nodeId: instance.id,
    nodeName: instance.name,
    mainComponentName: main?.name ?? null,
    componentKey: main?.key ?? null,
    componentSetName: componentSet.name,
    componentSetKey: componentSet.key,
    isFromLibrary,
    componentProperties,
    propertyDefinitions,
    nodeType: "INSTANCE",
    parentNodeId,
  });
}

function snapshotFromCatalogComponent(
  component: CollectableNode,
  componentSet: ComponentSetLike | null,
): ReturnType<typeof toInstanceSnapshot> {
  const variantProperties = component.variantProperties ?? {};
  const propertyDefinitions = Object.keys(variantProperties).map((name) => ({
    name,
    type: "VARIANT",
  }));

  return toInstanceSnapshot({
    nodeId: component.id,
    nodeName: component.name,
    mainComponentName: component.name,
    componentKey: component.key ?? null,
    componentSetName: componentSet?.name ?? null,
    componentSetKey: componentSet?.key ?? null,
    isFromLibrary: true,
    componentProperties: variantProperties,
    propertyDefinitions,
    nodeType: component.type,
    parentNodeId: null,
  });
}

function yieldTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function collectFromNodes(
  roots: readonly CollectableNode[],
  cap: number = PAGE_INSTANCE_CAP,
  onProgress?: ProgressFn,
  opts: CollectOptions = {},
): Promise<CollectResult> {
  const snapshots: CollectResult["snapshots"] = [];
  const catalogNames = normalizeCatalogNames(opts.catalogNames ?? []);
  const catalogKeys = new Set(opts.catalogKeys ?? []);
  let scanned = 0;
  let truncated = false;
  let sinceYield = 0;

  const maybeYield = async () => {
    sinceYield += 1;
    if (sinceYield >= PROGRESS_CHUNK) {
      sinceYield = 0;
      onProgress?.(scanned);
      await yieldTick();
    }
  };

  const visit = async (node: CollectableNode) => {
    if (snapshots.length >= cap) {
      truncated = true;
      return;
    }
    if (node.type === "INSTANCE") {
      scanned += 1;
      snapshots.push(await snapshotFromInstance(node));
      await maybeYield();
      for (const child of node.children ?? []) {
        if (snapshots.length >= cap) {
          truncated = true;
          break;
        }
        if (child.type === "INSTANCE") {
          scanned += 1;
          snapshots.push(await snapshotFromInstance(child, node.id));
          await maybeYield();
        }
      }
      return;
    }
    if (node.type === "COMPONENT") {
      const componentSet =
        node.parent?.type === "COMPONENT_SET" ? node.parent : null;
      if (
        (node.key && catalogKeys.has(node.key)) ||
        (componentSet?.key && catalogKeys.has(componentSet.key))
      ) {
        scanned += 1;
        snapshots.push(snapshotFromCatalogComponent(node, componentSet));
        await maybeYield();
        return;
      }
    }
    if (node.type === "COMPONENT_SET" && node.key && catalogKeys.has(node.key)) {
      for (const child of node.children ?? []) {
        if (snapshots.length >= cap) {
          truncated = true;
          break;
        }
        await visit(child);
      }
      return;
    }
    // A detached or re-componentized copy: report the copy itself and stop, so
    // its icon slots do not show up as separate findings.
    if (
      isDetachableNodeType(node.type) &&
      looksLikeCatalogComponent(node.name, catalogNames)
    ) {
      scanned += 1;
      snapshots.push(
        toDetachedSnapshot({
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          parentNodeId: null,
        }),
      );
      await maybeYield();
      return;
    }
    for (const child of node.children ?? []) {
      if (snapshots.length >= cap) {
        truncated = true;
        break;
      }
      await visit(child);
    }
  };

  for (const root of roots) {
    if (snapshots.length >= cap) {
      truncated = true;
      break;
    }
    await visit(root);
  }

  onProgress?.(scanned);
  return { snapshots, truncated, scanned };
}

/** Ensure the current page is loaded before reading its node tree. */
async function loadCurrentPage(): Promise<void> {
  const page = figma.currentPage as PageNode & {
    loadAsync?: () => Promise<void>;
  };
  if (typeof page.loadAsync === "function") await page.loadAsync();
}

export async function collectFromSelection(
  cap = PAGE_INSTANCE_CAP,
  onProgress?: ProgressFn,
  opts: CollectOptions = {},
): Promise<CollectResult> {
  await loadCurrentPage();
  return collectFromNodes(
    figma.currentPage.selection as unknown as readonly CollectableNode[],
    cap,
    onProgress,
    opts,
  );
}

export async function collectFromPage(
  cap = PAGE_INSTANCE_CAP,
  onProgress?: ProgressFn,
  opts: CollectOptions = {},
): Promise<CollectResult> {
  await loadCurrentPage();
  return collectFromNodes(
    figma.currentPage.children as unknown as readonly CollectableNode[],
    cap,
    onProgress,
    opts,
  );
}

export async function selectNodeById(nodeId: string): Promise<boolean> {
  try {
    // getNodeById is unavailable under documentAccess: "dynamic-page".
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || !("type" in node)) return false;
    const scene = node as SceneNode;
    figma.currentPage.selection = [scene];
    figma.viewport.scrollAndZoomIntoView([scene]);
    return true;
  } catch {
    return false;
  }
}

export function getFileContext(): {
  fileKey: string | null;
  fileName: string;
  pageName: string;
} {
  let fileName = "Untitled";
  try {
    fileName = figma.root.name;
  } catch {
    /* document name can be unavailable in restricted contexts */
  }
  return {
    fileKey: typeof figma.fileKey === "string" ? figma.fileKey : null,
    fileName,
    pageName: figma.currentPage.name,
  };
}
