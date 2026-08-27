/* Generated from component-contract-schema.mjs. Do not edit. */
export type ContractScalar = string | number | boolean | null
export type ContractSurface = 'figma' | 'react'
export type ContractStatus = 'draft' | 'piloting' | 'stable' | 'deprecated'
export type ConstraintStatus = 'supported' | 'deprecated' | 'unsupported'
export type HealthDimension =
  | 'contractDefinition'
  | 'figmaImplementation'
  | 'codeImplementation'
  | 'designCodeParity'
  | 'governanceEvidence'
export type RequirementSeverity = 'critical' | 'major' | 'minor' | 'informational'
export type EnforcementMode = 'automated' | 'manual' | 'advisory'

export type ComponentContract = {
  schemaVersion: '0.5.0'
  contractVersion: string
  identity: Record<string, unknown>
  semantics: Record<string, unknown>
  lifecycle: { status: ContractStatus; replacementId?: string }
  ownership: { team: string; contacts: string[] }
  surfaces: Partial<Record<ContractSurface, Record<string, unknown>>>
  anatomy: Array<Record<string, unknown>>
  properties: Array<Record<string, unknown>>
  slots: Array<Record<string, unknown>>
  states: Array<Record<string, unknown>>
  constraints: {
    exhaustive: boolean
    dimensions: string[]
    combinations: Array<{
      id: string
      status: ConstraintStatus
      surfaces: ContractSurface[]
      conditions: Record<string, ContractScalar[]>
      description: string
      migrationId?: string
      ruleId?: string
    }>
  }
  tokens: Array<Record<string, unknown>>
  presentation: Record<string, unknown>
  usage: Record<string, unknown>
  examples: Array<Record<string, unknown>>
  evaluations: Array<{
    id: string
    dimension: HealthDimension
    severity: RequirementSeverity
    enforcement: EnforcementMode
    statement: string
    remediation?: string
    evaluator?: string
    maxAgeDays?: number
  }>
  migrations: Array<Record<string, unknown>>
  evidenceReferences: { sources: Array<Record<string, unknown>> }
}
