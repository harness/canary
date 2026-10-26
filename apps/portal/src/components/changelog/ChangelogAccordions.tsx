import type { FC, ReactNode } from "react";
import { Accordion, StatusBadge, Text } from "@harnessio/ui/components";

// Hand-maintained change log entries. To add a new entry, prepend an object to
// this array: give it a unique `value`, the `date`, `status` (+ `statusTheme`),
// and `title` shown in the collapsed header, and the `body` revealed when the
// item is expanded.
interface ChangelogEntry {
  value: string;
  date: string;
  status: string;
  // Intent color for the status chip: "info" for upcoming/planned work,
  // "warning" for in-progress, "success" once shipped.
  statusTheme: "info" | "warning" | "success";
  title: string;
  body: ReactNode;
}

// Inline code chip — mirrors the markdown `code` styling used elsewhere on the
// site, since island content sits outside Starlight's `.content` prose styles.
const Code: FC<{ children: ReactNode }> = ({ children }) => (
  <code className="font-body-code bg-cn-2 rounded-cn-1 px-cn-3xs py-[0.1em] text-[0.9em]">
    {children}
  </code>
);

const ENTRIES: ChangelogEntry[] = [
  {
    value: "weight-bucket-cleanup",
    date: "Planned",
    status: "Upcoming",
    statusTheme: "info",
    title: "Retiring the 600 weight bucket and renaming heading → 500",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-2">
          An upcoming release will retire the deprecated weight buckets and align
          the remaining bucket names with the optical weight they actually render.
          The <Code>600</Code> bucket (optical <Code>530</Code>, the old semibold)
          will be <strong>removed</strong> — it is already unused across the
          library after the October 23 migration and is kept only for
          backwards-compatibility. The deprecated <Code>500</Code> bucket (optical{" "}
          <Code>440</Code>) will be retired in the same pass.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          With <Code>530</Code> and <Code>440</Code> gone, the <Code>heading</Code>{" "}
          bucket (optical 500) will be <strong>renamed to <Code>500</Code></strong>
          , so every bucket name finally matches the weight it renders and the one
          “named for its role” exception disappears. In CSS-variable terms,{" "}
          <Code>--cn-font-weight-default-normal-heading</Code> becomes{" "}
          <Code>--cn-font-weight-default-normal-500</Code>, and{" "}
          <Code>--cn-font-weight-default-normal-600</Code> goes away entirely.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          <strong>Nothing changes</strong> for code that uses the{" "}
          <Code>.font-*</Code> utilities or <Code>{"<Text>"}</Code> variants —
          those resolve through the composite tokens automatically. Only code that
          references the raw weight variables directly is affected. Before this
          lands, migrate any direct use of{" "}
          <Code>--cn-font-weight-default-normal-600</Code> onto the heading weight
          (or a literal <Code>font-weight: 530</Code> if you specifically need the
          old semibold), and expect{" "}
          <Code>--cn-font-weight-default-normal-heading</Code> to be renamed to{" "}
          <Code>--cn-font-weight-default-normal-500</Code>.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          This will ship as one coordinated change across <Code>@harnessio/ui</Code>{" "}
          and its consumers. A dated entry will replace this one once it lands.
        </Text>
      </>
    ),
  },
  {
    value: "uui-4286",
    date: "October 23, 2026",
    status: "In Progress",
    statusTheme: "warning",
    title: "Semibold weights migrated to the heading weight",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-2">
          Every typographic style that previously rendered{" "}
          <strong>Semibold (optical 530)</strong> now renders at the{" "}
          <strong>
            <Code>heading</Code> weight (optical 500, “Medium”)
          </strong>{" "}
          — lighter and more balanced while keeping clear hierarchy over body
          text. This covers the <Code>-strong</Code> body and caption styles (
          <Code>body-strong</Code>, <Code>body-single-line-strong</Code>,{" "}
          <Code>caption-strong</Code>), <Code>micro-normal</Code>, small links,
          dialog titles, emphasized and heading markdown, chart values, and the
          Avatar, Stepper, Drawer, and Sheet titles. Nothing needs to change in
          consuming code — the <Code>.font-*</Code> utilities and{" "}
          <Code>{"<Text>"}</Code> variants resolve to the new weight
          automatically.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          The <Code>600</Code> bucket (optical <Code>530</Code>) is{" "}
          <strong>no longer used</strong> anywhere in the library. It remains
          defined for backwards-compatibility, and a follow-up will retire it —
          along with the other deprecated weight buckets — once remaining direct
          consumers migrate.
        </Text>
      </>
    ),
  },
  {
    value: "uui-3467",
    date: "October 7, 2026",
    status: "In Progress",
    statusTheme: "warning",
    title: "Typography weight normalization",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-2">
          The typography scale has been normalized to two optical weights:{" "}
          <strong>Regular (400)</strong> and{" "}
          <strong>Semibold (600, which renders at optical 530)</strong> for
          Inter, while JetBrains Mono keeps <strong>Regular</strong> and{" "}
          <strong>Bold</strong>. The in-between weights are no longer part of the
          recommended scale, and every <Code>.font-*</Code> utility and{" "}
          <Code>{"<Text>"}</Code> variant now resolves to one of these
          normalized weights.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          The previous <strong>light (300)</strong>, <strong>medium (500)</strong>
          , and <strong>bold (700)</strong> weights have{" "}
          <strong>not been removed</strong> — they are retained for
          backwards-compatibility and are now marked <strong>deprecated</strong>{" "}
          across every layer of the system: the <Code>caption-light</Code> Text
          variant, the <Code>.font-body-light</Code> and{" "}
          <Code>.font-caption-light</Code> utilities, the <Code>body.light</Code>{" "}
          and <Code>caption.light</Code> composite tokens, and the underlying
          weight primitives (Inter <Code>300 / 500 / 700</Code>, JetBrains Mono{" "}
          <Code>300 / 500</Code>). Existing usage keeps working and the
          deprecated specimens remain on the{" "}
          <a href="/foundations/typography/">Typography foundations</a> page for
          reference, but new adoption is blocked by an ESLint rule — migrate to
          the <Code>-normal</Code> / <Code>-strong</Code> siblings instead.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-2">
          <strong>
            Timeline — started October 7, 2026 · due October 30, 2026.
          </strong>{" "}
          Teams should complete migration off the deprecated weights to the{" "}
          <Code>-normal</Code> / <Code>-strong</Code> siblings before this date.
        </Text>
      </>
    ),
  },
];

const ChangelogAccordions: FC = () => (
  <Accordion.Root type="multiple" size="md" className="not-content">
    {ENTRIES.map((entry) => (
      <Accordion.Item key={entry.value} value={entry.value}>
        <Accordion.Trigger>
          <span className="flex flex-col gap-cn-3xs text-left">
            <span className="flex items-center gap-cn-sm">
              <Text variant="caption-normal" color="foreground-3">
                {entry.date}
              </Text>
              <StatusBadge variant="outline" theme={entry.statusTheme} size="sm">
                {entry.status}
              </StatusBadge>
            </span>
            <Text variant="heading-base" color="foreground-1">
              {entry.title}
            </Text>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-cn-md pt-cn-xs">{entry.body}</div>
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);

export default ChangelogAccordions;
