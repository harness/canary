import type { Finding } from "../../core/types";
import { Button } from "./Button";

type Props = {
  finding: Finding;
  onSelect?: (nodeId: string) => void;
  onPropose?: (finding: Finding) => void;
};

const SEV_LABEL: Record<string, string> = {
  fail: "Fail",
  warn: "Warn",
  info: "Info",
  pass: "Pass",
};

const SEV_GLYPH: Record<string, string> = {
  fail: "×",
  warn: "!",
  pass: "✓",
};

export function FindingRow({ finding, onSelect, onPropose }: Props) {
  // Failures always propose; so does anything else that ships defaults, which
  // is how an uncatalogued component gets raised.
  const canPropose =
    Boolean(onPropose) &&
    (finding.severity === "fail" || Boolean(finding.proposeDefaults));

  return (
    <article class={`ds-finding ds-finding-${finding.severity}`}>
      <div class="ds-finding-head">
        <span
          class={`ds-finding-sev ds-finding-sev-${finding.severity}`}
          title={finding.code}
        >
          {SEV_GLYPH[finding.severity] ? (
            <span class="ds-finding-glyph" aria-hidden="true">
              {SEV_GLYPH[finding.severity]}
            </span>
          ) : null}
          {SEV_LABEL[finding.severity] ?? finding.severity}
        </span>
        {finding.propName ? (
          <span class="ds-code ds-finding-prop">{finding.propName}</span>
        ) : null}
      </div>
      <p class="ds-finding-msg">{finding.message}</p>
      {finding.expected?.length ? (
        <p class="ds-finding-meta">
          Expected: {finding.expected.join(", ")}
          {finding.actual ? ` · Actual: ${finding.actual}` : ""}
        </p>
      ) : null}
      {finding.bindingHint ? (
        <p class="ds-finding-meta">Binding: {finding.bindingHint}</p>
      ) : null}
      <div class="ds-finding-actions">
        {onSelect ? (
          <Button
            size="sm"
            variant="secondary"
            aria-label={`Select layer ${finding.nodeId}`}
            onClick={() => onSelect(finding.nodeId)}
          >
            Select
          </Button>
        ) : null}
        {canPropose ? (
          <Button
            size="sm"
            variant="primary"
            aria-label="Propose this gap"
            onClick={() => onPropose?.(finding)}
          >
            Propose
          </Button>
        ) : null}
      </div>
    </article>
  );
}
