import type { InstanceSnapshot } from "../core/types.js";

/** UI → main thread */
export type UiRequest =
  | { type: "UI_READY" }
  /** Catalog identity lets the scan recognize instances, source definitions, and detached copies. */
  | {
      type: "CHECK_SELECTION";
      catalogNames?: string[];
      catalogKeys?: string[];
    }
  | { type: "CHECK_PAGE"; catalogNames?: string[]; catalogKeys?: string[] }
  | { type: "SELECT_NODE"; nodeId: string }
  | { type: "GET_FILE_CONTEXT" }
  | { type: "CLOSE" }
  | { type: "STORAGE_GET"; key: string; requestId: string }
  | { type: "STORAGE_SET"; key: string; value: unknown; requestId: string }
  | { type: "STORAGE_DELETE"; key: string; requestId: string }
  | {
      type: "FETCH_CATALOG_URL";
      requestId: string;
      manifestUrl: string;
    };

/** Main → UI */
export type MainEvent =
  | { type: "plugin-ready" }
  | {
      type: "CHECK_RAW";
      snapshots: InstanceSnapshot[];
      fileKey: string | null;
      fileName: string;
      pageName: string;
      truncated: boolean;
      scanned: number;
    }
  | {
      type: "FILE_CONTEXT";
      fileKey: string | null;
      fileName: string;
      pageName: string;
    }
  /** `detail` carries the raw failure for the console; never rendered as-is. */
  | { type: "ERROR"; message: string; code?: string; detail?: string }
  | {
      type: "CHECK_PROGRESS";
      scanned: number;
      scope: "selection" | "page";
    }
  | { type: "NODE_SELECTED"; nodeId: string; ok: boolean }
  | {
      type: "STORAGE_RESULT";
      requestId: string;
      ok: boolean;
      value?: unknown;
      error?: string;
    }
  | {
      type: "FETCH_CATALOG_RESULT";
      requestId: string;
      ok: boolean;
      manifest?: unknown;
      entries?: unknown[];
      error?: string;
      errorCode?: "CATALOG_NETWORK" | "CATALOG_INVALID";
    };

export function postToUi(event: MainEvent): void {
  figma.ui.postMessage(event);
}
