import { useMemo, useState } from "react";
import { Pagination, StatusBadge, Text } from "@harnessio/ui/components";
import changelog from "@/data/changelog.json";

export interface ChangelogEntry {
  prNumber: number;
  title: string;
  summary: string;
  url: string;
  mergedAt: string;
  author: string;
}

const PAGE_SIZE = 10;

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthGroup(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function groupByMonth(
  entries: ChangelogEntry[],
): Map<string, ChangelogEntry[]> {
  const groups = new Map<string, ChangelogEntry[]>();

  for (const entry of entries) {
    const key = formatMonthGroup(entry.mergedAt);
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  return groups;
}

function cleanTitle(title: string): string {
  return title
    .replace(/^(feat|fix|chore|docs)(\([^)]+\))?:\s*/i, "")
    .replace(/^\[[^\]]+\]:\s*/, "")
    .trim();
}

function getEntrySummary(entry: ChangelogEntry): string {
  if (entry.summary && entry.summary !== entry.title) {
    return entry.summary;
  }

  const subject = cleanTitle(entry.title);
  const normalized =
    subject.charAt(0).toUpperCase() + subject.slice(1).replace(/\.$/, "");

  return `${normalized}. Review the merged pull request for the complete set of changes and discussion.`;
}

export default function ChangelogList() {
  const entries = changelog as ChangelogEntry[];
  const [page, setPage] = useState(1);

  const pageEntries = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return entries.slice(start, start + PAGE_SIZE);
  }, [entries, page]);

  const groups = useMemo(() => groupByMonth(pageEntries), [pageEntries]);

  if (entries.length === 0) {
    return (
      <div className="changelog-empty not-content">
        <p>No changes recorded yet.</p>
        <p className="changelog-empty-hint">
          Entries are added automatically when pull requests merge to main.
        </p>
      </div>
    );
  }

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, entries.length);

  return (
    <div className="changelog-list not-content">
      <div className="changelog-toolbar">
        <Text variant="body-normal" color="foreground-3">
          Showing {startIndex}–{endIndex} of {entries.length} changes
        </Text>
      </div>

      {Array.from(groups.entries()).map(([month, monthEntries]) => (
        <section key={`${page}-${month}`} className="changelog-group">
          <h2 className="changelog-month">{month}</h2>

          <div className="changelog-entries">
            {monthEntries.map((entry) => (
              <a
                key={entry.prNumber}
                className="changelog-entry"
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="changelog-entry-dot" aria-hidden="true" />
                <div className="changelog-entry-meta">
                  <StatusBadge size="sm" variant="outline" theme="merged">
                    PR #{entry.prNumber}
                  </StatusBadge>
                  <Text
                    as="time"
                    dateTime={entry.mergedAt}
                    variant="caption-normal"
                    color="foreground-3"
                  >
                    {formatDate(entry.mergedAt)}
                  </Text>
                  <Text variant="caption-normal" color="foreground-3">
                    @{entry.author}
                  </Text>
                </div>

                <Text
                  as="h3"
                  variant="heading-small"
                  color="foreground-1"
                  className="changelog-entry-title"
                >
                  {cleanTitle(entry.title)}
                </Text>
                <Text
                  variant="body-normal"
                  color="foreground-2"
                  className="changelog-entry-summary"
                >
                  {getEntrySummary(entry)}
                </Text>
              </a>
            ))}
          </div>
        </section>
      ))}

      {entries.length > PAGE_SIZE && (
        <Pagination
          className="changelog-pagination"
          totalItems={entries.length}
          pageSize={PAGE_SIZE}
          currentPage={page}
          goToPage={setPage}
        />
      )}

      <style>{`
        .changelog-empty {
          padding: var(--cn-layout-lg, 24px);
          border-radius: var(--cn-rounded-6, 8px);
          border: 1px dashed var(--cn-border-3);
          background: var(--cn-set-gray-outline-bg, transparent);
          text-align: center;
        }

        .changelog-empty p {
          margin: 0;
          color: var(--cn-text-2);
          font-size: var(--cn-font-size-3, 0.75rem);
        }

        .changelog-empty-hint {
          margin-top: var(--cn-layout-xs, 8px) !important;
          color: var(--cn-text-3) !important;
          font-size: var(--cn-font-size-5, 0.8125rem) !important;
        }

        .changelog-list {
          display: flex;
          flex-direction: column;
          gap: var(--cn-layout-2xl, 40px);
          margin-top: var(--cn-layout-lg, 24px);
        }

        .changelog-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .changelog-group {
          display: flex;
          flex-direction: column;
          gap: var(--cn-layout-md, 16px);
        }

        .changelog-month {
          font-size: var(--cn-font-size-2, 1.125rem);
          font-weight: 600;
          color: var(--cn-text-1);
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Timeline rail the entries hang off of. */
        .changelog-entries {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--cn-layout-xl, 32px);
          margin: 0;
          padding-left: var(--cn-layout-lg, 24px);
          border-left: 1px solid var(--cn-border-3);
        }

        .changelog-entry {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--cn-layout-2xs, 6px);
          text-decoration: none;
          color: inherit;
        }

        /* Dot sitting on the rail, centered over the 1px border. Rendered as
           a real element (not a pseudo) to keep this inline style free of
           quote characters, which the SSR pass escapes and then mismatches on
           hydration. */
        .changelog-entry-dot {
          position: absolute;
          top: 7px;
          left: calc(-1 * var(--cn-layout-lg, 24px) - 4.5px);
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--cn-bg-1);
          border: 2px solid var(--cn-border-3);
          transition:
            border-color 0.15s ease,
            background-color 0.15s ease,
            transform 0.15s ease;
        }

        .changelog-entry:hover .changelog-entry-dot {
          border-color: var(--cn-border-brand);
          background-color: var(--cn-border-brand);
          transform: scale(1.2);
        }

        .changelog-entry-meta {
          display: flex;
          align-items: center;
          gap: var(--cn-layout-xs, 8px);
          flex-wrap: wrap;
        }

        .changelog-entry-title {
          margin: 0;
          letter-spacing: -0.01em;
          transition: color 0.15s ease;
        }

        .changelog-entry:hover .changelog-entry-title {
          color: var(--cn-text-brand, var(--cn-border-brand));
        }

        .changelog-entry-summary {
          margin: 0;
          max-width: 68ch;
          line-height: 1.55;
        }

        .changelog-entry:focus-visible {
          outline: 2px solid var(--cn-border-brand);
          outline-offset: 4px;
          border-radius: var(--cn-rounded-3, 4px);
        }

        .changelog-entry:focus-visible .changelog-entry-dot {
          border-color: var(--cn-border-brand);
          background-color: var(--cn-border-brand);
        }

        .changelog-pagination {
          margin-top: 0 !important;
          padding-top: var(--cn-layout-md, 16px);
          border-top: 1px solid var(--cn-border-3);
        }
      `}</style>
    </div>
  );
}
