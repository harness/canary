import {
  CatalogLoadError,
  loadCatalogFromUrl,
} from "./catalog/loadCatalog";
import {
  collectFromPage,
  collectFromSelection,
  getFileContext,
  selectNodeById,
} from "./main/collect";
import { postToUi, type UiRequest } from "./main/messages";

figma.showUI(__html__, {
  width: 360,
  height: 640,
  themeColors: true,
});

function describeError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

async function handleCheck(
  scope: "selection" | "page",
  catalogNames: string[] = [],
): Promise<void> {
  try {
    if (scope === "selection" && figma.currentPage.selection.length === 0) {
      postToUi({
        type: "ERROR",
        code: "NO_SELECTION",
        message: "Nothing is selected.",
      });
      return;
    }
    const onProgress = (scanned: number) => {
      postToUi({ type: "CHECK_PROGRESS", scanned, scope });
    };
    const result =
      scope === "selection"
        ? await collectFromSelection(undefined, onProgress, { catalogNames })
        : await collectFromPage(undefined, onProgress, { catalogNames });
    const ctx = getFileContext();
    postToUi({
      type: "CHECK_RAW",
      snapshots: result.snapshots,
      fileKey: ctx.fileKey,
      fileName: ctx.fileName,
      pageName: ctx.pageName,
      truncated: result.truncated,
      scanned: result.scanned,
    });
  } catch (err) {
    postToUi({
      type: "ERROR",
      code: "COLLECT_FAILED",
      message:
        "Couldn’t read instances from the canvas. Try again, or check a smaller selection.",
      detail: describeError(err),
    });
    // Keep original in console for dogfood debugging
    console.error(`[DS Contracts] check ${scope} failed:`, err);
  }
}

function postReady(): void {
  const ctx = getFileContext();
  postToUi({ type: "plugin-ready" });
  postToUi({ type: "FILE_CONTEXT", ...ctx });
}

async function handleMessage(msg: UiRequest): Promise<void> {
  switch (msg.type) {
    // The UI iframe loads after this file runs, so any handshake posted at
    // startup can be dropped. The UI asks for it once it is listening.
    case "UI_READY":
      postReady();
      break;
    case "CLOSE":
      figma.closePlugin();
      break;
    case "CHECK_SELECTION":
      await handleCheck("selection", msg.catalogNames);
      break;
    case "CHECK_PAGE":
      await handleCheck("page", msg.catalogNames);
      break;
    case "SELECT_NODE": {
      const ok = await selectNodeById(msg.nodeId);
      postToUi({ type: "NODE_SELECTED", nodeId: msg.nodeId, ok });
      if (!ok) {
        postToUi({
          type: "ERROR",
          code: "SELECT_FAILED",
          message:
            "Couldn’t select that layer. It may be on another page or no longer exist.",
        });
      }
      break;
    }
    case "GET_FILE_CONTEXT": {
      const ctx = getFileContext();
      postToUi({ type: "FILE_CONTEXT", ...ctx });
      break;
    }
    case "STORAGE_GET": {
      try {
        const value = await figma.clientStorage.getAsync(msg.key);
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: true,
          value,
        });
      } catch (err) {
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }
    case "STORAGE_SET": {
      try {
        await figma.clientStorage.setAsync(msg.key, msg.value);
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: true,
        });
      } catch (err) {
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }
    case "STORAGE_DELETE": {
      try {
        await figma.clientStorage.deleteAsync(msg.key);
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: true,
        });
      } catch (err) {
        postToUi({
          type: "STORAGE_RESULT",
          requestId: msg.requestId,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }
    case "FETCH_CATALOG_URL": {
      // Pack or manifest+entries; prefer single pack download when available.
      try {
        const index = await loadCatalogFromUrl(msg.manifestUrl);
        postToUi({
          type: "FETCH_CATALOG_RESULT",
          requestId: msg.requestId,
          ok: true,
          manifest: index.manifest,
          entries: index.entries,
        });
      } catch (err) {
        const code =
          err instanceof CatalogLoadError ? err.code : "CATALOG_NETWORK";
        postToUi({
          type: "FETCH_CATALOG_RESULT",
          requestId: msg.requestId,
          ok: false,
          errorCode: code,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      break;
    }
    default:
      break;
  }
}

figma.ui.onmessage = async (msg: UiRequest) => {
  try {
    await handleMessage(msg);
  } catch (err) {
    console.error(`[DS Contracts] handling ${msg?.type} failed:`, err);
    postToUi({
      type: "ERROR",
      code: "UNKNOWN",
      message:
        "Something went wrong talking to Figma. Try again — the console has details.",
      detail: describeError(err),
    });
  }
};

// Best-effort early handshake; UI_READY is the reliable one.
postReady();
