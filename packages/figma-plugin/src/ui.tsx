import { render } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import "./ui/theme.css";

import { checkInstances } from "./core/check";
import {
  findingToProposalDefaults,
  type ProposalContext,
} from "./core/proposal";
import type { Finding, ProposalDraft } from "./core/types";
import { catalogFigmaNames, type CatalogIndex } from "./core/match";
import {
  catalogErrorCode,
  humanizeError,
} from "./ui/lib/errors";
import { loadBundledCatalog } from "./catalog/bundled";
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  normalizeAuthorPersona,
  type SettingsState,
} from "./catalog/clientStorage";
import {
  cacheMatchesUrl,
  cachePayloadFromIndex,
  indexFromCache,
  loadCatalogFromUrl,
  type CatalogCachePayload,
  type CatalogLoadProgress,
} from "./catalog/loadCatalog";
import {
  onMainEvent,
  postToMain,
  startMainListener,
  storageGet,
  storageSet,
} from "./ui/bridge";
import { startHandshake, type BridgeStatus } from "./ui/lib/handshake";
import { copyText, copyToast } from "./ui/lib/clipboard";
import { Tabs } from "./ui/components/Tabs";
import { Banner } from "./ui/components/Banner";
import { okToast, warnToast, type Toast } from "./ui/lib/toast";
import { ManualCopyField } from "./ui/components/ManualCopy";
import { FlashToast } from "./ui/components/FlashToast";
import { HarnessMark } from "./ui/components/HarnessMark";
import { Onboarding } from "./ui/onboarding/Onboarding";
import { CheckTab, emptyCheckState } from "./ui/tabs/CheckTab";
import { ProposeTab, blankProposal } from "./ui/tabs/ProposeTab";
import { CatalogTab } from "./ui/tabs/CatalogTab";
import { SettingsTab } from "./ui/tabs/SettingsTab";
import {
  completedCheckState,
  failedCheckState,
  progressingCheckState,
  reportForFocus,
  startingCheckState,
  summaryLine,
  type CheckFocus,
  type CheckUiState,
} from "./ui/state/checkStore";

type TabId = "check" | "propose" | "catalog" | "settings";

type CatalogStatus = {
  label: string;
  detail: string;
  loading: string | null;
};

