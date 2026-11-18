import type { FC, ReactNode } from "react";
import { Accordion, StatusBadge, Text } from "@harnessio/ui/components";

// Hand-maintained change log entries. To add a new entry, prepend an object to
// this array: give it a unique `value`, the `date`, `status` (+ `statusTheme`),
// and `title` shown in the collapsed header, and the `body` revealed when the
// item is expanded.
interface ChangelogEntry {
  value: string;
  // First published @harnessio/ui version that includes the change.
  version: string;
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
    value: "uui-4247",
    version: "1.6.10",
    date: "November 6, 2026",
    status: "Shipped",
    statusTheme: "success",
    title: "Component playgrounds and new component docs (UUI-4247)",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-1">
          Component pages now include an interactive playground with compact
          prop controls, and the Overview / Usage / Properties page tabs.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          New docs: <Code>Gauge</Code> and <Code>Meter</Code> (Data Viz),{" "}
          <Code>SearchableDropdown</Code> (Search Input),{" "}
          <Code>MentionTextarea</Code> (Textarea), <Code>HighlightText</Code>{" "}
          (Text), <Code>WaterfallProgress</Code> (Progress), plus Stepped Flow,
          Steppers and PLG.
        </Text>
      </>
    ),
  },
  {
    value: "bold-code-variants",
    version: "1.6.1",
    date: "November 2, 2026",
    status: "Shipped",
    statusTheme: "success",
    title: "Bold code typography variants",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-1">
          Added <Code>body-code-strong</Code> and{" "}
          <Code>caption-code-strong</Code>: bold (mono <Code>700</Code>)
          counterparts of <Code>body-code</Code> and <Code>caption-code</Code>,
          with the same size and line-height.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          Available as <Code>{'<Text variant="body-code-strong" />'}</Code> /{" "}
          <Code>{'<Text variant="caption-code-strong" />'}</Code> and the{" "}
          <Code>.font-body-code-strong</Code> /{" "}
          <Code>.font-caption-code-strong</Code> utilities, backed by the new{" "}
          <Code>--cn-body-code-strong</Code> and{" "}
          <Code>--cn-caption-code-strong</Code> tokens.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          Use them in place of raw bold weights on monospaced text.
        </Text>
      </>
    ),
  },
  {
    value: "uui-4416",
    version: "1.6.0",
    date: "November 2, 2026",
    status: "Shipped",
    statusTheme: "success",
    title: "Font weight buckets renamed and retired (UUI-4416)",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-1">
          The <Code>heading</Code> weight bucket is now{" "}
          <strong>
            <Code>500</Code>
          </strong>{" "}
          (optical 500, “Medium”), so every bucket name matches the weight it
          renders. <strong>Breaking:</strong>{" "}
          <Code>--cn-font-weight-default-normal-heading</Code> is now{" "}
          <Code>--cn-font-weight-default-normal-500</Code>.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          The unused <Code>600</Code> bucket (optical 530) and the deprecated{" "}
          <Code>500</Code> bucket (optical 440) are removed;{" "}
          <Code>--cn-font-weight-default-normal-600</Code> no longer exists.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          The light and bold weights are removed as well: the <Code>300</Code>{" "}
          and <Code>700</Code> buckets (and mono <Code>300</Code>), the{" "}
          <Code>body-light</Code> and <Code>caption-light</Code> typography
          variants (<Code>{"<Text>"}</Code> variants, <Code>.font-*</Code>{" "}
          utilities, and their lint rule), while mono <Code>700</Code> (Bold)
          stays.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          Use <Code>body-normal</Code> / <Code>caption-normal</Code> instead of
          the light variants. Other <Code>.font-*</Code> utilities and{" "}
          <Code>{"<Text>"}</Code> variants are unaffected.
        </Text>
      </>
    ),
  },
  {
    value: "uui-4286",
    version: "1.5.6",
    date: "October 23, 2026",
    status: "In Progress",
    statusTheme: "warning",
    title: "Semibold weights migrated to the heading weight",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-1">
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
        <Text as="p" variant="body-normal" color="foreground-1">
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
    version: "1.4.0",
    date: "October 7, 2026",
    status: "In Progress",
    statusTheme: "warning",
    title: "Typography weight normalization",
    body: (
      <>
        <Text as="p" variant="body-normal" color="foreground-1">
          The typography scale has been normalized to two optical weights:{" "}
          <strong>Regular (400)</strong> and{" "}
          <strong>Semibold (600, which renders at optical 530)</strong> for
          Inter, while JetBrains Mono keeps <strong>Regular</strong> and{" "}
          <strong>Bold</strong>. The in-between weights are no longer part of
          the recommended scale, and every <Code>.font-*</Code> utility and{" "}
          <Code>{"<Text>"}</Code> variant now resolves to one of these
          normalized weights.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
          The previous <strong>light (300)</strong>,{" "}
          <strong>medium (500)</strong>, and <strong>bold (700)</strong> weights
          have <strong>not been removed</strong> — they are retained for
          backwards-compatibility and are now marked <strong>deprecated</strong>{" "}
          across every layer of the system: the <Code>caption-light</Code> Text
          variant, the <Code>.font-body-light</Code> and{" "}
          <Code>.font-caption-light</Code> utilities, the{" "}
          <Code>body.light</Code> and <Code>caption.light</Code> composite
          tokens, and the underlying weight primitives (Inter{" "}
          <Code>300 / 500 / 700</Code>, JetBrains Mono <Code>300 / 500</Code>).
          Existing usage keeps working and the deprecated specimens remain on
          the <a href="/foundations/typography/">Typography foundations</a> page
          for reference, but new adoption is blocked by an ESLint rule — migrate
          to the <Code>-normal</Code> / <Code>-strong</Code> siblings instead.
        </Text>
        <Text as="p" variant="body-normal" color="foreground-1">
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
              <Text variant="caption-code" color="foreground-3">
                @harnessio/ui v{entry.version}
              </Text>
              <StatusBadge
                variant="outline"
                theme={entry.statusTheme}
                size="sm"
              >
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
