import { useMemo, useState } from "preact/hooks";
import type { CatalogEntry } from "../../schema";
import type { CatalogIndex } from "../../core/match";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";

type Props = {
  index: CatalogIndex;
  onCheckSelection: (entry: CatalogEntry) => void;
};

export function CatalogTab({ index, onCheckSelection }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    index.entries[0]?.id ?? null,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.entries;
    return index.entries.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.figma.name.toLowerCase().includes(q) ||
        e.code.export.toLowerCase().includes(q),
    );
  }, [index.entries, query]);

  const entry =
    filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  if (index.entries.length === 0) {
    return (
      <EmptyState
        title="No catalog loaded"
        body="Open Settings and choose bundled Canary."
      />
    );
  }

  return (
    <div>
      <div class="ds-field">
        <label for="cat-search">Search components</label>
        <input
          id="cat-search"
          value={query}
          placeholder="Button, Badge…"
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        />
      </div>

      <div class="ds-field">
        <label for="cat-component">Component</label>
        <select
          id="cat-component"
          value={entry?.id ?? ""}
          disabled={filtered.length === 0}
          onChange={(e) =>
            setSelectedId((e.target as HTMLSelectElement).value)
          }
        >
          {filtered.length === 0 ? (
            <option value="">No matches</option>
          ) : (
            filtered.map((e) => (
              <option key={e.id} value={e.id}>
                {e.code.export}
              </option>
            ))
          )}
        </select>
        {filtered.length !== index.entries.length ? (
          <span class="hint">
            Showing {filtered.length} of {index.entries.length}
          </span>
        ) : (
          <span class="hint">{index.entries.length} components</span>
        )}
      </div>

      {entry ? (
        <div>
          <h2 class="ds-entry-title">
            {entry.code.export}
            <span class="ds-chip">{entry.status}</span>
          </h2>
          <p class="ds-finding-meta">
            {entry.id} · Figma: {entry.figma.name} · {entry.code.package}
          </p>

          <h3 class="ds-group-title">Shared</h3>
          <table class="ds-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Values</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {entry.shared.map((p) => (
                <tr key={p.name}>
                  <td class="ds-code">{p.name}</td>
                  <td>{p.values?.join(", ") ?? p.type ?? "—"}</td>
                  <td>{p.default !== undefined ? String(p.default) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 class="ds-group-title">designOnly</h3>
          {entry.designOnly.length === 0 ? (
            <p class="ds-finding-meta">None catalogued yet.</p>
          ) : (
            <table class="ds-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>mapsTo</th>
                </tr>
              </thead>
              <tbody>
                {entry.designOnly.map((p) => (
                  <tr key={p.name}>
                    <td class="ds-code">{p.name}</td>
                    <td>{p.mapsTo ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 class="ds-group-title">codeOnly</h3>
          <p class="ds-finding-meta">
            Runtime-only — never shown as Figma failures:{" "}
            {entry.codeOnly.map((p) => p.name).join(", ") || "—"}
          </p>

          {entry.bindings ? (
            <>
              <h3 class="ds-group-title">Bindings</h3>
              <ul class="ds-list">
                {Object.entries(entry.bindings).map(([k, v]) => (
                  <li key={k}>
                    <span class="ds-code">{k}</span> → {v}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {entry.patterns?.length ? (
            <>
              <h3 class="ds-group-title">Patterns</h3>
              <ul class="ds-list">
                {entry.patterns.map((p) => (
                  <li key={p}>
                    {p.startsWith("http") ? (
                      <a href={p} target="_blank" rel="noreferrer">
                        {p}
                      </a>
                    ) : (
                      <span class="ds-code">{p}</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div class="ds-row" style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={() => onCheckSelection(entry)}>
              Check selection for this component
            </Button>
          </div>
        </div>
      ) : query.trim() ? (
        <EmptyState
          title="No matching components"
          body="Try a different search, or clear the field to see the full list."
        />
      ) : null}
    </div>
  );
}
