import { useMemo, useState } from "preact/hooks";
import type { ProposalDraft, ProposalType } from "../../core/types";
import { proposalToMarkdown } from "../../core/proposal";
import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { ManualCopyField } from "../components/ManualCopy";
import { copyText, copyToast, type CopyOutcome } from "../lib/clipboard";
import { okToast, warnToast, type Toast } from "../lib/toast";
import { buildJiraIssueUrl } from "../lib/issueLinks";
import { openExternalUrl } from "../lib/openExternal";
import type { SettingsState } from "../../catalog/clientStorage";

type Props = {
  draft: ProposalDraft;
  settings: SettingsState;
  onChange: (draft: ProposalDraft) => void;
  onSaveDraft: (draft: ProposalDraft) => void;
  onCopied?: () => void;
};

const TYPES: Array<{ value: ProposalType; label: string; description: string }> =
  [
    {
      value: "shared",
      label: "shared API (code + Figma)",
      description:
        "Prop that exists in both code and Figma (must stay in sync).",
    },
    {
      value: "designOnly",
      label: "designOnly (Figma ergonomics)",
      description:
        "Figma-only helper for canvas ergonomics — not a React prop.",
    },
    {
      value: "codeOnly",
      label: "codeOnly (runtime)",
      description:
        "Runtime-only API (onClick, loading, …) — not a Figma property.",
    },
    {
      value: "pattern",
      label: "pattern (usage rule)",
      description: "A must / must-not usage rule (composition, not a prop).",
    },
    {
      value: "component",
      label: "component (new catalog entry)",
      description: "A new catalog component, not just a prop or variant.",
    },
    {
      value: "token",
      label: "token (semantic value)",
      description:
        "A new semantic color/spacing/etc. value in the token system.",
    },
  ];

const SURFACE_OPTIONS = [
  "Code (@harnessio/ui)",
  "Catalog (legal API & bindings)",
  "Code Connect",
  "Figma library",
  "Patterns",
  "Portal docs",
];

export function blankProposal(settings: SettingsState): ProposalDraft {
  return {
    title: "",
    type: "shared",
    problem: "",
    attemptedWorkaround: "",
    requestedChange: "",
    surfaces: ["Catalog (legal API & bindings)", "Figma library"],
    authorName: settings.authorName || "",
  };
}

/** A toast owns its fallback field, so a later message can't inherit a stale one. */
type ProposeToast = Toast & {
  manualCopy?: { label: string; text: string };
};

