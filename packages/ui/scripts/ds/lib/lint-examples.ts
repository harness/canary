import { createRequire } from 'node:module'
import { join } from 'node:path'

interface LintMessage {
  message: string
}

interface Linter {
  verify: (code: string, config: unknown) => LintMessage[]
}

const RULE_PREFIX = /^([A-Z]{2,5}-\d{3}):/

const cache = new Map<string, { linter: Linter; config: unknown }>()

const load = (repoRoot: string): { linter: Linter; config: unknown } => {
  const cached = cache.get(repoRoot)
  if (cached) return cached
  const require = createRequire(join(repoRoot, 'package.json'))
  const { Linter: LinterClass } = require('eslint') as { Linter: new () => Linter }
  const { classNameRules } = require(join(repoRoot, 'eslint/rules.js')) as { classNameRules: unknown[] }
  const loaded = {
    linter: new LinterClass(),
    config: {
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      rules: { 'no-restricted-syntax': ['error', ...classNameRules] }
    }
  }
  cache.set(repoRoot, loaded)
  return loaded
}

/**
 * Runs the contract className rules from eslint/rules.js (the ones .eslintrc.js
 * passes to no-restricted-syntax) over a JSX example. A message that starts
 * with a rule ID, such as 'SBD-007: ...', is attributed to that rule.
 */
export const lintExample = (code: string, repoRoot: string): { rule?: string; message: string }[] => {
  const { linter, config } = load(repoRoot)
  return linter.verify(`const example = (\n<>\n${code}\n</>\n)\n`, config).map(({ message }) => ({
    rule: RULE_PREFIX.exec(message)?.[1],
    message
  }))
}
