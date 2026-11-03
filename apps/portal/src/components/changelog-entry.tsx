import type { ReactNode } from "react";
import { Accordion, StatusBadge, Text } from "@harnessio/ui/components";

type ChangelogStatus = "released" | "migrating" | "unreleased";

const STATUS: Record<
  ChangelogStatus,
  { label: string; theme: "success" | "warning" | "muted" }
> = {
  released: { label: "Released", theme: "success" },
  migrating: { label: "Migrating", theme: "warning" },
  unreleased: { label: "Unreleased", theme: "muted" },
};

interface ChangelogEntryProps {
  title: string;
  startDate: string;
  endDate?: string;
  status: ChangelogStatus;
  /** @harnessio/ui version that ships this change */
  version?: string;
  children: ReactNode;
}

export default function ChangelogEntry({
  title,
  startDate,
  endDate,
  status,
  version,
  children,
}: ChangelogEntryProps) {
  const { label, theme } = STATUS[status];

  return (
    <Accordion.Root type="multiple" className="changelog-entry">
      <Accordion.Item value="entry">
        <Accordion.Trigger>
          <span className="flex flex-col items-start gap-cn-3xs">
            <Text as="span" variant="caption-normal" color="foreground-3">
              {startDate} – {endDate ?? "TBD"}
            </Text>
            <span className="flex flex-wrap items-center gap-cn-sm">
              <StatusBadge variant="outline" theme={theme} size="sm">
                {label}
              </StatusBadge>
              <Text as="span" variant="heading-base" color="foreground-1">
                {title}
              </Text>
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <div className="mb-cn-sm flex items-center gap-cn-xs">
            <Text as="span" variant="caption-normal" color="foreground-3">
              @harnessio/ui version
            </Text>
            <Text as="span" variant="body-code" color="foreground-1">
              {version ?? "Not yet recorded"}
            </Text>
          </div>
          <div className="changelog-entry-body">{children}</div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
