/** Storage key helpers for plugin clientStorage (via main-thread bridge). */

export const STORAGE_KEYS = {
  catalogCache: "catalogCache:v1",
  settings: "settings:v1",
  onboardingDone: "onboardingDone:v1",
  proposalDrafts: "proposalDrafts:v1",
} as const;

export type SettingsState = {
  catalogSource: "bundled" | "url";
  manifestUrl: string;
  githubRepo: string;
  githubLabels: string;
  authorName: string;
  authorPersona: string;
  strictUnmapped: boolean;
};

/** Path P author personas — matches 05-contribution-and-standards-check.md §5. */
export const AUTHOR_PERSONAS = [
  "Figma designer",
  "Cursor designer",
  "PM",
  "Marketing",
  "Engineer",
] as const;

export type AuthorPersona = (typeof AUTHOR_PERSONAS)[number];

const PERSONA_ALIASES: Record<string, AuthorPersona> = {
  "marketing Track A": "Marketing",
  eng: "Engineer",
};

export function normalizeAuthorPersona(value: string | undefined): AuthorPersona {
  if (!value) return "Figma designer";
  if ((AUTHOR_PERSONAS as readonly string[]).includes(value)) {
    return value as AuthorPersona;
  }
  return PERSONA_ALIASES[value] ?? "Figma designer";
}

export const DEFAULT_SETTINGS: SettingsState = {
  catalogSource: "bundled",
  manifestUrl: "",
  githubRepo: "harness/canary",
  githubLabels: "ds-contracts,proposal",
  authorName: "",
  authorPersona: "Figma designer",
  strictUnmapped: false,
};
