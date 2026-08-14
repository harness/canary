import type { SettingsState } from "../../catalog/clientStorage";
import { Button } from "../components/Button";

type CatalogStatus = {
  label: string;
  detail: string;
  loading: string | null;
};

type Props = {
  settings: SettingsState;
  catalogStatus: CatalogStatus;
  onChange: (next: SettingsState) => void;
  onSave: () => void;
  onResetOnboarding: () => void;
  onCatalogSourceChange: (source: "bundled" | "url") => void;
};

export function SettingsTab({
  settings,
  catalogStatus,
  onChange,
  onSave,
  onResetOnboarding,
  onCatalogSourceChange,
}: Props) {
  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <div class="ds-field ds-field-row">
        <label for="s-source">Catalog</label>
        <select
          id="s-source"
          value={settings.catalogSource}
          onChange={(e) =>
            onCatalogSourceChange(
              (e.target as HTMLSelectElement).value as "bundled" | "url",
            )
          }
        >
          <option value="bundled">Use bundled Canary</option>
          <option value="url">Custom pack or manifest URL</option>
        </select>
      </div>

      <p class="ds-catalog-status" aria-live="polite">
        {catalogStatus.loading ? (
          <span>{catalogStatus.loading}</span>
        ) : (
          <>
            <strong>Active pack:</strong> {catalogStatus.label}
            <span class="ds-catalog-status-detail"> · {catalogStatus.detail}</span>
          </>
        )}
      </p>

      {settings.catalogSource === "url" ? (
        <div class="ds-field">
          <label for="s-url">Pack or manifest URL</label>
          <input
            id="s-url"
            value={settings.manifestUrl}
            placeholder="https://cdn.example.com/canary/canary.catalog.pack.json"
            onInput={(e) =>
              set("manifestUrl", (e.target as HTMLInputElement).value)
            }
          />
          <span class="hint">
            Prefer a single <code>*.catalog.pack.json</code>. A manifest URL still
            works (tries the sibling pack, then parallel component fetches). Host
            must be in networkAccess.allowedDomains. Save to load; last good pack
            is cached for offline refresh.
          </span>
        </div>
      ) : null}

      <h3 class="ds-group-title">Issues</h3>
      <div class="ds-field ds-field-row">
        <label for="s-jira-site">Jira site</label>
        <input
          id="s-jira-site"
          value={settings.jiraBaseUrl}
          placeholder="https://harness.atlassian.net"
          onInput={(e) =>
            set("jiraBaseUrl", (e.target as HTMLInputElement).value)
          }
        />
      </div>
      <div class="ds-field ds-field-row">
        <label for="s-jira-project">Jira project ID</label>
        <input
          id="s-jira-project"
          value={settings.jiraProjectId}
          placeholder="11439"
          onInput={(e) =>
            set("jiraProjectId", (e.target as HTMLInputElement).value)
          }
        />
        <span class="hint">Canary default: XD · Experience Design</span>
      </div>
      <div class="ds-field ds-field-row">
        <label for="s-jira-type">Jira issue type ID</label>
        <input
          id="s-jira-type"
          value={settings.jiraIssueTypeId}
          placeholder="10309"
          onInput={(e) =>
            set("jiraIssueTypeId", (e.target as HTMLInputElement).value)
          }
        />
        <span class="hint">Canary default: UX Design</span>
      </div>
      <div class="ds-field ds-field-row">
        <label for="s-jira-labels">Jira labels</label>
        <input
          id="s-jira-labels"
          value={settings.jiraLabels}
          onInput={(e) =>
            set("jiraLabels", (e.target as HTMLInputElement).value)
          }
        />
      </div>

      <h3 class="ds-group-title">Your profile</h3>
      <div class="ds-field ds-field-row">
        <label for="s-name">Name</label>
        <input
          id="s-name"
          value={settings.authorName}
          onInput={(e) => set("authorName", (e.target as HTMLInputElement).value)}
        />
      </div>

      <h3 class="ds-group-title">Strictness</h3>
      <label class="ds-check">
        <input
          type="checkbox"
          checked={settings.strictUnmapped}
          onChange={(e) =>
            set("strictUnmapped", (e.target as HTMLInputElement).checked)
          }
        />
        Fail ❖ names with no catalog entry
      </label>

      <div class="ds-row" style={{ marginTop: 14 }}>
        <Button variant="primary" onClick={onSave}>
          Save settings
        </Button>
      </div>

      <h3 class="ds-group-title">Other</h3>
      <Button variant="secondary" onClick={onResetOnboarding}>
        Reset onboarding
      </Button>
    </div>
  );
}