export function ProposeTab({
  draft,
  settings,
  onChange,
  onSaveDraft,
  onCopied,
}: Props) {
  const [toast, setToast] = useState<ProposeToast | null>(null);

  const valid = Boolean(
    draft.type &&
      draft.problem.trim() &&
      draft.attemptedWorkaround.trim() &&
      draft.requestedChange.trim() &&
      draft.title.trim(),
  );

  const markdown = useMemo(() => proposalToMarkdown(draft), [draft]);

  const typeDescription =
    TYPES.find((t) => t.value === draft.type)?.description ?? "";

  const set = <K extends keyof ProposalDraft>(key: K, value: ProposalDraft[K]) => {
    onChange({ ...draft, [key]: value });
  };

  /** Only surface a banner when copy fails and the user needs a manual fallback. */
  const toastForCopyFail = (
    outcome: CopyOutcome,
    failPrefix?: string,
  ): ProposeToast => {
    const base = copyToast(outcome, "");
    return {
      ...base,
      message: failPrefix ? `${failPrefix} ${base.message}` : base.message,
      manualCopy: { label: "Proposal markdown", text: markdown },
    };
  };

  const copyMd = async () => {
    const outcome = await copyText(markdown);
    if (outcome.ok) onCopied?.();
    else setToast(toastForCopyFail(outcome));
  };

  const openJira = async () => {
    if (
      !settings.jiraBaseUrl.trim() ||
      !settings.jiraProjectId.trim() ||
      !settings.jiraIssueTypeId.trim()
    ) {
      setToast(
        warnToast(
          "Set the Jira site, project ID, and issue type ID in Settings first.",
        ),
      );
      return;
    }
    const { url, descriptionTruncated } = buildJiraIssueUrl({
      siteUrl: settings.jiraBaseUrl,
      projectId: settings.jiraProjectId,
      issueTypeId: settings.jiraIssueTypeId,
      summary: draft.title,
      description: markdown,
      labels: settings.jiraLabels,
    });
    if (descriptionTruncated) {
      const outcome = await copyText(markdown);
      if (outcome.ok) {
        setToast(
          okToast(
            "Jira description too long for the link — markdown copied; paste it into the issue.",
          ),
        );
      } else {
        setToast(
          toastForCopyFail(outcome, "Jira description too long for the link."),
        );
      }
    }
    openExternalUrl(url);
  };

  return (
    <div>
      {toast?.message?.trim() ? (
        <Banner
          tone={toast.tone}
          actions={
            <Button size="sm" variant="ghost" onClick={() => setToast(null)}>
              Dismiss
            </Button>
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

      <div class="ds-field ds-propose-title">
        <label for="p-title">Title</label>
        <input
          id="p-title"
          value={draft.title}
          placeholder={'e.g. Add Button variant “subtle”'}
          onInput={(e) => set("title", (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="ds-field">
        <label for="p-type">Type</label>
        <select
          id="p-type"
          value={draft.type}
          aria-describedby="p-type-hint"
          onChange={(e) =>
            set("type", (e.target as HTMLSelectElement).value as ProposalType)
          }
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span id="p-type-hint" class="hint">
          {typeDescription}
        </span>
      </div>

      <div class="ds-field">
        <label for="p-problem">Problem</label>
        <textarea
          id="p-problem"
          value={draft.problem}
          placeholder="What product need fails today? Who experiences it, and where?"
          onInput={(e) => set("problem", (e.target as HTMLTextAreaElement).value)}
        />
      </div>

      <div class="ds-field">
        <label for="p-work">Attempted workaround</label>
        <textarea
          id="p-work"
          value={draft.attemptedWorkaround}
          placeholder="Which existing props or patterns did you try, and why weren’t they enough?"
          onInput={(e) =>
            set("attemptedWorkaround", (e.target as HTMLTextAreaElement).value)
          }
        />
      </div>

      <div class="ds-field">
        <label for="p-change">Requested change</label>
        <textarea
          id="p-change"
          value={draft.requestedChange}
          placeholder={'Exact names/values you want, e.g. Button.variant += “subtle”'}
          onInput={(e) =>
            set("requestedChange", (e.target as HTMLTextAreaElement).value)
          }
        />
      </div>

      <fieldset class="ds-field">
        <legend>
          Surfaces affected <span class="ds-optional">optional</span>
        </legend>
        {SURFACE_OPTIONS.map((s) => {
          const checked = draft.surfaces.includes(s);
          return (
            <label key={s} class="ds-check">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = checked
                    ? draft.surfaces.filter((x) => x !== s)
                    : [...draft.surfaces, s];
                  set("surfaces", next);
                }}
              />
              {s}
            </label>
          );
        })}
      </fieldset>

      <div class="ds-field">
        <label for="p-dono">
          Design-only note <span class="ds-optional">optional</span>
        </label>
        <textarea
          id="p-dono"
          value={draft.designOnlyNote ?? ""}
          placeholder="If this is canvas-only, how should eng compose it in code?"
          onInput={(e) =>
            set("designOnlyNote", (e.target as HTMLTextAreaElement).value)
          }
        />
      </div>

      <div class="ds-field">
        <label for="p-accept">
          Acceptance suggestion <span class="ds-optional">optional</span>
        </label>
        <textarea
          id="p-accept"
          value={draft.acceptanceSuggestion ?? ""}
          placeholder="How will we know this is done? e.g. catalog entry, Figma option, Code Connect map"
          onInput={(e) =>
            set("acceptanceSuggestion", (e.target as HTMLTextAreaElement).value)
          }
        />
      </div>

      <div class="ds-field">
        <label for="p-author">
          Author name <span class="ds-optional">optional</span>
        </label>
        <input
          id="p-author"
          value={draft.authorName}
          placeholder="Your name"
          onInput={(e) => set("authorName", (e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="ds-propose-actions">
        <div class="ds-row">
          <Button variant="primary" disabled={!valid} onClick={openJira}>
            Open Jira issue
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onSaveDraft(draft);
              setToast(okToast("Draft saved locally"));
            }}
          >
            Save draft
          </Button>
        </div>

        <div class="ds-propose-utility">
          <span class="ds-propose-utility-label">Export</span>
          <Button variant="ghost" disabled={!valid} onClick={copyMd}>
            Copy markdown
          </Button>
        </div>
      </div>
    </div>
  );
}
