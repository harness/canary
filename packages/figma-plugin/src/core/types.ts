/**
 * Core types for the Canary Copilot check / proposal engine.
 * Authoritative shapes from the implementation plan.
 */

export type PropKind = "shared" | "designOnly" | "codeOnly";

export type {
  CatalogProp,
  CatalogEntry,
  CatalogManifest,
} from "../schema/schema.js";

export type InstanceSnapshot = {
  nodeId: string;
  nodeName: string;
  /**
   * The main component's own name. For a variant this is the property
   * combination (`variant=primary, size=md`), not a human component name —
   * use `componentSetName` or `componentDisplayName()` for that.
   */
  mainComponentName: string | null;
  componentKey: string | null;
  /** Name of the enclosing COMPONENT_SET, when the main component is a variant. */
  componentSetName?: string | null;
  /** Published key of that set — what a catalog records for a variant set. */
  componentSetKey?: string | null;
  isFromLibrary: boolean | null;
  properties: Record<string, string | boolean | number>;
  propertyDefinitions?: Array<{ name: string; type: string }>;
  /**
   * Figma node type. Anything other than `INSTANCE` was collected because its
   * name looks like a catalog component — i.e. a detached or local copy.
   */
  nodeType?: string;
  /** Nearest collected ancestor, so inner parts can be folded into it. */
  parentNodeId?: string | null;
};

export type FindingSeverity = "pass" | "info" | "warn" | "fail";

export type FindingCode =
  | "PASS"
  | "DESIGN_ONLY_OK"
  | "FAIL_SHARED_VALUE"
  | "FAIL_UNKNOWN_PROP"
  | "FAIL_DETACHED"
  | "FAIL_UNMAPPED"
  | "INFO_UNMAPPED"
  | "WARN_NAME_MISMATCH";

export type ProposalType =
  | "shared"
  | "designOnly"
  | "codeOnly"
  | "pattern"
  | "component"
  | "token";

export type ProposalDraft = {
  title: string;
  type: ProposalType;
  problem: string;
  attemptedWorkaround: string;
  requestedChange: string;
  surfaces: string[];
  designOnlyNote?: string;
  acceptanceSuggestion?: string;
  authorName: string;
  authorPersona: string;
  figmaFileKey?: string;
  figmaNodeId?: string;
  figmaUrl?: string;
  catalogId?: string;
};

export type Finding = {
  code: FindingCode;
  severity: FindingSeverity;
  nodeId: string;
  catalogId?: string;
  propName?: string;
  actual?: string;
  expected?: string[];
  message: string;
  bindingHint?: string;
  proposeDefaults?: Partial<ProposalDraft>;
};
