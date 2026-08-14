import type { CatalogEntry, ConstraintRule } from '../schema/schema.js'
import type { CanonicalSnapshot, CanonicalValue } from './canonical.js'
import type { Finding } from './types.js'

export type ConstraintStatus = 'supported' | 'deprecated' | 'unsupported' | 'invalid'

export type ConstraintEvaluation = {
  status: ConstraintStatus
  rule?: ConstraintRule
  findings: Finding[]
}

type Migration = {
  id?: unknown
  instructions?: unknown
}

function requirementId(entry: CatalogEntry): string | undefined {
  const requirement = (entry.requirements ?? []).find(candidate => candidate.evaluator === 'constraint')
  return typeof requirement?.id === 'string' ? requirement.id : undefined
}

function matchesRule(values: Record<string, CanonicalValue>, rule: ConstraintRule): boolean {
  return Object.entries(rule.conditions).every(([dimension, allowed]) =>
    allowed.some(candidate => candidate === values[dimension])
  )
}

export function evaluateConstraints(
  canonical: CanonicalSnapshot,
  entry: CatalogEntry,
  nodeId = ''
): ConstraintEvaluation {
  const constraints = entry.constraints
  if (!constraints) return { status: 'supported', findings: [] }

  const missing = constraints.dimensions.filter(dimension => canonical.values[dimension] === undefined)
  if (missing.length > 0) {
    return {
      status: 'invalid',
      findings: [
        {
          code: 'FAIL_CONSTRAINT_COVERAGE',
          severity: 'fail',
          nodeId,
          catalogId: entry.id,
          requirementId: requirementId(entry),
          expected: missing,
          message: `Cannot evaluate the approved combination because ${missing.join(', ')} could not be resolved from Figma.`
        }
      ]
    }
  }

  const matches = constraints.rules.filter(rule => matchesRule(canonical.values, rule))
  if (matches.length !== 1) {
    return {
      status: 'invalid',
      findings: [
        {
          code: 'FAIL_CONSTRAINT_COVERAGE',
          severity: 'fail',
          nodeId,
          catalogId: entry.id,
          requirementId: requirementId(entry),
          message:
            matches.length === 0
              ? 'This combination is not covered by the exhaustive contract matrix.'
              : `This combination matches multiple contract rules: ${matches.map(({ id }) => id).join(', ')}.`
        }
      ]
    }
  }

  const rule = matches[0]
  if (rule.status === 'supported') return { status: 'supported', rule, findings: [] }

  if (rule.status === 'deprecated') {
    const migration = (entry.migrations ?? []).map(item => item as Migration).find(({ id }) => id === rule.migrationId)
    const instructions = typeof migration?.instructions === 'string' ? ` ${migration.instructions}` : ''
    return {
      status: 'deprecated',
      rule,
      findings: [
        {
          code: 'WARN_DEPRECATED_COMBINATION',
          severity: 'warn',
          nodeId,
          catalogId: entry.id,
          requirementId: rule.requirementId ?? requirementId(entry),
          propName: rule.id,
          message: `${rule.description}${instructions}`
        }
      ]
    }
  }

  return {
    status: 'unsupported',
    rule,
    findings: [
      {
        code: 'FAIL_UNSUPPORTED_COMBINATION',
        severity: 'fail',
        nodeId,
        catalogId: entry.id,
        requirementId: rule.requirementId ?? requirementId(entry),
        propName: rule.id,
        message: rule.description
      }
    ]
  }
}