function formatCacheAge(iso: string): string {
  const ms = Date.now() - Date.parse(iso);
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const mins = Math.round(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function catalogStatusFromIndex(
  index: CatalogIndex,
  origin: string,
  loading: string | null = null,
): CatalogStatus {
  const n = index.entries.length;
  return {
    label: `${index.manifest.system.displayName} ${index.manifest.version}`,
    detail: `${n} component${n === 1 ? "" : "s"} · ${origin}`,
    loading,
  };
}

function progressLabel(p: CatalogLoadProgress): string {
  if (p.phase === "entries" && p.total > 0) {
    return `Loading catalog ${p.loaded}/${p.total}…`;
  }
  if (p.phase === "pack") return "Loading catalog pack…";
  return "Loading catalog…";
}

function App() {
  const [status, setStatus] = useState<BridgeStatus>("connecting");
  const [tab, setTab] = useState<TabId>("check");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [index, setIndex] = useState<CatalogIndex>(() => loadBundledCatalog());
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>(() =>
    catalogStatusFromIndex(loadBundledCatalog(), "bundled"),
  );
  const [check, setCheck] = useState<CheckUiState>(emptyCheckState);
  const [draft, setDraft] = useState<ProposalDraft>(() =>
    blankProposal(DEFAULT_SETTINGS),
  );
  // A toast owns its fallback field, so a later message can never leave a stale
  // "copy this by hand" textarea attached to it.
  const [toast, setToast] = useState<
    (Toast & { manualCopy?: { label: string; text: string } }) | null
  >(null);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<number | null>(null);

  const showFlash = (message: string) => {
    if (flashTimer.current != null) window.clearTimeout(flashTimer.current);
    setFlash(message);
    flashTimer.current = window.setTimeout(() => {
      setFlash(null);
      flashTimer.current = null;
    }, 1600);
  };

  useEffect(() => {
    return () => {
      if (flashTimer.current != null) window.clearTimeout(flashTimer.current);
    };
  }, []);

  const indexRef = useRef(index);
  const settingsRef = useRef(settings);
  indexRef.current = index;
  settingsRef.current = settings;

  const catalogLabel = useMemo(
    () => `${index.manifest.system.displayName} ${index.manifest.version}`,
    [index],
  );

  useEffect(() => {
    const stop = startMainListener();
    const handshake = startHandshake({
      post: () => postToMain({ type: "UI_READY" }),
      onGiveUp: () => setStatus("error"),
    });
    const off = onMainEvent((ev) => {
      if (ev.type === "plugin-ready") {
        handshake.stop();
        setStatus("ready");
        return;
      }
      if (ev.type === "CHECK_PROGRESS") {
        setCheck((s) => progressingCheckState(s, ev.scanned));
        return;
      }
      if (ev.type === "ERROR") {
        // Humanized copy for the UI, raw cause for the console.
        console.error(
          `[DS Contracts] ${ev.code ?? "ERROR"}:`,
          ev.detail ?? ev.message,
        );
        const code = ev.code ?? null;
        setCheck((s) =>
          failedCheckState(s, humanizeError(code, ev.message), {
            code,
            // Empty selection shouldn't leave a prior report dominating the panel.
            clearResults: code === "NO_SELECTION",
          }),
        );
        return;
      }
      if (ev.type === "CHECK_RAW") {
        const report = checkInstances(ev.snapshots, indexRef.current, {
          treatMissingLibraryFlagAs: "ignore",
          strictUnmapped: settingsRef.current.strictUnmapped,
        });
        const focus = checkFocusRef.current;
        const focused = reportForFocus(report, focus);
        setCheck((s) =>
          completedCheckState(
            s,
            {
              report,
              snapshots: ev.snapshots,
              fileKey: ev.fileKey,
              fileName: ev.fileName,
              pageName: ev.pageName,
              truncated: ev.truncated,
              scanned: ev.scanned,
            },
            summaryLine(focused, focus),
          ),
        );
      }
    });

    (async () => {
      try {
        const done = await storageGet<boolean>(STORAGE_KEYS.onboardingDone);
        setShowOnboarding(!done);
        const saved = await storageGet<SettingsState>(STORAGE_KEYS.settings);
        if (saved) {
          const merged = {
            ...DEFAULT_SETTINGS,
            ...saved,
            authorPersona: normalizeAuthorPersona(saved.authorPersona),
            githubRepo:
              saved.githubRepo?.trim() || DEFAULT_SETTINGS.githubRepo,
          };
          setSettings(merged);
          setDraft(blankProposal(merged));
          if (
            merged.catalogSource === "url" &&
            merged.manifestUrl.trim()
          ) {
            await refreshCatalogRef.current(merged, {
              quiet: true,
              preferCacheOnFail: true,
            });
          }
        }
      } catch {
        /* storage may race before bridge is ready */
      }
    })();

    return () => {
      handshake.stop();
      off();
      stop();
    };
  }, []);

  const lastScope = useRef<"selection" | "page">("selection");
  const checkFocusRef = useRef<CheckFocus | null>(null);

  const refreshCatalog = async (
    override?: SettingsState,
    opts?: { quiet?: boolean; preferCacheOnFail?: boolean },
  ) => {
    const s = override ?? settingsRef.current;
    try {
      if (s.catalogSource === "bundled") {
        const next = loadBundledCatalog();
        setIndex(next);
        setCatalogStatus(catalogStatusFromIndex(next, "bundled"));
        if (!opts?.quiet) setToast(okToast("Loaded bundled Canary catalog"));
        return;
      }
      if (!s.manifestUrl.trim()) {
        if (!opts?.quiet) {
          setToast(warnToast("Enter a pack or manifest URL, or switch to bundled Canary"));
        }
        return;
      }
      const url = s.manifestUrl.trim();
      setCatalogStatus((prev) => ({
        ...prev,
        loading: "Loading catalog…",
      }));
      const next = await loadCatalogFromUrl(url, {
        onProgress: (p) => {
          setCatalogStatus((prev) => ({
            ...prev,
            loading: progressLabel(p),
          }));
        },
      });
      setIndex(next);
      setCatalogStatus(catalogStatusFromIndex(next, "from URL"));
      try {
        await storageSet(
          STORAGE_KEYS.catalogCache,
          cachePayloadFromIndex({ type: "url", manifestUrl: url }, next),
        );
      } catch {
        /* cache write is best-effort */
      }
      if (!opts?.quiet) {
        setToast(
          okToast(
            `Loaded catalog ${next.manifest.system.displayName} ${next.manifest.version}`,
          ),
        );
      }
    } catch (err) {
      const url = s.manifestUrl.trim();
      if (opts?.preferCacheOnFail || s.catalogSource === "url") {
        try {
          const cached = await storageGet<CatalogCachePayload>(
            STORAGE_KEYS.catalogCache,
          );
          if (cacheMatchesUrl(cached, url) && cached) {
            const next = indexFromCache(cached);
            setIndex(next);
            setCatalogStatus(
              catalogStatusFromIndex(
                next,
                `cached ${formatCacheAge(cached.fetchedAt)}`,
              ),
            );
            setToast(
              warnToast(
                "Couldn’t refresh catalog — using last cached pack",
              ),
            );
            return;
          }
        } catch {
          /* fall through */
        }
      }
      setToast(warnToast(humanizeError(catalogErrorCode(err))));
      const fallback = loadBundledCatalog();
      setIndex(fallback);
      setCatalogStatus(catalogStatusFromIndex(fallback, "bundled (fallback)"));
    }
  };

  const refreshCatalogRef = useRef(refreshCatalog);
  refreshCatalogRef.current = refreshCatalog;

  const runCheck = (
    scope: "selection" | "page",
    focus: CheckFocus | null = null,
  ) => {
    lastScope.current = scope;
    checkFocusRef.current = focus;
    setCheck((s) => startingCheckState(s, scope, focus));
    postToMain({
      type: scope === "selection" ? "CHECK_SELECTION" : "CHECK_PAGE",
      catalogNames: catalogFigmaNames(indexRef.current),
    });
  };

  const proposeFromFinding = (finding: Finding) => {
    const ctx: ProposalContext = {
      authorName: settings.authorName || "Designer",
      authorPersona: settings.authorPersona,
      figmaFileKey: check.fileKey ?? undefined,
      fileName: check.fileName,
      pageName: check.pageName,
      componentExport: finding.catalogId,
    };
    const defaults = findingToProposalDefaults(finding, ctx);
    setDraft({
      ...blankProposal(settings),
      ...defaults,
      title: defaults.title ?? "",
      type: defaults.type ?? "shared",
      problem: defaults.problem ?? "",
      attemptedWorkaround: defaults.attemptedWorkaround ?? "",
      requestedChange: defaults.requestedChange ?? "",
      surfaces: defaults.surfaces ?? [
        "Catalog (legal API & bindings)",
        "Figma library",
      ],
      authorName: defaults.authorName ?? settings.authorName,
      authorPersona: defaults.authorPersona ?? settings.authorPersona,
    });
    setTab("propose");
  };

  const finishOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await storageSet(STORAGE_KEYS.onboardingDone, true);
    } catch {
      /* ignore */
    }
  };

  const changeCatalogSource = (catalogSource: "bundled" | "url") => {
    const next = { ...settings, catalogSource };
    setSettings(next);
    if (catalogSource === "bundled" || next.manifestUrl.trim()) {
      void refreshCatalog(next, {
        quiet: true,
        preferCacheOnFail: true,
      });
    }
  };

  const saveSettings = async () => {
    try {
      await storageSet(STORAGE_KEYS.settings, settings);
      setToast(okToast("Settings saved"));
      await refreshCatalog(settings, { preferCacheOnFail: true });
    } catch {
      setToast(warnToast(humanizeError("STORAGE_FAILED")));
    }
  };

  const saveDraft = async (d: ProposalDraft) => {
    try {
      const prev =
        (await storageGet<ProposalDraft[]>(STORAGE_KEYS.proposalDrafts)) ?? [];
      const next = [d, ...prev.filter((x) => x.title !== d.title)].slice(0, 5);
      await storageSet(STORAGE_KEYS.proposalDrafts, next);
    } catch {
      setToast(warnToast(humanizeError("STORAGE_FAILED")));
    }
  };

  const copyHandoff = async (md: string) => {
    const outcome = await copyText(md);
    if (outcome.ok) {
      showFlash("Results copied");
      return;
    }
    setToast({
      ...copyToast(outcome, ""),
      manualCopy: { label: "Results", text: md },
    });
  };

  return (
    <div class="app" style={{ position: "relative" }}>
      {showOnboarding ? <Onboarding onDone={finishOnboarding} /> : null}
      {flash ? <FlashToast message={flash} /> : null}

      <header class="app-header">
        <div class="brand">
          <HarnessMark class="brand-mark" size={16} />
          <h1>DS Contracts</h1>
        </div>
        <span
          class={`status-pill ${
            status === "ready" ? "ok" : status === "error" ? "fail" : ""
          }`}
          title={
            status === "ready"
              ? `Connected to Figma · catalog ${catalogLabel}`
              : status === "error"
                ? "The plugin UI never heard back from Figma"
                : "Connecting to Figma…"
          }
        >
          {status === "ready"
            ? "Ready"
            : status === "error"
              ? "Not connected"
              : "Connecting…"}
        </span>
      </header>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "check", label: "Check" },
          { id: "propose", label: "Propose" },
          { id: "catalog", label: "Catalog" },
          { id: "settings", label: "Settings" },
        ]}
      />

      <main
        class="panel"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        {status === "error" ? (
          <Banner tone="fail">
            Figma didn’t answer the plugin. Close and reopen DS Contracts — if it
            keeps happening, check the plugin console for details.
          </Banner>
        ) : null}

        {toast?.message?.trim() ? (
          <Banner
            tone={toast.tone}
            actions={
              <button
                type="button"
                class="ds-btn ds-btn-ghost ds-btn-sm"
                onClick={() => setToast(null)}
              >
                Dismiss
              </button>
            }
          >
            <p>{toast.message}</p>
            {toast.manualCopy ? (
              <ManualCopyField
                label={toast.manualCopy.label}
                text={toast.manualCopy.text}
              />
            ) : null}
          </Banner>
        ) : null}

        {tab === "check" && (
          <CheckTab
            state={check}
            index={index}
            catalogLabel={catalogLabel}
            onCheckSelection={() => runCheck("selection")}
            onCheckPage={() => runCheck("page")}
            onSelectNode={(nodeId) =>
              postToMain({ type: "SELECT_NODE", nodeId })
            }
            onPropose={proposeFromFinding}
            onCopyHandoff={copyHandoff}
            onRetry={() => runCheck(lastScope.current)}
            onDismissError={() =>
              setCheck((s) => ({
                ...s,
                error: null,
                errorCode: null,
                liveMessage: "",
              }))
            }
          />
        )}
        {tab === "propose" && (
          <ProposeTab
            draft={draft}
            settings={settings}
            onChange={setDraft}
            onSaveDraft={saveDraft}
            onCopied={() => showFlash("Copied")}
          />
        )}
        {tab === "catalog" && (
          <CatalogTab
            index={index}
            onCheckSelection={(entry) => {
              setTab("check");
              runCheck("selection", {
                catalogId: entry.id,
                exportName: entry.code.export,
                figmaName: entry.figma.name,
              });
            }}
          />
        )}
        {tab === "settings" && (
          <SettingsTab
            settings={settings}
            catalogStatus={catalogStatus}
            onChange={setSettings}
            onSave={saveSettings}
            onCatalogSourceChange={changeCatalogSource}
            onResetOnboarding={async () => {
              await storageSet(STORAGE_KEYS.onboardingDone, false);
              setShowOnboarding(true);
            }}
          />
        )}
      </main>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
