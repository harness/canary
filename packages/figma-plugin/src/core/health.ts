import type { CatalogEntry } from '../schema/schema.js'
import type { Finding } from './types.js'

export type HealthStatus = 'healthy' | 'needsAttention' | 'atRisk' | 'blocked'

export type HealthDimension = {
  id: string
  weight: number
  score: number
  passedWeight: number
  totalWeight: number
  evaluated: number
  total: number
}

export type ComponentHealth = {
  catalogId: string
  score: number
  status: HealthStatus
  blocked: boolean
  blockers: string[]
  evaluationCoverage: number
  automationCoverage: number
  dimensions: HealthDimension[]
}

type EvaluationProfile = {
  dimensions: Record<string, number>
  severityWeights: Record<string, number>
  thresholds: {
    healthy: number
    needsAttention: number
    atRisk: number
  }
  blockedOnCritical: boolean
}

type RequirementEvaluation = {
  requirementId: string
  dimension: string
  severity: string
  enforcement: string
  result: 'pass' | 'fail' | 'unevaluated'
  fresh: boolean
}

type AuditReceipt = {
  evaluations: RequirementEvaluation[]
}

function round(value: number): number {
  return Math.round(value)
}

function statusFor(score: number, blocked: boolean, profile: EvaluationProfile): HealthStatus {
  if (blocked) return 'blocked'
  if (score >= profile.thresholds.healthy) return 'healthy'
  if (score >= profile.thresholds.needsAttention) return 'needsAttention'
  return 'atRisk'
}

export function scoreComponentHealth(entry: CatalogEntry, findings: Finding[]): ComponentHealth {
  const profile = entry.evaluationProfile as EvaluationProfile | undefined
  const receipt = entry.baselineReceipt as AuditReceipt | undefined
  if (!profile || !receipt) {
    return {
      catalogId: entry.id,
      score: 0,
      status: 'atRisk',
      blocked: false,
      blockers: [],
      evaluationCoverage: 0,
      automationCoverage: 0,
      dimensions: []
    }
  }

  const evaluations = receipt.evaluations.map(evaluation => ({ ...evaluation }))
  const liveFailures = new Set(
    findings
      .filter(finding => finding.severity === 'fail' && finding.requirementId)
      .map(finding => finding.requirementId as string)
  )
  for (const evaluation of evaluations) {
    if (liveFailures.has(evaluation.requirementId)) {
      evaluation.result = 'fail'
      evaluation.fresh = true
    }
  }

  const dimensions = Object.entries(profile.dimensions).map(([id, weight]) => {
    const relevant = evaluations.filter(evaluation => evaluation.dimension === id)
    const totalWeight = relevant.reduce(
      (sum, evaluation) => sum + (profile.severityWeights[evaluation.severity] ?? 0),
      0
    )
    const passedWeight = relevant.reduce(
      (sum, evaluation) =>
        sum +
        (evaluation.result === 'pass' && evaluation.fresh ? (profile.severityWeights[evaluation.severity] ?? 0) : 0),
      0
    )
    return {
      id,
      weight,
      score: totalWeight > 0 ? round((passedWeight / totalWeight) * 100) : 0,
      passedWeight,
      totalWeight,
      evaluated: relevant.filter(evaluation => evaluation.result !== 'unevaluated' && evaluation.fresh).length,
      total: relevant.length
    }
  })

  const score = round(dimensions.reduce((sum, dimension) => sum + (dimension.score * dimension.weight) / 100, 0))
  const blockers = evaluations
    .filter(evaluation => evaluation.result === 'fail' && evaluation.severity === 'critical')
    .map(evaluation => evaluation.requirementId)
  const blocked = profile.blockedOnCritical && blockers.length > 0
  const evaluatedCount = evaluations.filter(
    evaluation => evaluation.result !== 'unevaluated' && evaluation.fresh
  ).length
  const automatedCount = evaluations.filter(evaluation => evaluation.enforcement === 'automated').length

  return {
    catalogId: entry.id,
    score,
    status: statusFor(score, blocked, profile),
    blocked,
    blockers,
    evaluationCoverage: evaluations.length > 0 ? round((evaluatedCount / evaluations.length) * 100) : 0,
    automationCoverage: evaluations.length > 0 ? round((automatedCount / evaluations.length) * 100) : 0,
    dimensions
  }
}
