export type {
  InstanceSnapshot,
  Finding,
  FindingCode,
  FindingSeverity,
  ProposalDraft,
  ProposalType,
  PropKind,
} from "./types.js";

export {
  stripFigmaDecorators,
  normalizeFigmaValue,
  normalizePropName,
} from "./normalize.js";

export {
  buildIndex,
  matchComponent,
  normalizeComponentName,
  type CatalogIndex,
  type MatchResult,
} from "./match.js";

export { loadCatalogIndex } from "./index-loader.js";

export {
  checkInstance,
  checkInstances,
  type CheckOptions,
  type CheckReport,
  type InstanceResult,
} from "./check.js";

export {
  proposalToMarkdown,
  findingToProposalDefaults,
  buildFigmaUrl,
  type ProposalContext,
} from "./proposal.js";

export { suggestClosestValue, levenshtein } from "./suggest.js";
