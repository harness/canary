/**
 * Types for the AI Code Review (AICR) settings UI.
 *
 * Backend APIs are not finalized — these shapes are intentionally kept minimal
 * and only cover what the UI renders. They mirror the AICR DB design doc
 * (aicr_settings + aicr_criteria) at a presentational level. When swaggers
 * are generated the consumer will adapt its store to satisfy these types.
 */

export enum AicrCriterionSeverity {
  SUGGESTIVE = 'suggestive',
  CRITICAL = 'critical'
}

export enum AicrErrorType {
  FETCH_SETTINGS = 'fetchSettings',
  UPDATE_SUCCESS_CRITERIA = 'updateSuccessCriteria',
  UPDATE_LLM_CONNECTOR = 'updateLlmConnector',
  UPDATE_AGENT = 'updateAgent',
  UPDATE_KNOWLEDGE_GRAPH = 'updateKnowledgeGraph',
  UPDATE_SYSTEM_PROMPT = 'updateSystemPrompt',
  UPDATE_AGENT_SKILLS = 'updateAgentSkills'
}

export interface AicrApiError {
  type: AicrErrorType
  message: string
}

/**
 * One success criterion (row in aicr_criteria).
 * Identifier is the stable id; display/prompt/severity are user-tunable.
 */
export interface AicrCriterion {
  identifier: string
  display: string
  prompt: string
  severity: AicrCriterionSeverity
  enabled: boolean
  bypass: boolean
  githubCheck: boolean
}

export interface AicrConnectorRef {
  identifier: string
  name: string
}

export interface AicrAgentRef {
  identifier: string
  name: string
}

export interface AicrAgentSkillRef {
  identifier: string
  label: string
}

/**
 * Catalog of knowledge sources the agent can query.
 * Provided by the host (it knows which Harness modules are licensed/enabled).
 * Each entry maps to one checkbox in the Knowledge Graph section.
 */
export interface AicrKnowledgeSource {
  identifier: string
  label: string
  disabled?: boolean
}

export interface AicrSettings {
  successCriteria: AicrCriterion[]
  llmConnectorRef: AicrConnectorRef | null
  agentRef: AicrAgentRef | null
  knowledgeSources: string[]
  systemPrompt: string
  agentSkills: AicrAgentSkillRef[]
  githubSingleCheck?: boolean
}

/**
 * Loading flags surfaced section-by-section so each section can show
 * its own skeleton / disabled state without blocking the rest of the page.
 */
export interface AicrLoadingStates {
  isLoadingSettings: boolean
  isUpdatingSuccessCriteria: boolean
  isUpdatingLlmConnector: boolean
  isUpdatingAgent: boolean
  isUpdatingKnowledgeGraph: boolean
  isUpdatingSystemPrompt: boolean
  isUpdatingAgentSkills: boolean
}

/**
 * Store contract injected by the host (codev2 / platformUI).
 * The canary page never fetches data itself.
 */
export interface IRepoAicrStore {
  settings: AicrSettings | null
  availableConnectors: AicrConnectorRef[]
  availableAgents: AicrAgentRef[]
  availableKnowledgeSources: AicrKnowledgeSource[]
  availableAgentSkills: AicrAgentSkillRef[]
}
