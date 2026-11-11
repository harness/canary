import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

import { describe, expect, it } from 'vitest'
import { parse as parseYaml } from 'yaml'

const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const SCRIPT_PATH = path.resolve(__dirname, '../ds-consumer-check.ts')
const FIXTURES = path.resolve(__dirname, 'fixtures')

function implementedChecks(): string[] {
  const script = fs.readFileSync(SCRIPT_PATH, 'utf-8')
  const block = script.slice(script.indexOf('const RULES'), script.indexOf('const RAW_ELEMENTS'))
  return [...block.matchAll(/^\s{2}'([a-z-]+)':/gm)].map(m => m[1])
}

function run(target: string): Promise<{ exitCode: number; stdout: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('tsx', [SCRIPT_PATH, target], { cwd: PACKAGE_ROOT })
    let stdout = ''
    proc.stdout.on('data', data => {
      stdout += data.toString()
    })
    proc.on('error', reject)
    proc.on('close', exitCode => resolve({ exitCode: exitCode ?? 0, stdout }))
  })
}

describe('ds-consumer-check', () => {
  it('passes code that follows the design system', async () => {
    const { exitCode, stdout } = await run(path.join(FIXTURES, 'consumer-good'))
    expect(stdout).toContain('All checks passed.')
    expect(exitCode).toBe(0)
  }, 30_000)

  it('fails every check on a deliberately violating file', async () => {
    const { exitCode, stdout } = await run(path.join(FIXTURES, 'consumer-bad'))
    expect(exitCode).toBe(1)
    for (const name of implementedChecks()) {
      expect(stdout, `${name} should fail`).toMatch(new RegExp(`FAIL  ${name}\\b`))
    }
  }, 30_000)

  it('keeps implemented checks and pattern-doc frontmatter in sync', () => {
    const declared = new Set<string>()
    const docs = [
      path.join(PACKAGE_ROOT, 'docs/system/shared-rules.md'),
      ...fs
        .readdirSync(path.join(PACKAGE_ROOT, 'docs/system'))
        .filter(f => f.endsWith('-patterns.md'))
        .map(f => path.join(PACKAGE_ROOT, 'docs/system', f)),
      ...fs
        .readdirSync(path.join(PACKAGE_ROOT, 'schemas'))
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(PACKAGE_ROOT, 'schemas', f))
    ]
    for (const doc of docs) {
      const match = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(doc, 'utf-8'))
      const checks = (match ? (parseYaml(match[1]) as { checks?: string[] } | null)?.checks : undefined) ?? []
      checks.forEach(name => declared.add(name))
    }
    const implemented = implementedChecks()
    expect([...declared].sort()).toEqual([...implemented].sort())
    expect(implemented.length).toBeGreaterThan(0)
  })

  it('does not use numbered rule ids in the docs', () => {
    for (const rel of ['docs/system/shared-rules.md', 'docs/system/page-patterns.md', 'schemas/drawer.md']) {
      expect(fs.readFileSync(path.join(PACKAGE_ROOT, rel), 'utf-8'), rel).not.toMatch(/DSC-\d/)
    }
  })
})
