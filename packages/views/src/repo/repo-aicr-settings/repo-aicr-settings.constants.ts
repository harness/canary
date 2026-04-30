import {
  AicrAgentSkillRef,
  AicrCriterion,
  AicrCriterionSeverity,
  AicrKnowledgeSource
} from './repo-aicr-settings.types'

export const DEFAULT_AICR_SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the pull request diff and provide actionable feedback on:
- Code correctness and potential bugs
- Security vulnerabilities
- Performance issues
- Code style and best practices
- Test coverage gaps

Be concise and specific. Reference line numbers when possible.`

/**
 * Pre-filled success criteria seeded for new repos so users get value
 * out of the box. Hosts may persist or override these.
 */
export const DEFAULT_AICR_SUCCESS_CRITERIA: AicrCriterion[] = [
  {
    identifier: 'security_review',
    display: 'Security review',
    prompt: 'Check for common security vulnerabilities and credential leaks',
    severity: AicrCriterionSeverity.CRITICAL,
    enabled: true,
    bypass: false,
    githubCheck: true
  },
  {
    identifier: 'performance_review',
    display: 'Performance review',
    prompt: 'Identify potential performance regressions and N+1 queries',
    severity: AicrCriterionSeverity.SUGGESTIVE,
    enabled: true,
    bypass: true,
    githubCheck: false
  },
  {
    identifier: 'no_pii_in_logs',
    display: 'Must not leak PII in logs',
    prompt: 'Make sure all new log statements do not leak PII',
    severity: AicrCriterionSeverity.CRITICAL,
    enabled: true,
    bypass: false,
    githubCheck: true
  }
]

/**
 * Default knowledge-graph catalog. Hosts SHOULD pass their own catalog
 * (which Harness modules are licensed) — this is a sensible fallback.
 */
export const DEFAULT_AICR_KNOWLEDGE_SOURCES: AicrKnowledgeSource[] = [
  { identifier: 'deployment_history', label: 'Deployment History' },
  { identifier: 'ci_results', label: 'CI Results' },
  { identifier: 'test_intelligence', label: 'Test Intelligence' },
  { identifier: 'service_reliability_metrics', label: 'Service Reliability Metrics' },
  { identifier: 'security_scans_sto', label: 'Security Scans (STO)' },
  { identifier: 'code_quality_metrics', label: 'Code Quality Metrics' },
  { identifier: 'error_tracking_srm', label: 'Error Tracking (SRM)' },
  { identifier: 'performance_metrics', label: 'Performance Metrics' },
  { identifier: 'feature_flag_history', label: 'Feature Flag History' }
]

export const DEFAULT_AICR_AGENT_SKILLS: AicrAgentSkillRef[] = [
  { identifier: 'grep', label: 'Grep' },
  { identifier: 'run-smoke-test', label: 'Run smoke test' },
  { identifier: 'lsp-query', label: 'LSP query' },
  { identifier: 'read-file', label: 'Read file' },
  { identifier: 'read-diff', label: 'Read diff' }
]

export const AICR_CRITERION_IDENTIFIER_MAX_LENGTH = 64
export const AICR_CRITERION_DISPLAY_MAX_LENGTH = 100
export const AICR_CRITERION_PROMPT_MAX_LENGTH = 500
export const AICR_SYSTEM_PROMPT_MAX_LENGTH = 4000
