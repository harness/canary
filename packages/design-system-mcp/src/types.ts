export type AgentConfidence = 'stable' | 'fallback' | 'unreviewed'

export type AgentProp = {
  name: string
  type: string
  values?: string[]
  default?: string | boolean | number
  description?: string
}

export type AgentExample = {
  id: string
  name: string
  purpose: string
  recommended?: boolean
  code?: string
}

export type AgentConstraintCombination = {
  id: string
  status: 'supported' | 'deprecated' | 'unsupported'
  conditions: Record<string, Array<string | boolean | number>>
  description?: string
  migrationId?: string
  ruleId?: string
}

export type AgentConstraints = {
  exhaustive: boolean
  dimensions: string[]
  combinations?: AgentConstraintCombination[]
}

export type AgentComponent = {
  id: string
  exportName: string
  import: string
  package: string
  family: string
  category?: string
  aliases: string[]
  members?: string[]
  summary: string
  confidence: AgentConfidence
  useWhen: string[]
  avoidWhen: string[]
  related: string[]
  props: AgentProp[]
  do: string[]
  dont: string[]
  examples: AgentExample[]
  constraints?: AgentConstraints
  migrations?: Array<{ id: string; instructions: string }>
  sourcePath: string
  portalPath?: string
  contractVersion?: string
}

export type AgentIcon = {
  name: string
  import: string
  usage: string
  synonyms: string[]
}

export type AgentFoundation = {
  id: string
  title: string
  summary: string
  rules: string[]
  examples?: string[]
}

export type AgentCatalogFile<T> = {
  formatVersion: number
  sourceInventoryCount: number
  sourceSha256: string
  records: T[]
}

export type AgentCatalog = {
  components: AgentComponent[]
  icons: AgentIcon[]
  foundations: AgentFoundation[]
  sourceSha256: string
}

export type ToolError = {
  error: string
  hint: string
}

export type ComponentSearchHit = {
  id: string
  exportName: string
  summary: string
  confidence: AgentConfidence
  score: number
  why: string
}

export type IconSearchHit = {
  name: string
  usage: string
  synonyms: string[]
}

export type ValidatePropsResult = {
  status: 'supported' | 'deprecated' | 'unsupported' | 'unknown' | 'invalid'
  ruleId?: string
  message: string
  migration?: string
}
