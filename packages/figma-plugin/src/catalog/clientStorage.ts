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
  jiraBaseUrl: string;
  jiraProjectId: string;
  jiraIssueTypeId: string;
  jiraLabels: string;
  authorName: string;
  strictUnmapped: boolean;
};

export const DEFAULT_SETTINGS: SettingsState = {
  catalogSource: "bundled",
  manifestUrl: "",
  jiraBaseUrl: "https://harness.atlassian.net",
  jiraProjectId: "11439",
  jiraIssueTypeId: "10309",
  jiraLabels: "ds-contracts,proposal",
  authorName: "",
  strictUnmapped: false,
};
