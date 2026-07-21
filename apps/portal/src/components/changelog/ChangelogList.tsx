import { useMemo, useState } from "react";
import {
  CardSelect,
  Layout,
  Pagination,
  StatusBadge,
  Text,
} from "@harnessio/ui/components";
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

function openPullRequest(entry: ChangelogEntry) {
  window.open(entry.url, "_blank", "noopener,noreferrer");
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

          <CardSelect.Root
            type="single"
            layout="vertical"
            gap="sm"
            className="changelog-card-select"
            onValueChange={(value: unknown) => {
              const entry = monthEntries.find(
                (item) => item.prNumber === Number(value),
              );
              if (entry) openPullRequest(entry);
            }}
          >
            {monthEntries.map((entry) => (
              <CardSelect.Item
                key={entry.prNumber}
                value={entry.prNumber}
                className="changelog-card-select-item"
              >
                <Layout.Horizontal
                  align="center"
                  gap="sm"
                  className="changelog-item-meta"
                >
                  <StatusBadge size="sm" variant="outline" theme="merged">
                    PR #{entry.prNumber}
                  </StatusBadge>
                  <Text variant="caption-normal" color="foreground-3">
                    {formatDate(entry.mergedAt)}
                  </Text>
                  <Text variant="caption-normal" color="foreground-3">
                    @{entry.author}
                  </Text>
                </Layout.Horizontal>

                <CardSelect.Title>{entry.title}</CardSelect.Title>
                <CardSelect.Description>
                  {getEntrySummary(entry)}
                </CardSelect.Description>
              </CardSelect.Item>
            ))}
          </CardSelect.Root>
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
          font-size: var(--cn-font-size-4, 0.875rem);
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

        .changelog-card-select {
          width: 100%;
        }

        .changelog-card-select .cn-card-select-check {
          display: none;
        }

        .changelog-card-select .cn-card-select-item[data-state="checked"] {
          border-color: var(--cn-border-brand);
          background: var(--cn-bg-1);
        }

        .changelog-card-select-item .cn-card-select-content-container {
          display: flex;
          flex-direction: column;
          gap: var(--cn-layout-3xs, 4px);
          min-width: 0;
        }

        .changelog-item-meta {
          flex-wrap: wrap;
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
